from pypdf import PdfReader
from pathlib import Path
import re

pdf_path = Path(r"g:\Projects\CFI\K12\k12-Arch\sources\Sensei-Solution Architecture Document-1.0.pdf")
out_path = Path(r"g:\Projects\CFI\K12\k12-Arch\.copilot-tracking\research\20260120-sensei-pdf-keyword-extract.md")

keywords = [
    "elton", "concern", "risk", "issue", "recommendation", "gap",
    "event sourcing", "cqrs", "bff", "dapr", "cloudevents", "event hub", "service bus"
]
pattern = re.compile("|".join(re.escape(k) for k in keywords), re.IGNORECASE)

reader = PdfReader(str(pdf_path))

matches = []
for i, page in enumerate(reader.pages, start=1):
    text = page.extract_text() or ""
    if not text.strip():
        continue
    if not pattern.search(text):
        continue

    normalized = re.sub(r"\s+", " ", text).strip()

    snippets = []
    for m in pattern.finditer(normalized):
        start = max(0, m.start() - 140)
        end = min(len(normalized), m.end() + 240)
        snippet = normalized[start:end]
        snippets.append((m.group(0), snippet))
        if len(snippets) >= 6:
            break

    matches.append((i, snippets))

out_lines = [
    "# Sensei Solution Architecture Document 1.0 - Keyword Extract (Auto)\n\n",
    f"- Source: {pdf_path}\n",
    f"- Pages scanned: {len(reader.pages)}\n",
    f"- Keyword hits: {len(matches)} pages\n\n",
    "## Keywords\n\n",
    ", ".join(f"{k}" for k in keywords) + "\n\n",
    "## Matches (by page)\n\n",
]

for page_num, snippets in matches:
    out_lines.append(f"### Page {page_num}\n\n")
    for kw, snippet in snippets:
        out_lines.append(f"- **{kw}**: {snippet}\n")
    out_lines.append("\n")

out_path.write_text("".join(out_lines), encoding="utf-8")
print(f"Wrote: {out_path} ({out_path.stat().st_size} bytes)")
