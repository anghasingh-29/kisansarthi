<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep uploads in the existing Document Checklist page using a focused upload component to preserve navigation and other demo flows.
- Private document access uses a random HttpOnly browser capability; the API hashes it to a storage folder and never accepts caller-provided folders, avoiding login requirements and public document exposure.
- Uploads use a bounded raw HTTP endpoint for genuine byte progress; validate extension, MIME, size, and file signature server-side before writing private storage, and leave direct browser storage access denied.
