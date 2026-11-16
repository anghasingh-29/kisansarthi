import { createFileRoute } from "@tanstack/react-router";
import { MAX_FILE_BYTES, storedNameSchema, validateUpload } from "@/lib/upload-validation";

type StoredFile = { bytes: Uint8Array; type: string; size: number; name: string; createdAt: number };
const memoryFolders = new Map<string, Map<string, StoredFile>>();

function getMemoryStorage() {
  const getFolder = (folder: string) => {
    let map = memoryFolders.get(folder);
    if (!map) {
      map = new Map<string, StoredFile>();
      memoryFolders.set(folder, map);
    }
    return map;
  };
  return {
    async remove(paths: string[]) {
      for (const path of paths) {
        const slash = path.indexOf("/");
        if (slash === -1) continue;
        getFolder(path.slice(0, slash)).delete(path.slice(slash + 1));
      }
      return { error: null };
    },
    async download(path: string) {
      const slash = path.indexOf("/");
      if (slash === -1) return { data: null, error: new Error("Not found") };
      const entry = getFolder(path.slice(0, slash)).get(path.slice(slash + 1));
      if (!entry) return { data: null, error: new Error("Not found") };
      const copy = new Uint8Array(entry.bytes.byteLength);
      copy.set(entry.bytes);
      return { data: new Blob([copy.buffer], { type: entry.type }), error: null };
    },
    async list(folder: string, opts: { limit: number; offset: number }) {
      const entries = Array.from(getFolder(folder).entries())
        .sort((a, b) => b[1].createdAt - a[1].createdAt)
        .slice(opts.offset, opts.offset + opts.limit)
        .map(([id, item]) => ({
          id,
          name: id,
          metadata: { mimetype: item.type, size: item.size },
        }));
      return { data: entries, error: null };
    },
    async upload(path: string, bytes: Uint8Array, opts: { contentType: string }) {
      const slash = path.indexOf("/");
      if (slash === -1) return { error: new Error("Invalid path") };
      const folder = path.slice(0, slash);
      const id = path.slice(slash + 1);
      getFolder(folder).set(id, {
        bytes,
        type: opts.contentType,
        size: bytes.byteLength,
        name: decodeURIComponent(id.slice(38)),
        createdAt: Date.now(),
      });
      return { error: null };
    },
  };
}

// The random HttpOnly capability authenticates this browser, not an app account.
// Only its SHA-256 digest is used as the private storage folder.
async function handle(request: Request) {
  const url = new URL(request.url);
  const headers = new Headers({ "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" });
  const reply = (body: unknown, status = 200) => Response.json(body, { status, headers });
  if (request.method !== "GET" && request.headers.get("origin") !== url.origin) return reply({ error: "Please upload from this website." }, 403);
  let token = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith("ks-documents="))?.slice(13);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    if (request.method !== "GET" || url.searchParams.has("file")) return reply({ error: "Please refresh the page before uploading." }, 401);
    token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
    headers.set("Set-Cookie", `ks-documents=${token}; Path=/api/documents; HttpOnly; SameSite=Lax; Max-Age=31536000${url.protocol === "https:" ? "; Secure" : ""}`);
  }
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  const folder = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  try {
    // Privileged storage access only after verifying the browser capability;
    // every path is constructed inside its folder, never supplied by the caller.
    const hasSupabase = Boolean(process.env["SUPABASE_URL"] && process.env["SUPABASE_SERVICE_ROLE_KEY"]);
    const storage = hasSupabase
      ? (await import("@/integrations/supabase/client.server")).supabaseAdmin.storage.from("farmer-documents")
      : getMemoryStorage();
    const fileParam = url.searchParams.get("file");
    if (fileParam) {
      const parsed = storedNameSchema.safeParse(fileParam);
      if (!parsed.success) return reply({ error: "File not found." }, 404);
      const path = `${folder}/${parsed.data}`;
      if (request.method === "DELETE") {
        const { error } = await storage.remove([path]);
        if (error) throw error;
        return reply({ success: true });
      }
      if (request.method !== "GET") return reply({ error: "Choose a file to upload." }, 400);
      const { data, error } = await storage.download(path);
      if (error || !data) return reply({ error: "File not found." }, 404);
      headers.set("Content-Type", data.type);
      headers.set("Content-Disposition", "inline");
      headers.set("Content-Security-Policy", "sandbox; default-src 'none'");
      return new Response(data, { headers });
    }
    if (request.method === "GET") {
      const files = [];
      for (let offset = 0; ; offset += 100) {
        const { data, error } = await storage.list(folder, { limit: 100, offset, sortBy: { column: "created_at", order: "desc" } });
        if (error) throw error;
        for (const file of data) {
          if (!file.id || !storedNameSchema.safeParse(file.name).success) continue;
          files.push({ id: file.name, name: decodeURIComponent(file.name.slice(38)), type: file.metadata?.mimetype ?? "application/octet-stream", size: file.metadata?.size ?? 0 });
        }
        if (data.length < 100) break;
      }
      return reply({ files });
    }
    if (request.method !== "POST") return reply({ error: "Choose a file." }, 400);
    const name = decodeURIComponent(request.headers.get("x-file-name") ?? "");
    const type = request.headers.get("content-type")?.split(";")[0] ?? "";
    const declaredSize = Number(request.headers.get("content-length"));
    if (declaredSize > MAX_FILE_BYTES) return reply({ error: "Each file must be 10 MB or smaller." }, 413);
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Choose a file." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FILE_BYTES) { await reader.cancel(); return reply({ error: "Each file must be 10 MB or smaller." }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const validation = validateUpload({ name, type, size }, bytes);
    if (validation) return reply({ error: validation }, 400);
    const id = `${crypto.randomUUID()}--${encodeURIComponent(name)}`;
    const { error } = await storage.upload(`${folder}/${id}`, bytes, { contentType: type, upsert: false });
    if (error) throw error;
    return reply({ file: { id, name, type, size } }, 201);
  } catch {
    return reply({ error: "We could not complete this action. Please check your connection and try again." }, 500);
  }
}

export const Route = createFileRoute("/api/documents")({
  server: { handlers: { GET: ({ request }) => handle(request), POST: ({ request }) => handle(request), DELETE: ({ request }) => handle(request) } },
});