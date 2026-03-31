from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]  # repo root
WIKI = ROOT / "tools" / "wiki"
OUT_DIR = WIKI / "knowledge"

TARGET_DIRS = [
    "adr",
    "adr_archive",
    "02-architecture",
    "diagrams",
    "guides",
    "05-development",
    "05-testing",
    "notes",
    "principles",
    "lessons",
    "06-operations",
    "knowledge",
    "patterns",
    "04-standards",
    "07-deployment",
    "09-proposed-architecture",
    "01-project-overview",
]

ROOT_FILES = [
    "README.md",
    "TABLE_OF_CONTENTS.md",
    "index.md",
    "GLOSSARY.md",
    "PIPELINE-ARCHITECTURE.md",
    "PIPELINE-SUMMARY.md",
    "DOCUMENTATION-HEALTH-REPORT.md",
    "DOCUMENTATION-INCOMPLETENESS-SCAN.md",
    "BROKEN-LINK-FIX-PLAN.md",
    "Database-Schema-Documentation.md",
    "api-examples.md",
    "markdown-examples.md",
]

LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


@dataclass
class Node:
    id: str
    title: str
    path: str
    category: str
    status: str
    updated_at: str


@dataclass
class Edge:
    from_id: str
    type: str
    to: str



def category_for(path_str: str) -> str:
    p = path_str.replace("\\", "/")
    if "/tools/wiki/adr/" in p or "/tools/wiki/adr_archive/" in p:
        return "ADR"
    if "/tools/wiki/diagrams/" in p or "/tools/wiki/02-architecture/c4-diagrams/" in p:
        return "Diagrams"
    if any(x in p for x in ["/tools/wiki/guides/", "/tools/wiki/05-development/", "/tools/wiki/05-testing/", "/tools/wiki/01-project-overview/"]):
        return "Guides"
    if "/tools/wiki/notes/" in p or "/tools/wiki/principles/" in p:
        return "Notes"
    if "/tools/wiki/lessons/" in p or "/tools/wiki/06-operations/lessons/" in p:
        return "Lessons"
    if any(x in p for x in ["/tools/wiki/knowledge/", "/tools/wiki/patterns/", "/tools/wiki/04-standards/"]):
        return "Knowledge"
    if any(x in p for x in ["/tools/wiki/06-operations/", "/tools/wiki/07-deployment/"]) or p.endswith("/tools/wiki/PIPELINE-ARCHITECTURE.md") or p.endswith("/tools/wiki/PIPELINE-SUMMARY.md"):
        return "Ops"
    if "/tools/wiki/09-proposed-architecture/" in p:
        return "Proposed"
    if "/tools/wiki/02-architecture/" in p:
        return "Architecture"
    if "/tools/wiki/integrations/" in p:
        return "Integrations"
    return "Uncategorized"



def status_for(path: Path, content: str) -> str:
    lc = content.lower()
    p = str(path).replace("\\", "/").lower()
    if re.search(r"^\s*#\s*tbd\b", content, re.IGNORECASE | re.MULTILINE) or "detailed content pending" in lc:
        return "tbd"
    if "/archive/" in p or "/adr_archive/" in p:
        return "archived"
    if "/09-proposed-architecture/" in p:
        return "draft"
    return "active"



def iter_target_files() -> list[Path]:
    files: set[Path] = set()
    for rel in TARGET_DIRS:
        d = WIKI / rel
        if d.exists():
            files.update(d.rglob("*.md"))
    for rf in ROOT_FILES:
        f = WIKI / rf
        if f.exists():
            files.add(f)
    return sorted(files)



def main() -> None:
    files = iter_target_files()
    nodes: list[Node] = []
    edges: list[Edge] = []

    for file in files:
        rel = file.relative_to(ROOT).as_posix()
        node_id = rel.lower()
        content = file.read_text(encoding="utf-8", errors="ignore")
        node = Node(
            id=node_id,
            title=file.stem,
            path=rel,
            category=category_for(str(file)),
            status=status_for(file, content),
            updated_at=datetime.fromtimestamp(file.stat().st_mtime, tz=timezone.utc).isoformat(),
        )
        nodes.append(node)

        for match in LINK_RE.findall(content):
            target = match.strip()
            if not target or target.startswith("#") or target.startswith("http://") or target.startswith("https://"):
                continue
            edges.append(Edge(from_id=node_id, type="CITES", to=target))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    nodes_path = OUT_DIR / "KG-03-nodes.json"
    edges_path = OUT_DIR / "KG-03-edges.json"
    nodes_path.write_text(json.dumps([asdict(n) for n in nodes], indent=2), encoding="utf-8")
    edges_path.write_text(json.dumps([asdict(e) for e in edges], indent=2), encoding="utf-8")

    counts: dict[str, int] = {}
    for n in nodes:
        counts[n.category] = counts.get(n.category, 0) + 1

    print(f"NODES_TOTAL\t{len(nodes)}")
    for k in sorted(counts):
        print(f"NODES_{k}\t{counts[k]}")
    print(f"EDGES_CITES_TOTAL\t{len(edges)}")
    print(f"NODES_FILE\t{nodes_path}")
    print(f"EDGES_FILE\t{edges_path}")


if __name__ == "__main__":
    main()
