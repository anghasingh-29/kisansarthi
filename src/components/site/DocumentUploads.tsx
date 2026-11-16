import { useEffect, useRef, useState } from "react";
import { FileText, Image, UploadCloud, Trash2, Eye, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize, validateUpload } from "@/lib/upload-validation";
import { useLanguage, type Language } from "@/lib/i18n";

// Files stay in this browser tab only (object URLs). Nothing is sent to a server.
type LocalFile = { id: string; name: string; type: string; size: number; url: string };
const ACCEPT = ".pdf,.jpg,.jpeg,.png";
const ALLOWED = ["application/pdf", "image/jpeg", "image/png"];

async function check(file: File, lang: Language, invalidTypeMsg: string) {
  if (!ALLOWED.includes(file.type)) return invalidTypeMsg;
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  return validateUpload({ name: file.name, size: file.size, type: file.type }, header, lang);
}

export function DocumentUploads() {
  const { lang, t } = useLanguage();
  const u = t.uploads;
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [errors, setErrors] = useState<{ id: string; name: string; error: string }[]>([]);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<string | null>(null);
  const urls = useRef(new Set<string>());
  useEffect(() => { const active = urls.current; return () => active.forEach((url) => URL.revokeObjectURL(url)); }, []);

  function browse(accept: string, replaceId: string | null = null) {
    if (!input.current) return;
    replaceTarget.current = replaceId;
    input.current.accept = accept;
    input.current.multiple = !replaceId;
    input.current.click();
  }
  function release(url: string) { URL.revokeObjectURL(url); urls.current.delete(url); }

  async function add(selected: File[]) {
    const replaceId = replaceTarget.current;
    replaceTarget.current = null;
    for (const file of replaceId ? selected.slice(0, 1) : selected) {
      const error = await check(file, lang, u.invalidTypeClient);
      if (error) { setErrors((prev) => [...prev, { id: crypto.randomUUID(), name: file.name, error }]); continue; }
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      const item = { id: replaceId ?? crypto.randomUUID(), name: file.name, type: file.type, size: file.size, url };
      setFiles((prev) => {
        if (!replaceId) return [item, ...prev];
        return prev.map((row) => { if (row.id !== replaceId) return row; release(row.url); return item; });
      });
      setMessage(replaceId ? u.replacedMsg(file.name) : u.addedMsg(file.name));
    }
  }
  function remove(file: LocalFile) {
    release(file.url);
    setFiles((prev) => prev.filter((row) => row.id !== file.id));
    if (preview === file.id) setPreview(null);
    setMessage(u.removedMsg(file.name));
  }
  const shown = files.find((f) => f.id === preview);

  return (
    <section id="uploads" aria-labelledby="upload-title" className="mx-auto max-w-6xl px-4 py-8">
      <h2 id="upload-title" className="text-2xl font-bold text-primary">{u.title}</h2>
      <p className="mt-2 text-muted-foreground">{u.subtitle}</p>
      <p className="mt-3 flex items-start gap-2 rounded-lg border border-primary/30 bg-secondary p-3 text-sm"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{u.previewOnlyNotice}</p>
      <input ref={input} type="file" multiple className="sr-only" tabIndex={-1} aria-label={u.selectAriaLabel} accept={ACCEPT} onChange={(event) => { void add(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Button size="lg" className="h-20 justify-start rounded-xl px-6 text-lg [&_svg]:size-7" onClick={() => browse(".pdf")}><FileText />{u.uploadPdf}</Button>
        <Button variant="outline" size="lg" className="h-20 justify-start rounded-xl border-primary/30 px-6 text-lg text-primary [&_svg]:size-7" onClick={() => browse(".jpg,.jpeg,.png")}><Image />{u.uploadImage}</Button>
      </div>
      <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); replaceTarget.current = null; void add(Array.from(event.dataTransfer.files)); }} className={`mt-4 flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center ${dragging ? "border-primary bg-secondary" : "border-primary/30 bg-surface"}`}>
        <UploadCloud className="h-9 w-9 text-primary" />
        <p className="font-medium">{u.dragDropPrompt}</p>
        <Button size="lg" className="h-12 rounded-xl" onClick={() => browse(ACCEPT)}>{u.browseFiles}</Button>
        <p className="text-xs text-muted-foreground">{u.fileLimitHint}</p>
      </div>
      <p role="status" aria-live="polite" className="mt-4 break-words text-sm">{message}</p>
      {errors.length > 0 && <ul className="mt-4 space-y-3">{errors.map((e) => <li key={e.id} className="flex items-start justify-between gap-3 rounded-lg border p-4"><div className="min-w-0"><p className="break-words font-medium">{e.name}</p><p role="alert" className="mt-1 text-sm text-destructive">{e.error}</p></div><Button variant="ghost" size="icon" aria-label={u.dismissFileError(e.name)} onClick={() => setErrors((prev) => prev.filter((row) => row.id !== e.id))}><Trash2 /></Button></li>)}</ul>}
      {files.length > 0 && <><h3 className="mt-6 font-semibold">{u.selectedFilesCount(files.length)}</h3><ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{files.map((file) => <li key={file.id} className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="flex aspect-[3/2] items-center justify-center border-b bg-secondary">{file.type.startsWith("image/") ? <img src={file.url} alt={file.name} className="h-full w-full object-contain" /> : <FileText className="h-14 w-14 text-primary" />}</div>
        <div className="p-4"><p className="break-words font-medium">{file.name}</p><p className="mt-1 text-xs text-muted-foreground">{file.type} · {formatFileSize(file.size)}</p><p className="mt-2 text-xs text-muted-foreground">{u.readyToPreview}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2"><Button variant="outline" onClick={() => setPreview(file.id)}><Eye />{u.preview}</Button><Button variant="outline" aria-label={u.replaceAriaLabel(file.name)} onClick={() => browse(file.type === "application/pdf" ? ".pdf" : ".jpg,.jpeg,.png", file.id)}><RefreshCw />{u.replace}</Button><Button variant="ghost" size="icon" className="ml-auto" title={u.removeTitle} aria-label={u.removeAriaLabel(file.name)} onClick={() => remove(file)}><Trash2 /></Button></div>
        </div>
      </li>)}</ul></>}
      {shown && <div className="mt-6 border-t pt-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h3 className="min-w-0 break-words font-semibold">{shown.name}</h3><Button variant="outline" onClick={() => setPreview(null)}>{u.closePreview}</Button></div>{shown.type.startsWith("image/") ? <img src={shown.url} alt={shown.name} className="max-h-[32rem] w-full object-contain" /> : <><object data={shown.url} type="application/pdf" className="h-[32rem] w-full"><p className="text-sm">{u.pdfFallback}</p></object><Button asChild variant="link" className="mt-2"><a href={shown.url} target="_blank" rel="noopener noreferrer">{u.openPdf}</a></Button></>}</div>}
    </section>
  );
}
