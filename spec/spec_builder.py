#!/usr/bin/env python3
"""
spec_builder.py — bygger Scenkonsult-specens Dok 1–6 som .docx.

Ramverk + innehåll i samma fil så att en framtida session kan ändra en
paragraf och bygga om alla dokument med ett kommando:

    python3 spec_builder.py [utkatalog]

Blocktyper (se BLOCKS nedan):
    ("h1",   "1. Rubrik")
    ("h2",   "1.1 Underrubrik")
    ("p",    "Brödtext med **fet** och `kod`")
    ("ul",   ["punkt", "punkt"])
    ("table", [["Rubrik A","Rubrik B"], ["rad","rad"]])      # första raden = header
    ("note",  "Gråmarkerad varningsruta")
    ("code",  "monospace-block")
"""

import sys
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor, Cm

# ── Formatmall ────────────────────────────────────────────────────────────────

FONT_BODY = "Calibri"
FONT_MONO = "Consolas"
INK = RGBColor(0x1A, 0x1A, 0x1A)
ACCENT = RGBColor(0x1E, 0x18, 0x50)   # brand-navy
MUTED = RGBColor(0x60, 0x60, 0x60)
NOTE_BG = "F2F0FA"
HEAD_BG = "1E1850"


def _shade(cell, hex_fill):
    el = OxmlElement("w:shd")
    el.set(qn("w:val"), "clear")
    el.set(qn("w:fill"), hex_fill)
    cell._tc.get_or_add_tcPr().append(el)


def _rich(par, text, mono=False, color=None, size=10.5):
    """Skriver text med **fet** och `kod` till en paragraf."""
    buf, bold, code = "", False, False

    def flush():
        nonlocal buf
        if not buf:
            return
        r = par.add_run(buf)
        r.font.name = FONT_MONO if (code or mono) else FONT_BODY
        r.font.size = Pt(size - 0.5 if (code or mono) else size)
        r.font.color.rgb = color or INK
        r.bold = bold
        buf = ""

    i = 0
    while i < len(text):
        if text.startswith("**", i):
            flush(); bold = not bold; i += 2
        elif text[i] == "`":
            flush(); code = not code; i += 1
        else:
            buf += text[i]; i += 1
    flush()


def build(doc_no, title, subtitle, version, date, blocks, outdir, slug):
    d = Document()
    for s in d.sections:
        s.left_margin = s.right_margin = Cm(2.2)
        s.top_margin = s.bottom_margin = Cm(2.0)

    normal = d.styles["Normal"]
    normal.font.name = FONT_BODY
    normal.font.size = Pt(10.5)

    # Titelblock
    p = d.add_paragraph(); r = p.add_run("Scenkonsult Norden")
    r.bold = True; r.font.size = Pt(11); r.font.color.rgb = MUTED
    p.paragraph_format.space_after = Pt(2)

    p = d.add_paragraph(); r = p.add_run(f"DOKUMENT {doc_no} · {title}")
    r.bold = True; r.font.size = Pt(22); r.font.color.rgb = ACCENT
    p.paragraph_format.space_after = Pt(2)

    p = d.add_paragraph(); r = p.add_run(subtitle)
    r.italic = True; r.font.size = Pt(10.5); r.font.color.rgb = MUTED
    p.paragraph_format.space_after = Pt(2)

    p = d.add_paragraph()
    r = p.add_run(f"{version} · {date} · Sigvardsson Consulting Group AB · "
                  "Faktiskt repo-tillstånd — verifierat mot main")
    r.font.size = Pt(9); r.font.color.rgb = MUTED
    p.paragraph_format.space_after = Pt(14)

    for kind, payload in blocks:
        if kind == "h1":
            p = d.add_paragraph(); p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(4)
            r = p.add_run(payload)
            r.bold = True; r.font.size = Pt(15); r.font.color.rgb = ACCENT

        elif kind == "h2":
            p = d.add_paragraph(); p.paragraph_format.space_before = Pt(11)
            p.paragraph_format.space_after = Pt(3)
            r = p.add_run(payload)
            r.bold = True; r.font.size = Pt(12); r.font.color.rgb = ACCENT

        elif kind == "p":
            p = d.add_paragraph(); p.paragraph_format.space_after = Pt(6)
            _rich(p, payload)

        elif kind == "ul":
            for item in payload:
                p = d.add_paragraph(style="List Bullet")
                p.paragraph_format.space_after = Pt(2)
                _rich(p, item)

        elif kind == "code":
            t = d.add_table(rows=1, cols=1); t.style = "Table Grid"
            c = t.cell(0, 0); _shade(c, "F6F6F6")
            c.paragraphs[0].paragraph_format.space_after = Pt(0)
            _rich(c.paragraphs[0], payload, mono=True)
            d.add_paragraph().paragraph_format.space_after = Pt(4)

        elif kind == "note":
            t = d.add_table(rows=1, cols=1); t.style = "Table Grid"
            c = t.cell(0, 0); _shade(c, NOTE_BG)
            c.paragraphs[0].paragraph_format.space_after = Pt(0)
            _rich(c.paragraphs[0], payload)
            d.add_paragraph().paragraph_format.space_after = Pt(4)

        elif kind == "table":
            rows = payload
            t = d.add_table(rows=len(rows), cols=len(rows[0]))
            t.style = "Table Grid"; t.alignment = WD_TABLE_ALIGNMENT.LEFT
            for ri, row in enumerate(rows):
                for ci, val in enumerate(row):
                    c = t.cell(ri, ci)
                    c.paragraphs[0].paragraph_format.space_after = Pt(1)
                    if ri == 0:
                        _shade(c, HEAD_BG)
                        _rich(c.paragraphs[0], f"**{val}**",
                              color=RGBColor(0xFF, 0xFF, 0xFF), size=10)
                    else:
                        _rich(c.paragraphs[0], val, size=10)
            d.add_paragraph().paragraph_format.space_after = Pt(4)

    p = d.add_paragraph(); p.paragraph_format.space_before = Pt(16)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(f"Dok {doc_no} · {version} · {date}")
    r.italic = True; r.font.size = Pt(9); r.font.color.rgb = MUTED

    name = f"Scenkonsult_Spec_Dok{doc_no}_{slug}_{version.replace('.', '_')}.docx"
    path = Path(outdir) / name
    d.save(path)
    return path


if __name__ == "__main__":
    from spec_content import DOCS
    out = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    out.mkdir(parents=True, exist_ok=True)
    for spec in DOCS:
        print("✅", build(outdir=out, **spec).name)
