import { z } from "zod";
import { translations, type Language } from "@/lib/i18n";

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const uploadMetaSchema = z.object({
  name: z.string().min(1).max(180).refine((name) => !/[\x00-\x1f/\\]/.test(name), "Please use a simple file name."),
  size: z.number().int().positive().max(MAX_FILE_BYTES, "Each file must be 10 MB or smaller."),
  type: z.enum(["application/pdf", "image/jpeg", "image/png", "image/webp"]),
});

export function validateUpload(
  meta: { name: string; size: number; type: string },
  bytes?: Uint8Array,
  lang: Language = "en",
) {
  const msg = translations[lang].validation;
  const parsed = uploadMetaSchema.safeParse(meta);
  if (!parsed.success) return meta.size > MAX_FILE_BYTES ? msg.maxFileSize : msg.invalidFileChoice;
  const ext = meta.name.split(".").pop()?.toLowerCase();
  const expected = ext === "pdf" ? "application/pdf" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "";
  if (expected !== meta.type) return msg.typeMismatch;
  if (!bytes) return null;
  const starts = (...values: number[]) => values.every((value, index) => bytes[index] === value);
  const text = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const valid = meta.type === "application/pdf" ? text(0, 5) === "%PDF-" : meta.type === "image/jpeg" ? starts(255, 216, 255) : meta.type === "image/png" ? starts(137, 80, 78, 71, 13, 10, 26, 10) : text(0, 4) === "RIFF" && text(8, 12) === "WEBP";
  return valid ? null : msg.invalidContent;
}

export const storedNameSchema = z.string().max(700).regex(/^[0-9a-f-]{36}--[^/\\]+$/).refine((name) => !name.includes(".."));
export function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}