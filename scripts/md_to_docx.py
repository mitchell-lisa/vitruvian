#!/usr/bin/env python3
"""md_to_docx.py — Convert markdown files to .docx for Google Drive upload.

Drive auto-converts .docx into Google Docs format on upload, giving Luke
(and anyone else) a clean editable surface in Google Docs. Markdown
features supported: headings, paragraphs, bold/italic, lists, code spans,
blockquotes, tables, links.

Usage:
    python scripts/md_to_docx.py docs/01-product-definition.md
    python scripts/md_to_docx.py docs/*.md --out build/drive-upload/03_Product
    python scripts/md_to_docx.py --product   # rebuild the 03_Product bundle
"""

from __future__ import annotations
import argparse
import re
from pathlib import Path

import markdown
from docx import Document
from docx.shared import Pt
from htmldocx import HtmlToDocx

REPO_ROOT = Path(__file__).resolve().parent.parent

PRODUCT_FILES = [
    ("docs/01-product-definition.md",     "01-Product-Definition.docx"),
    ("docs/02-mvp-design.md",             "02-MVP-Design.docx"),
    ("docs/03-mechanical-system.md",      "03-Mechanical-System.docx"),
    ("docs/04-sensor-ai-system.md",       "04-Sensor-AI-System.docx"),
    ("docs/05-user-experience-flow.md",   "05-User-Experience-Flow.docx"),
    ("docs/06-prototype-build-plan.md",   "06-Prototype-Build-Plan.docx"),
    ("docs/07-what-to-cut.md",            "07-What-to-Cut.docx"),
    ("docs/08-what-makes-this-special.md","08-What-Makes-This-Special.docx"),
    ("docs/20-integration-roadmap.md",    "20-Integration-Roadmap.docx"),
    ("docs/PRODUCT_REDESIGN.md",          "Product-Redesign.docx"),
]


def md_to_html(md_text: str) -> str:
    return markdown.markdown(
        md_text,
        extensions=["extra", "tables", "fenced_code", "sane_lists", "toc"],
    )


def convert(src: Path, dest: Path) -> None:
    md_text = src.read_text(encoding="utf-8")
    html = md_to_html(md_text)

    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(11)

    HtmlToDocx().add_html_to_document(html, doc)
    dest.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(dest))


def _display_path(p: Path) -> str:
    """Render a path as repo-relative when possible, else absolute."""
    abs_p = p.resolve()
    try:
        return str(abs_p.relative_to(REPO_ROOT))
    except ValueError:
        return str(abs_p)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("inputs", nargs="*", type=Path,
                   help="Markdown files (relative or absolute).")
    p.add_argument("--out", type=Path, default=None,
                   help="Output directory. If omitted with --product, "
                        "defaults to build/drive-upload/03_Product/.")
    p.add_argument("--product", action="store_true",
                   help="Rebuild the 03_Product Drive-upload bundle "
                        "(uses pre-mapped filenames).")
    args = p.parse_args()

    if args.product:
        out = args.out or (REPO_ROOT / "build" / "drive-upload" / "03_Product")
        for src_rel, dest_name in PRODUCT_FILES:
            src = REPO_ROOT / src_rel
            dest = out / dest_name
            convert(src, dest)
            print(f"  {_display_path(src)}  →  {_display_path(dest)}")
        print(f"\n{len(PRODUCT_FILES)} files written to {_display_path(out)}/")
        return

    if not args.inputs:
        p.error("Either pass markdown files as positional args, or use --product.")

    out = args.out or REPO_ROOT / "build" / "converted"
    for src in args.inputs:
        dest = out / (src.stem + ".docx")
        convert(src, dest)
        print(f"  {src}  →  {dest}")


if __name__ == "__main__":
    main()
