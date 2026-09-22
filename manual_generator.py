"""
Scenkonsult Norden — PDF-manualgenerator (v2, block-baserad)
============================================================
Flexibel mall för svenska bruksanvisningar. Block-arkitektur gör det
möjligt att hantera olika produkttyper (armaturer, styrenheter,
effektmaskiner) inom samma mall.

Lägga till ny produkt:
1. Kopiera ett befintligt ProductManual(...)-block längst ner
2. Byt ut artno, namn, specs och block-innehåll
3. Lägg till i PRODUCTS-listan
4. Kör: python3 manual_generator.py
"""

from dataclasses import dataclass, field
from typing import List, Tuple, Optional, Any
import math

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, PageBreak, Flowable
)
from reportlab.pdfgen import canvas

# =============================================================================
# BRAND
# =============================================================================
NAVY      = HexColor("#1e1850")
ACCENT    = HexColor("#332885")
LAVENDER  = HexColor("#c4b5f4")
TEXT      = HexColor("#1a1a2e")
MUTED     = HexColor("#555570")
SOFT_BG   = HexColor("#f5f3fb")
BORDER    = HexColor("#d9d4ec")
BAND      = HexColor("#efebf8")
WARNING   = HexColor("#b3261e")
WARN_BG   = HexColor("#fdf1ee")
WARN_BORDER = HexColor("#f4c7bd")

FONT_BODY = "Helvetica"
FONT_BOLD = "Helvetica-Bold"

PAGE_W, PAGE_H = A4
MARGIN_L = 18 * mm
MARGIN_R = 18 * mm
MARGIN_T = 26 * mm
MARGIN_B = 22 * mm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

# =============================================================================
# STYLES
# =============================================================================
S_TITLE    = ParagraphStyle("Title", fontName=FONT_BOLD, fontSize=24, leading=28,
                            textColor=NAVY, spaceAfter=4)
S_SUBTITLE = ParagraphStyle("Sub", fontName=FONT_BODY, fontSize=12, leading=16,
                            textColor=MUTED, spaceAfter=18)
S_H2       = ParagraphStyle("H2", fontName=FONT_BOLD, fontSize=14, leading=18,
                            textColor=NAVY, spaceBefore=10, spaceAfter=6)
S_H3       = ParagraphStyle("H3", fontName=FONT_BOLD, fontSize=11, leading=14,
                            textColor=ACCENT, spaceBefore=8, spaceAfter=3)
S_BODY     = ParagraphStyle("Body", fontName=FONT_BODY, fontSize=10, leading=14,
                            textColor=TEXT, spaceAfter=6)
S_SMALL    = ParagraphStyle("Small", fontName=FONT_BODY, fontSize=9, leading=12,
                            textColor=TEXT, spaceAfter=4)
S_BULLET   = ParagraphStyle("Bullet", fontName=FONT_BODY, fontSize=10, leading=14,
                            textColor=TEXT, spaceAfter=3, leftIndent=14)
S_STEP_NUM = ParagraphStyle("StepNum", fontName=FONT_BOLD, fontSize=11, leading=14,
                            textColor=white, alignment=TA_CENTER)
S_TH       = ParagraphStyle("TH", fontName=FONT_BOLD, fontSize=9, leading=11,
                            textColor=white, alignment=TA_LEFT)
S_TD       = ParagraphStyle("TD", fontName=FONT_BODY, fontSize=9, leading=12,
                            textColor=TEXT, alignment=TA_LEFT)
S_TD_MONO  = ParagraphStyle("TDmono", fontName="Courier-Bold", fontSize=9, leading=12,
                            textColor=ACCENT, alignment=TA_LEFT)
S_TD_TIGHT = ParagraphStyle("TDtight", fontName=FONT_BODY, fontSize=8.5, leading=11,
                            textColor=TEXT, alignment=TA_LEFT)

# =============================================================================
# SCENKONSULT-IKON (sunburst) — programmerad direkt i reportlab
# =============================================================================
def draw_sk_icon(c: canvas.Canvas, cx: float, cy: float, size: float, color):
    """
    Rita Scenkonsult-sunburst-ikonen.
    (cx, cy) = centrum. size = diametern. color = fill/stroke.
    """
    c.saveState()
    c.setFillColor(color)
    c.setStrokeColor(color)

    # Centralt hålkvadrat
    sq = size * 0.14
    c.setLineWidth(max(0.7, size * 0.015))
    c.rect(cx - sq/2, cy - sq/2, sq, sq, stroke=1, fill=0)

    # Inre ring — 12 små prickar
    r1, d1 = size * 0.22, size * 0.013
    for i in range(12):
        a = 2 * math.pi * i / 12
        c.circle(cx + r1*math.cos(a), cy + r1*math.sin(a), d1, stroke=0, fill=1)

    # Mellanring — 16 prickar (förskjutna 11.25° för sunburst-look)
    r2, d2 = size * 0.32, size * 0.016
    for i in range(16):
        a = 2 * math.pi * i / 16 + math.pi / 16
        c.circle(cx + r2*math.cos(a), cy + r2*math.sin(a), d2, stroke=0, fill=1)

    # Ytterring — 20 prickar med markerade kardinalpunkter
    r3 = size * 0.43
    for i in range(20):
        a = 2 * math.pi * i / 20
        is_cardinal = i % 5 == 0
        d = size * 0.024 if is_cardinal else size * 0.017
        c.circle(cx + r3*math.cos(a), cy + r3*math.sin(a), d, stroke=0, fill=1)

    c.restoreState()


def draw_sk_logo_header(c: canvas.Canvas, x: float, y: float, icon_size: float = 5.5 * mm):
    """Rita ikonen + 'SCENKONSULT' wordmark på en rad."""
    cx = x + icon_size / 2
    cy = y + icon_size * 0.18
    draw_sk_icon(c, cx, cy, icon_size, white)
    c.setFillColor(white)
    c.setFont(FONT_BOLD, 10)
    c.drawString(x + icon_size + 2 * mm, y, "SCENKONSULT")


# =============================================================================
# PAGE CHROME
# =============================================================================
def make_chrome(product_name: str, artno: str):
    def draw(c: canvas.Canvas, doc):
        c.saveState()
        # Navy-band överst
        c.setFillColor(NAVY)
        c.rect(0, PAGE_H - 10 * mm, PAGE_W, 10 * mm, stroke=0, fill=1)
        # Lavendel accent-stripe
        c.setFillColor(LAVENDER)
        c.rect(0, PAGE_H - 11.8 * mm, PAGE_W, 1.8 * mm, stroke=0, fill=1)
        # Logo — vänster
        draw_sk_logo_header(c, MARGIN_L, PAGE_H - 7.2 * mm, icon_size=5.5 * mm)
        # Produktinfo — höger
        c.setFillColor(white)
        c.setFont(FONT_BODY, 9)
        c.drawRightString(PAGE_W - MARGIN_R, PAGE_H - 7 * mm,
                          f"{product_name}  ·  {artno}")
        # Footer-linje + text (utan adress)
        c.setStrokeColor(BORDER); c.setLineWidth(0.4)
        c.line(MARGIN_L, 15 * mm, PAGE_W - MARGIN_R, 15 * mm)
        c.setFillColor(MUTED); c.setFont(FONT_BODY, 8)
        c.drawString(MARGIN_L, 10 * mm,
                     "Scenkonsult Norden  ·  072-448 10 00  ·  scenkonsult.se")
        c.setFont(FONT_BOLD, 8)
        c.drawRightString(PAGE_W - MARGIN_R, 10 * mm, f"Sida {doc.page}")
        c.restoreState()
    return draw


# =============================================================================
# FLOWABLES
# =============================================================================
class HRuleFlow(Flowable):
    def __init__(self, width=None, color=BORDER, thickness=0.4, space=3):
        Flowable.__init__(self)
        self.width, self.color, self.thickness, self.space = width, color, thickness, space
    def wrap(self, aw, ah):
        self.w = self.width or aw
        return (self.w, self.thickness + self.space * 2)
    def draw(self):
        c = self.canv
        c.setStrokeColor(self.color); c.setLineWidth(self.thickness)
        y = self.thickness / 2 + self.space
        c.line(0, y, self.w, y)


class ColorTag(Flowable):
    def __init__(self, text, bg=ACCENT, fg=white, font=FONT_BOLD, size=9,
                 padx=6, pady=3, radius=3):
        Flowable.__init__(self)
        self.text, self.bg, self.fg = text, bg, fg
        self.font, self.size = font, size
        self.padx, self.pady, self.radius = padx, pady, radius
    def wrap(self, aw, ah):
        from reportlab.pdfbase.pdfmetrics import stringWidth
        tw = stringWidth(self.text, self.font, self.size)
        self.w = tw + self.padx * 2
        self.h = self.size + self.pady * 2
        return (self.w, self.h)
    def draw(self):
        c = self.canv
        c.setFillColor(self.bg); c.setStrokeColor(self.bg)
        c.roundRect(0, 0, self.w, self.h, self.radius, stroke=0, fill=1)
        c.setFillColor(self.fg); c.setFont(self.font, self.size)
        c.drawString(self.padx, self.pady, self.text)


def render_styled_table(headers, rows, col_widths, mono_cols=None, tight=False):
    mono_cols = mono_cols or []
    td_style = S_TD_TIGHT if tight else S_TD
    data = [[Paragraph(h, S_TH) for h in headers]]
    for row in rows:
        cells = []
        for i, v in enumerate(row):
            s = S_TD_MONO if i in mono_cols else td_style
            cells.append(Paragraph(str(v), s))
        data.append(cells)
    t = Table(data, colWidths=col_widths, repeatRows=1)
    ts = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR",  (0, 0), (-1, 0), white),
        ("ALIGN",      (0, 0), (-1, -1), "LEFT"),
        ("VALIGN",     (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING",(0, 0), (-1, -1), 7),
        ("RIGHTPADDING",(0, 0),(-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 3 if tight else 4),
        ("BOTTOMPADDING",(0,0),(-1, -1), 3 if tight else 4),
        ("BOX",        (0, 0), (-1, -1), 0.4, BORDER),
        ("INNERGRID",  (0, 1), (-1, -1), 0.3, BORDER),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            ts.append(("BACKGROUND", (0, i), (-1, i), BAND))
    t.setStyle(TableStyle(ts))
    return t


def render_info_box(title, lines, style="default"):
    if style == "warning":
        accent, bg, border = WARNING, WARN_BG, WARN_BORDER
    elif style == "navy":
        accent, bg, border = NAVY, SOFT_BG, BORDER
    else:
        accent, bg, border = ACCENT, SOFT_BG, BORDER
    inner = [Paragraph(f"<b>{title}</b>", ParagraphStyle(
        "BoxT", fontName=FONT_BOLD, fontSize=10.5, leading=13,
        textColor=accent, spaceAfter=4))]
    for line in lines:
        inner.append(Paragraph(line, S_SMALL))
    tbl = Table([[inner]], colWidths=[CONTENT_W])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.5, border),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LINEBEFORE", (0, 0), (0, -1), 3, accent),
    ]))
    return tbl


def render_step(number, heading, body_html):
    num_cell = Table([[Paragraph(str(number), S_STEP_NUM)]],
                     colWidths=[9 * mm], rowHeights=[9 * mm])
    num_cell.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), ACCENT),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    txt = [
        Paragraph(f"<b>{heading}</b>", ParagraphStyle(
            "StepH", fontName=FONT_BOLD, fontSize=10.5, leading=13,
            textColor=NAVY, spaceAfter=2)),
        Paragraph(body_html, S_SMALL),
    ]
    wrap = Table([[num_cell, txt]], colWidths=[11 * mm, None])
    wrap.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return wrap


def render_bullets(items):
    from reportlab.platypus import ListFlowable, ListItem
    flow = [ListItem(Paragraph(t, S_BULLET), bulletColor=ACCENT) for t in items]
    return ListFlowable(
        flow, bulletType="bullet", bulletFontName=FONT_BOLD,
        bulletFontSize=10, bulletColor=ACCENT, leftIndent=14,
        bulletOffsetY=-1, spaceBefore=2, spaceAfter=6,
    )


def render_specs_table(specs):
    rows = []
    for label, value in specs:
        rows.append([
            Paragraph(f"<b>{label}</b>", ParagraphStyle(
                "SpecL", fontName=FONT_BOLD, fontSize=9, leading=12,
                textColor=ACCENT)),
            Paragraph(value, S_SMALL),
        ])
    t = Table(rows, colWidths=[42 * mm, None])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LINEBELOW", (0, 0), (-1, -2), 0.3, BORDER),
    ]))
    return t


# =============================================================================
# BLOCK TYPES
# =============================================================================
@dataclass
class H2:
    text: str
@dataclass
class H3:
    text: str
@dataclass
class P:
    text: str
@dataclass
class UL:
    items: List[str]
@dataclass
class Steps:
    items: List[Tuple[str, str]]
@dataclass
class DataTable:
    headers: List[str]
    rows: List[List[str]]
    col_widths: List
    mono_cols: List[int] = field(default_factory=list)
    tight: bool = False
@dataclass
class InfoBox:
    title: str
    lines: List[str]
    style: str = "default"  # default | warning | navy
@dataclass
class Specs:
    items: List[Tuple[str, str]]
@dataclass
class Space:
    mm_: float = 3
@dataclass
class Break:
    pass
@dataclass
class Rule:
    pass


# =============================================================================
# PRODUCT MODEL
# =============================================================================
@dataclass
class ProductManual:
    artno: str
    name: str
    subtitle: str = "Bruksanvisning"
    description: List[str] = field(default_factory=list)
    specs: Optional[List[Tuple[str, str]]] = None
    toc: List[Tuple[str, str, str]] = field(default_factory=list)
    safety_box: Optional[InfoBox] = None
    blocks: List[Any] = field(default_factory=list)


# =============================================================================
# BLOCK RENDERER
# =============================================================================
def render_block(block) -> List:
    if isinstance(block, H2):        return [Paragraph(block.text, S_H2)]
    if isinstance(block, H3):        return [Paragraph(block.text, S_H3)]
    if isinstance(block, P):         return [Paragraph(block.text, S_BODY)]
    if isinstance(block, UL):        return [render_bullets(block.items)]
    if isinstance(block, Steps):     return [render_step(i, h, b) for i, (h, b) in enumerate(block.items, 1)]
    if isinstance(block, DataTable): return [render_styled_table(
        block.headers, block.rows, block.col_widths,
        mono_cols=block.mono_cols, tight=block.tight)]
    if isinstance(block, InfoBox):   return [render_info_box(block.title, block.lines, style=block.style)]
    if isinstance(block, Specs):     return [render_specs_table(block.items)]
    if isinstance(block, Space):     return [Spacer(1, block.mm_ * mm)]
    if isinstance(block, Break):     return [PageBreak()]
    if isinstance(block, Rule):      return [HRuleFlow()]
    raise ValueError(f"Unknown block: {type(block)}")


# =============================================================================
# BUILD
# =============================================================================
def build_manual(p: ProductManual, output_dir: str = "/mnt/user-data/outputs") -> str:
    out_path = f"{output_dir}/{p.artno}.pdf"
    doc = BaseDocTemplate(
        out_path, pagesize=A4,
        leftMargin=MARGIN_L, rightMargin=MARGIN_R,
        topMargin=MARGIN_T, bottomMargin=MARGIN_B,
        title=f"Bruksanvisning — {p.name} ({p.artno})",
        author="Scenkonsult Norden",
    )
    frame = Frame(MARGIN_L, MARGIN_B,
                  PAGE_W - MARGIN_L - MARGIN_R,
                  PAGE_H - MARGIN_T - MARGIN_B,
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
                  id="main")
    doc.addPageTemplates([
        PageTemplate(id="default", frames=[frame], onPage=make_chrome(p.name, p.artno))
    ])

    s = []

    # ---------- SIDA 1 ----------
    s.append(Spacer(1, 2 * mm))
    s.append(ColorTag(p.artno))
    s.append(Spacer(1, 4 * mm))
    s.append(Paragraph("Bruksanvisning", S_SUBTITLE))
    s.append(Paragraph(p.name, S_TITLE))
    s.append(Paragraph(p.subtitle, S_SUBTITLE))
    s.append(HRuleFlow())
    s.append(Spacer(1, 3 * mm))

    s.append(Paragraph("Om produkten", S_H2))
    for para in p.description:
        s.append(Paragraph(para, S_BODY))

    if p.specs:
        s.append(Spacer(1, 2 * mm))
        s.append(Paragraph("Specifikationer", S_H3))
        s.append(render_specs_table(p.specs))

    if p.toc:
        s.append(Spacer(1, 4 * mm))
        s.append(Paragraph("Det här innehåller guiden", S_H2))
        toc_rows = [[num, title, page] for num, title, page in p.toc]
        toc_tbl = Table(toc_rows, colWidths=[10 * mm, None, 28 * mm])
        toc_tbl.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (0, -1), FONT_BOLD),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("TEXTCOLOR", (0, 0), (0, -1), ACCENT),
            ("TEXTCOLOR", (1, 0), (1, -1), TEXT),
            ("TEXTCOLOR", (2, 0), (2, -1), MUTED),
            ("ALIGN", (2, 0), (2, -1), "RIGHT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LINEBELOW", (0, 0), (-1, -2), 0.3, BORDER),
        ]))
        s.append(toc_tbl)

    if p.safety_box:
        s.append(Spacer(1, 6 * mm))
        s.append(render_info_box(
            p.safety_box.title, p.safety_box.lines, style=p.safety_box.style))

    s.append(PageBreak())

    # ---------- Övriga block ----------
    for block in p.blocks:
        s.extend(render_block(block))

    # Avslutande "Behöver du hjälp"-ruta (om sista blocket inte redan är en sådan)
    if not p.blocks or not isinstance(p.blocks[-1], InfoBox):
        s.append(Spacer(1, 6 * mm))
        s.append(render_info_box("Behöver du hjälp?", [
            "Ring oss på <b>072-448 10 00</b> (mån–sön 08:00–20:00) eller "
            "maila <b>info@scenkonsult.se</b>.",
            "Fler guider och tekniska tips finns på "
            "<b>scenkonsult.se/for/guider/</b>.",
        ], style="navy"))

    doc.build(s)
    return out_path


# =============================================================================
# PRODUKTKATALOG — LJUSPAKET (omstrukturering 2026-09-20)
# =============================================================================
# Manualerna namnges efter PAKETETS artikelnummer, inte efter armaturen.
# Duo-varianterna (PAK-0019, PAK-0021) länkar till sin bas-manual.
#   SK-LJS-PAK-0018  Ljuspaket, Small     — Mini Spider 8xRGBW   (tidigare EFF-0010)
#   SK-LJS-PAK-0020  Ljuspaket, Small+    — Kaleidoskop 6-arm    (tidigare EFF-0009)
#   SK-LJS-PAK-0025  Ljuspaket, Medium++  — T-bar + kaleidoskop + spider
# =============================================================================

# ---- Återanvändbara block: Kaleidoskop 6-arm --------------------------------

KALEIDOSKOP_MENY = DataTable(
    headers=["Meny", "Val", "Funktion"],
    rows=[
        ["Addr", "A001–A512",   "DMX-startadress"],
        ["Chnd", "—",           "Visar hur många kanaler armaturen upptar"],
        ["Shou", "d512",        "DMX-styrning"],
        ["Shou", "Red · GrEE · BluE · Wht1", "Fast färg: röd, grön, blå, vit"],
        ["Shou", "LESr · LESG", "Laser röd respektive laser grön"],
        ["Shou", "Wht2",        "Vitt ljus + gyllene strobe"],
        ["Shou", "A1 · A2 · A3","Automatlägen"],
        ["Shou", "S1 · S2",     "Ljudstyrda lägen"],
        ["SEns", "0–100",       "Känslighet för ljudstyrning"],
        ["SPEd", "1–9",         "Hastighet i automatläge"],
        ["LEd",  "ON / OFF",    "Displayen alltid tänd / slocknar efter 10 sekunder"],
        ["disp", "OFF / ON",    "Displayen rättvänd / upp-och-ner (vid hängande montage)"],
        ["irC",  "ON / OFF",    "Slår på eller av fjärrkontrollfunktionen"],
        ["rst",  "Yes / no",    "Manuell återställning"],
    ],
    col_widths=[20 * mm, 40 * mm, None],
    mono_cols=[0],
    tight=True,
)

KALEIDOSKOP_LAGEN = DataTable(
    headers=["Läge", "Innehåll"],
    rows=[
        ["A1", "Laser + beam + strobe — allt igång"],
        ["A2", "Laser + beam, utan strobe"],
        ["A3", "Endast beam, ingen laser"],
        ["S1", "Ljudstyrt läge 1"],
        ["S2", "Ljudstyrt läge 2"],
    ],
    col_widths=[20 * mm, None],
    mono_cols=[0],
)

KALEIDOSKOP_FJARR = DataTable(
    headers=["Knapp", "Funktion"],
    rows=[
        ["ON",           "Tänder armaturen — startar i automatläge A1"],
        ["OFF",          "Släcker armaturen"],
        ["DMX",          "Växlar till DMX-läge"],
        ["AUTO",         "Stegar mellan automatlägena, ett steg per tryck"],
        ["SPEED + / −",  "Snabbare / långsammare automatprogram"],
        ["VOICE",        "Ljudstyrt läge"],
        ["MIC + / −",    "Höjer / sänker ljudkänsligheten"],
        ["1 · 2 · 3 · 4","Fast färg: röd, grön, blå, vit"],
        ["5 · 6",        "Laser röd / laser grön"],
        ["7",            "Vitt ljus + gyllene strobe"],
        ["8 · 9 · 0",    "Automatläge A1 / A2 / A3"],
        ["* · #",        "Ljudläge S1 / S2"],
    ],
    col_widths=[30 * mm, None],
    tight=True,
)

KALEIDOSKOP_DMX = DataTable(
    headers=["Kanal", "Värde", "Funktion"],
    rows=[
        ["CH1",  "0–255",   "X-axel — rotation 0–540°"],
        ["CH2",  "0–255",   "Hastighet X-axel: <b>0 = snabbt, 255 = långsamt</b>"],
        ["CH3",  "0",       "Kaleidoskopets rotation: stillastående"],
        ["CH3",  "1–255",   "Kaleidoskopet roterar fram/back, långsamt → snabbt"],
        ["CH4",  "0–255",   "Beam-arm 1 — vridning 0–180°"],
        ["CH5",  "0–255",   "Beam-arm 2 — vridning 0–180°"],
        ["CH6",  "0–255",   "Beam-arm 3 — vridning 0–180°"],
        ["CH7",  "0–255",   "Beam-arm 4 — vridning 0–180°"],
        ["CH8",  "0–255",   "Beam-arm 5 — vridning 0–180°"],
        ["CH9",  "0–255",   "Beam-arm 6 — vridning 0–180°"],
        ["CH10", "0–255",   "Master-dimmer — linjär, mörk → ljus"],
        ["CH11", "0–9",     "Stroboskop av"],
        ["CH11", "10–255",  "Stroboskop på kaleidoskop och beam, långsamt → snabbt"],
        ["CH12", "0–255",   "Kaleidoskop: röd 0–100 %"],
        ["CH13", "0–255",   "Kaleidoskop: grön 0–100 %"],
        ["CH14", "0–255",   "Kaleidoskop: blå 0–100 %"],
        ["CH15", "0–255",   "Kaleidoskop: vit 0–100 %"],
        ["CH16", "0–255",   "Beam: röd 0–100 %"],
        ["CH17", "0–255",   "Beam: grön 0–100 %"],
        ["CH18", "0–255",   "Beam: blå 0–100 %"],
        ["CH19", "0–255",   "Beam: vit 0–100 %"],
        ["CH20", "0–255",   "Laser röd — linjär dimring 0–100 %"],
        ["CH21", "0–255",   "Laser grön — linjär dimring 0–100 %"],
        ["CH22", "0–255",   "Vit strobe — långsamt → snabbt"],
        ["CH23", "0–255",   "Gyllene strobe — långsamt → snabbt"],
        ["CH24", "0–50",    "Makro: ingen funktion"],
        ["CH24", "51–150",  "Makro: slumpat automatprogram"],
        ["CH24", "151–250", "Makro: ljudstyrt automatprogram"],
        ["CH24", "251–255", "Makro: återställning (3 sekunder)"],
    ],
    col_widths=[16 * mm, 22 * mm, None],
    mono_cols=[0, 1],
    tight=True,
)

LASER_BOX = InfoBox("Lasern — så använder du den säkert", [
    "Armaturens röda och gröna sektion (märkt <b>LS</b> i menyn) är en enklare "
    "lasereffekt. Rikta den <b>aldrig mot publik, mot ögonhöjd eller mot fordon</b>, "
    "och peka den inte uppåt utomhus.",
    "Montera armaturen så att strålarna går <b>över</b> publikens huvudhöjd, och låt "
    "ingen titta in i öppningen på nära håll.",
    "Laserklassen framgår av märkningen på kåpan. Kontrollera den vid ankomst och följ "
    "den om den avviker från det som står här.",
], style="warning")

# ---- Återanvändbara block: Mini Spider --------------------------------------

SPIDER_MENY = DataTable(
    headers=["Meny", "Val", "Funktion"],
    rows=[
        ["ADDR", "A001–A512",   "DMX-startadress"],
        ["CHND", "7CH / 15CH",  "Kanalläge — måste matcha profilen i pulten"],
        ["SLND", "MAST",        "Automatläge (fristående)"],
        ["SLND", "SOUN",        "Ljudstyrt läge"],
        ["SLND", "SLAV",        "Master/slave"],
        ["SHND", "Sh1–Sh24",    "Val av effektprogram (Sh24 = automatsvep)"],
        ["SHND", "SPED 01–08",  "Hastighet, långsam → snabb"],
        ["SOUD", "ON / OFF",    "Slår på eller av ljudstyrningen"],
        ["SOEN", "0–100",       "Ljudkänslighet (0 = av, 100 = högst)"],
        ["TEST", "YES",         "Automatiskt självtest"],
        ["DISP", "NO / YES",    "Displayen rättvänd / upp-och-ner"],
        ["LED",  "ON / OFF",    "Displayens bakgrundsbelysning"],
        ["1TIL", "NO / YES",    "Vänder rörelseriktningen på motor Y1"],
        ["2TIL", "NO / YES",    "Vänder rörelseriktningen på motor Y2"],
        ["DEFT", "—",           "Återställer fabriksinställningarna"],
    ],
    col_widths=[20 * mm, 32 * mm, None],
    mono_cols=[0],
    tight=True,
)

SPIDER_DMX7 = DataTable(
    headers=["Kanal", "Värde", "Funktion"],
    rows=[
        ["CH1", "0–255",   "Motor 1 (övre raden) — tilt 0–135°"],
        ["CH2", "0–255",   "Motor 2 (undre raden) — tilt 0–135°"],
        ["CH3", "0–255",   "Master-dimmer 0–100 %"],
        ["CH4", "0–9",     "Stroboskop av"],
        ["CH4", "10–255",  "Stroboskop, långsamt → snabbt"],
        ["CH5", "0–7",     "Ingen effekt"],
        ["CH5", "8–255",   "Effektprogram 1–25 — se effekttabellen"],
        ["CH6", "0–255",   "Effekthastighet"],
        ["CH7", "241–250", "Reset — håll värdet i 5 sekunder"],
    ],
    col_widths=[16 * mm, 22 * mm, None],
    mono_cols=[0, 1],
    tight=True,
)

SPIDER_DMX15 = DataTable(
    headers=["Kanal", "Värde", "Funktion"],
    rows=[
        ["CH1",  "0–255",   "Motor 1 (övre raden) — tilt 60–150°"],
        ["CH2",  "0–255",   "Motor 2 (undre raden) — tilt 60–150°"],
        ["CH3",  "0–255",   "Master-dimmer 0–100 %"],
        ["CH4",  "0–9",     "Stroboskop av"],
        ["CH4",  "10–255",  "Stroboskop, långsamt → snabbt"],
        ["CH5",  "0–255",   "LED 1 — dimmer 0–100 %"],
        ["CH6",  "0–255",   "LED 2 — dimmer 0–100 %"],
        ["CH7",  "0–255",   "LED 3 — dimmer 0–100 %"],
        ["CH8",  "0–255",   "LED 4 — dimmer 0–100 %"],
        ["CH9",  "0–255",   "LED 5 — dimmer 0–100 %"],
        ["CH10", "0–255",   "LED 6 — dimmer 0–100 %"],
        ["CH11", "0–255",   "LED 7 — dimmer 0–100 %"],
        ["CH12", "0–255",   "Röd — dimmer 0–100 %"],
        ["CH13", "8–255",   "Effektprogram 1–25 — se effekttabellen"],
        ["CH14", "0–255",   "Effekthastighet"],
        ["CH15", "241–250", "Reset — håll värdet i 5 sekunder"],
    ],
    col_widths=[16 * mm, 22 * mm, None],
    mono_cols=[0, 1],
    tight=True,
)

SPIDER_EFFEKTER = DataTable(
    headers=["Värde", "Effekt", "Värde", "Effekt"],
    rows=[
        ["8–17",    "1",  "137–146", "14"],
        ["18–27",   "2",  "147–156", "15"],
        ["28–37",   "3",  "157–166", "16"],
        ["38–47",   "4",  "167–176", "17"],
        ["48–57",   "5",  "177–186", "18"],
        ["58–67",   "6",  "187–196", "19"],
        ["68–77",   "7",  "197–206", "20"],
        ["78–87",   "8",  "207–216", "21"],
        ["88–97",   "9",  "217–226", "22"],
        ["98–107",  "10", "227–236", "23"],
        ["108–117", "11", "237–246", "24 — auto, flera effekter"],
        ["118–127", "12", "247–255", "25 — ljudstyrd"],
        ["128–136", "13", "—",       "—"],
    ],
    col_widths=[24 * mm, 20 * mm, 24 * mm, None],
    mono_cols=[0, 2],
    tight=True,
)


# =============================================================================
# SK-LJS-PAK-0018 — Ljuspaket, Small (Mini Spider 8xRGBW)
# =============================================================================
SK_LJS_PAK_0018 = ProductManual(
    artno="SK-LJS-PAK-0018",
    name="Ljuspaket, Small",
    subtitle="Mini Spider 8×RGBW på stativ — spindelarmatur med två motorer",
    description=[
        "Paketet består av en <b>kompakt spindelarmatur</b> med åtta RGBW-huvuden i två "
        "rader som tiltar på var sin motor, monterad på <b>stativ</b> med nätkabel. "
        "Ger klassiska spindelsvep och våglika chaser — tacksam på fest, studentflak "
        "och mindre scener där en full moving head-rigg inte får plats.",
        "Körs <b>fristående</b> med 24 inbyggda effektprogram, <b>ljudstyrt</b>, i "
        "<b>master/slave</b> eller <b>DMX-styrt</b> i 7 eller 15 kanaler. Samma manual "
        "gäller för <b>Ljuspaket, Small Duo</b> (SK-LJS-PAK-0019), som är två likadana "
        "armaturer på var sitt stativ.",
    ],
    specs=[
        ("Ljuskälla",        "8 × RGBW LED-huvuden"),
        ("Rörelse",          "Två tiltmotorer (Y1 och Y2), riktningen kan vändas i menyn"),
        ("Kanallägen",       "7 eller 15 DMX-kanaler"),
        ("Styrning",         "DMX-512 · Fristående · Ljudstyrt · Master/slave"),
        ("Effektprogram",    "24 inbyggda (Sh1–Sh24) · 25 makroeffekter via DMX"),
        ("Ström och anslutning", "AC 100–240 V, 50/60 Hz · DMX IN/OUT (XLR) · säkring"),
        ("Miljö",            "Endast inomhus · omgivningstemperatur max 40 °C"),
        ("Ingår i paketet",  "Armatur, stativ, nätkabel, bruksanvisning"),
    ],
    toc=[
        ("1", "Säkerhet och montering",                 "sida 2"),
        ("2", "Panel, display och meny",                "sida 3"),
        ("3", "DMX-styrning — 7 och 15 kanaler",        "sida 4"),
        ("4", "Effektvärden — Effekt 1–25",             "sida 5"),
        ("5", "Fristående, ljudstyrt och master/slave", "sida 5"),
        ("6", "Felsökning",                             "sida 6"),
    ],
    safety_box=InfoBox("Innan du riggar", [
        "<b>Endast inomhus</b>, i jordat uttag. Minst <b>50 cm</b> fritt till alla "
        "ytor och inga blockerade ventilationsspringor. Omgivningstemperaturen får "
        "inte överstiga <b>40 °C</b>. Bryt strömmen före varje ingrepp. Kontrollera "
        "att stativet står stadigt och att kabeln inte ligger i gångstråk."
    ], style="warning"),
    blocks=[
        H2("1. Säkerhet och montering"),
        H3("El och miljö"),
        UL([
            "Anslut till <b>jordat uttag</b>. Armaturen är avsedd för "
            "<b>inomhusbruk</b> — utsätt den aldrig för regn eller fukt.",
            "Håll <b>minst 50 cm</b> fritt till alla ytor och se till att "
            "ventilationsspringorna aldrig täcks.",
            "Omgivningstemperaturen får inte överstiga <b>40 °C</b> "
            "(absolut max 45 °C).",
            "Inget brännbart material i närheten av armaturen.",
            "<b>Bryt strömmen</b> före montering, byte av säkring och all rengöring.",
        ]),
        H3("Stativet"),
        UL([
            "Fäll ut stativets ben helt och ställ det på plant underlag. Dra åt "
            "låsvreden ordentligt innan du hissar upp armaturen.",
            "Fäst armaturen i bygelns skruvhål så att den sitter stadigt — den får "
            "inte kunna vibrera eller vandra under drift.",
            "Placera stativet utom räckhåll för dansande gäster och barn, och aldrig "
            "i en passage. Tejpa eller kabelrännor över kabeln som korsar golvet.",
            "Vid hängande montage i tross: riggpunkten ska klara <b>minst 10 gånger</b> "
            "armaturens vikt, och säkerhetswire ska alltid användas.",
        ]),
        H3("Säkring och service"),
        P("Byt säkring med strömmen bruten: skruva loss säkringshållaren, byt till "
          "<b>säkring av samma typ och värde</b> och skruva tillbaka. "
          "<b>Går säkringen igen — sluta använda armaturen</b> och hör av dig till "
          "oss. Fortsatt drift kan ge allvarliga skador. Reparera aldrig armaturen "
          "själv, och använd bara originaldelar."),
        P("Titta inte rakt in i ljuskällan. Armaturen är en effektarmatur för "
          "dekorativ belysning — inte för allmänbelysning."),
        Break(),

        H2("2. Panel, display och meny"),
        P("Displayen sitter på armaturens sida tillsammans med fyra knappar "
          "(<b>MENU</b>, <b>DOWN</b>, <b>UP</b>, <b>ENTER</b>) och fyra "
          "indikatorlampor. Anslutningarna sitter på baksidan."),
        DataTable(
            headers=["På panelen", "Funktion"],
            rows=[
                ["Indikator DMX",     "Lyser när armaturen tar emot DMX-signal"],
                ["Indikator Slave",   "Lyser när armaturen följer en masterarmatur"],
                ["Indikator Master",  "Lyser när armaturen styr andra armaturer"],
                ["Indikator Sound",   "Lyser i ljudstyrt läge"],
                ["MENU / DOWN / UP / ENTER", "Bläddra, ändra värde, bekräfta"],
                ["DMX IN / DMX OUT",  "3-pol XLR — kedja vidare till nästa armatur"],
                ["POWER",             "Nätanslutning"],
            ],
            col_widths=[45 * mm, None],
            tight=True,
        ),
        Space(3),
        H3("Menyöversikt"),
        SPIDER_MENY,
        Space(2),
        InfoBox("1TIL och 2TIL är värda att kunna", [
            "De vänder rörelseriktningen på var sin motorrad. Hänger armaturen "
            "upp-och-ner, eller ska två armaturer spegla varandra i stället för att "
            "göra likadant, är det här inställningen du letar efter — inte en "
            "omprogrammering i pulten. Praktiskt just i <b>Small Duo</b>.",
        ]),
        Break(),

        H2("3. DMX-styrning"),
        P("Ställ kanalläge under <b>CHND</b> och startadress under <b>ADDR</b>, och "
          "patcha samma antal kanaler i pulten. Adressavstånd vid individuell "
          "styrning: <b>+7</b> respektive <b>+15</b> per enhet."),
        H3("7 kanaler — hela armaturen som en enhet"),
        SPIDER_DMX7,
        Space(3),
        H3("15 kanaler — varje huvud för sig"),
        SPIDER_DMX15,
        Break(),

        H2("4. Effektvärden — Effekt 1–25"),
        P("Samma värdeskala gäller för <b>CH5</b> i 7-kanalsläget och <b>CH13</b> i "
          "15-kanalsläget. Värden under 8 ger ingen effekt."),
        SPIDER_EFFEKTER,
        Space(3),
        H2("5. Fristående, ljudstyrt och master/slave"),
        Steps([
            ("Automatläge",
             "<b>MENU</b> → <b>SLND</b> → <b>MAST</b>. Välj sedan program under "
             "<b>SHND</b> (<b>Sh1–Sh24</b>) och hastighet med <b>SPED 01–08</b>."),
            ("Ljudstyrt",
             "<b>MENU</b> → <b>SLND</b> → <b>SOUN</b>. Kontrollera att <b>SOUD</b> "
             "står på <b>ON</b> och ställ känsligheten med <b>SOEN 0–100</b>."),
            ("Master/slave — gäller Small Duo",
             "DMX OUT på armatur 1 till DMX IN på armatur 2. Armatur 1 sätts i "
             "automat- eller ljudläge; armatur 2 får adress <b>A001</b> och "
             "<b>SLND → SLAV</b>. Vill du att de speglar varandra — vänd motorerna "
             "på den ena med <b>1TIL</b>/<b>2TIL</b>."),
        ]),
        Break(),

        H2("6. Felsökning"),
        DataTable(
            headers=["Problem", "Åtgärd"],
            rows=[
                ["Fel funktion på fel fader",
                 "Kontrollera att <b>CHND</b> (7CH eller 15CH) stämmer med profilen i "
                 "pulten. Fel läge förskjuter alla kanaler."],
                ["Armaturen svarar inte på pulten",
                 "Lyser DMX-indikatorn? Kontrollera startadress under <b>ADDR</b>, "
                 "kabelriktning (OUT → IN) och terminator i sista enhetens DMX OUT."],
                ["Rörelsen går åt fel håll",
                 "Vänd motorn med <b>1TIL</b> respektive <b>2TIL</b> i menyn."],
                ["Ljudläget reagerar inte",
                 "<b>SOUD</b> måste stå på <b>ON</b>. Höj sedan <b>SOEN</b> stegvis "
                 "eller flytta armaturen närmare ljudkällan."],
                ["Slaven följer inte mastern",
                 "Slaven ska ha adress <b>A001</b> och stå i <b>SLAV</b>. Ingen pult "
                 "får vara inkopplad samtidigt."],
                ["Säkringen går om och om igen",
                 "Sluta använda armaturen och kontakta oss. Fortsatt drift kan ge "
                 "allvarliga skador."],
                ["Armaturen blir het / stänger av sig",
                 "Kontrollera 50 cm fri yta, fria ventilationsspringor och att "
                 "omgivningstemperaturen är under 40 °C."],
                ["Effekthastigheten går åt oväntat håll",
                 "Tillverkarens två kanaltabeller motsäger varandra om "
                 "effekthastigheten (<b>CH6</b> respektive <b>CH14</b>): den ena "
                 "säger snabb → långsam, den andra tvärtom. Kör fadern från 0 till "
                 "255 och notera vilket håll som gäller."],
            ],
            col_widths=[50 * mm, None],
            tight=True,
        ),
    ],
)


# =============================================================================
# SK-LJS-PAK-0020 — Ljuspaket, Small+ (Kaleidoskop 6-arm)
# =============================================================================
SK_LJS_PAK_0020 = ProductManual(
    artno="SK-LJS-PAK-0020",
    name="Ljuspaket, Small+",
    subtitle="Kaleidoskop 6-arm på stativ — beam, laser och strobe i en enhet",
    description=[
        "Paketet består av en <b>kombinationseffekt på stativ</b>: ett roterande "
        "kaleidoskop i mitten, <b>sex beam-armar</b> som vrids var för sig, en "
        "<b>enklare laser i rött och grönt</b> samt <b>vit och gyllene strobe</b> — "
        "allt i en enhet på ett svep som roterar 540° kring X-axeln.",
        "Körs <b>fristående</b> via displayen eller den medföljande "
        "<b>IR-fjärrkontrollen</b> (fasta färger, tre automatlägen, två ljudlägen), "
        "eller <b>DMX-styrt</b> över 24 kanaler. Samma manual gäller för "
        "<b>Ljuspaket, Small+ Duo</b> (SK-LJS-PAK-0021), som är två likadana "
        "armaturer på var sitt stativ.",
    ],
    specs=[
        ("Ljuskällor",       "Kaleidoskop RGBW · 6 beam-armar RGBW · laser röd/grön · "
                             "vit och gyllene strobe"),
        ("Rörelse",          "X-axel 0–540° · sex armar 0–180° var för sig · "
                             "roterande kaleidoskop"),
        ("Styrning",         "DMX-512 (24 kan.) · IR-fjärrkontroll · Auto · "
                             "Ljudstyrt · Master/slave"),
        ("DMX-anslutning",   "XLR in/out (signalkabel medföljer)"),
        ("Strömförsörjning", "AC 100–240 V"),
        ("Miljö",            "Endast inomhus — ej fuktig miljö"),
        ("Ingår i paketet",  "Armatur, stativ, nätkabel, signalkabel, fjärrkontroll"),
    ],
    toc=[
        ("1", "Säkerhet, laser och montering",     "sida 2"),
        ("2", "Display, knappar och meny",         "sida 3"),
        ("3", "Driftlägen och fjärrkontroll",      "sida 4"),
        ("4", "DMX-styrning — 24 kanaler",         "sida 5"),
        ("5", "Snabbstart och felsökning",         "sida 6"),
    ],
    safety_box=InfoBox("Säkerhet — läs innan du tänder", [
        "Armaturen innehåller en <b>lasersektion</b>. Rikta den aldrig mot publik, mot "
        "ögonhöjd eller mot fordon. Armaturen är byggd för <b>inomhusbruk</b> — använd "
        "den inte i fuktig miljö. Bryt strömmen före installation och service. Se till "
        "att luften kan cirkulera runt armaturen och titta inte in i ljuskällan."
    ], style="warning"),
    blocks=[
        H2("1. Säkerhet, laser och montering"),
        LASER_BOX,
        Space(3),
        H3("Montering på stativ"),
        UL([
            "Fäll ut stativets ben helt, ställ det på plant underlag och dra åt "
            "låsvreden innan du hissar upp armaturen.",
            "Rikta armaturen så att beam-armar och laser går <b>över</b> publikens "
            "huvudhöjd.",
            "Placera stativet utom räckhåll för dansande gäster och barn, och aldrig "
            "i en passage. Säkra kabeln som korsar golvet.",
            "Vid hängande montage: använd upphängningskroken <b>och</b> säkerhetswire.",
        ]),
        H3("El och miljö"),
        UL([
            "AC 100–240 V i jordat uttag. Endast inomhus, aldrig i fuktig miljö "
            "eller där vattendroppar kan nå armaturen.",
            "Se till att luften kan cirkulera runt kåpan — täck aldrig "
            "ventilationsöppningarna.",
            "Bryt strömmen före installation, service och rengöring.",
        ]),
        Break(),

        H2("2. Display, knappar och meny"),
        P("Fyra knappar sitter vid displayen. <b>MENU</b> bläddrar runt i "
          "huvudmenyn och <b>ENTER</b> går in i vald undermeny. När du ställt ett "
          "värde trycker du <b>ENTER</b> igen för att spara — armaturen startar "
          "sedan alltid i det senast sparade läget efter strömavbrott."),
        DataTable(
            headers=["Knapp", "Funktion"],
            rows=[
                ["MENU",  "Bläddrar mellan posterna i huvudmenyn"],
                ["UP",    "Ökar värdet"],
                ["DOWN",  "Minskar värdet"],
                ["ENTER", "Går in i undermeny / bekräftar och sparar"],
            ],
            col_widths=[55 * mm, None],
        ),
        Space(3),
        H3("Menyöversikt"),
        KALEIDOSKOP_MENY,
        Space(3),
        InfoBox("Bokstaven A säger om DMX kommer fram", [
            "När displayen visar adressen (<b>A001</b>) och <b>“A” blinkar</b> tar "
            "armaturen emot giltig DMX-signal. Lyser A med fast sken finns ingen "
            "signal — det är den snabbaste kontrollen innan du börjar felsöka kabel "
            "eller patch.",
        ]),
        Break(),

        H2("3. Driftlägen och fjärrkontroll"),
        H3("Automat- och ljudlägen"),
        KALEIDOSKOP_LAGEN,
        P("Hastigheten i automatlägena ställs med <b>SPEd 1–9</b>, känsligheten i "
          "ljudlägena med <b>SEns 0–100</b>. Båda kan ändras medan armaturen kör. "
          "Vill du köra helt utan laser — välj <b>A3</b>."),
        Space(2),
        H3("Fjärrkontrollen"),
        KALEIDOSKOP_FJARR,
        Space(3),
        InfoBox("Tre saker som ställer till det", [
            "<b>Flera armaturer i samma rum:</b> stäng av fjärrfunktionen "
            "(<b>irC OFF</b>) på alla utom en. Annars svarar samtliga på varje "
            "knapptryck — gäller även <b>Small+ Duo</b>.",
            "<b>Master/slave:</b> signalkabeln från ljuspulten måste kopplas bort. "
            "Armaturerna kan inte följa varandra och ta emot DMX samtidigt.",
            "<b>ON/OFF-knapparna:</b> tillverkarens språkversioner säger olika saker "
            "(engelska: ON tänder, OFF släcker · tyska: ON = A1, OFF = DMX-läge). "
            "Prova knapparna i lugn och ro innan jobbet.",
        ]),
        Break(),

        H2("4. DMX-styrning — 24 kanaler"),
        P("Armaturen upptar <b>24 kanaler</b>. Ställ <b>Shou → d512</b> och sedan "
          "startadress via <b>Addr</b>. Flera armaturer individuellt: "
          "<b>+24 per enhet</b> (A001, A025, A049 …). Samma adress på flera enheter "
          "ger identisk rörelse."),
        KALEIDOSKOP_DMX,
        Break(),

        H2("5. Snabbstart"),
        H3("Fristående"),
        Steps([
            ("Anslut strömmen",
             "Armaturen startar i det läge som senast sparades."),
            ("Välj läge",
             "<b>MENU</b> → <b>Shou</b> → <b>ENTER</b> → stega med UP/DOWN till "
             "önskat läge (t.ex. <b>A1</b>) → <b>ENTER</b> för att spara."),
            ("Justera",
             "<b>SPEd 1–9</b> för hastighet i automatläge, <b>SEns 0–100</b> för "
             "känslighet i ljudläge (<b>S1</b>/<b>S2</b>)."),
        ]),
        Space(2),
        H3("DMX-styrd"),
        Steps([
            ("Koppla DMX IN",
             "XLR-kabel från ljusbordets DMX OUT till armaturens DMX IN, vidare "
             "från DMX OUT till nästa enhet."),
            ("Välj DMX-läge och adress",
             "<b>MENU</b> → <b>Shou</b> → <b>d512</b> → <b>ENTER</b>. Därefter "
             "<b>Addr</b> → adress → <b>ENTER</b>. Kontrollera att <b>A</b> blinkar."),
            ("Patcha i pulten",
             "24-kanalsprofil från samma startadress."),
        ]),
        Space(3),
        H2("Felsökning"),
        DataTable(
            headers=["Problem", "Åtgärd"],
            rows=[
                ["Armaturen svarar inte på pulten",
                 "Blinkar <b>A</b> i displayen? Gör den inte det saknas giltig DMX — "
                 "kontrollera kabel, riktning (OUT → IN) och att <b>Shou</b> står på "
                 "<b>d512</b>."],
                ["Kör automatprogram trots inkopplad pult",
                 "Samma sak: <b>Shou</b> står i ett automatläge, eller så kommer ingen "
                 "signal fram."],
                ["Båda armaturerna reagerar på fjärrkontrollen",
                 "Sätt <b>irC OFF</b> på alla utom en."],
                ["Master/slave fungerar inte",
                 "Signalkabeln från pulten måste vara urkopplad — annars tar DMX över."],
                ["Displayen står upp och ner",
                 "Vänd den med <b>disp</b> — praktiskt när armaturen hänger."],
                ["Ljudläget reagerar dåligt",
                 "Höj <b>SEns</b> stegvis, eller flytta armaturen närmare ljudkällan."],
                ["Strålarna syns knappt",
                 "Beam-armarna och lasern behöver partiklar i luften. Kör rök eller haze."],
            ],
            col_widths=[55 * mm, None],
            tight=True,
        ),
    ],
)


# =============================================================================
# SK-LJS-PAK-0025 — Ljuspaket, Medium++ (tre effekter i ett paket)
# =============================================================================
SK_LJS_PAK_0025 = ProductManual(
    artno="SK-LJS-PAK-0025",
    name="Ljuspaket, Medium++",
    subtitle="Tre stativ — LED T-bar med PAR, kaleidoskop med laser, spindelarmatur",
    description=[
        "Paketet är tre olika effekttyper på var sitt stativ: en <b>LED T-bar med fyra "
        "PAR-armaturer</b> för färg och grundljus, ett <b>kaleidoskop med sex beam-armar "
        "och laser</b> för rörelse, och en <b>spindelarmatur med åtta RGBW-huvuden</b> "
        "för svep över dansgolvet. Tillsammans ger de en bred ljusbild utan att kräva "
        "vare sig tross eller ljustekniker.",
        "Alla tre kan köras <b>ljudstyrt</b> rakt ur lådan, eller <b>DMX-styrt</b> när "
        "du vill sätta ljuset själv. Den här guiden täcker alla tre armaturerna — "
        "avsnitt 2 till 4 — plus en adressplan för när de ska köras från samma pult.",
    ],
    specs=[
        ("Innehåll",         "LED T-bar med 4 PAR · Kaleidoskop 6-arm · Mini Spider 8×RGBW"),
        ("Stativ",           "3 st, ingår"),
        ("Ljuskällor",       "12×9W RGB PAR · kaleidoskop och 6 beam-armar RGBW med "
                             "laser · 8×RGBW spindelhuvuden"),
        ("Styrning",         "Ljudstyrt · automatprogram · IR-fjärrkontroll · DMX-512"),
        ("DMX-kanaler",      "Kaleidoskop 24 kan. · spindelarmatur 7 eller 15 kan."),
        ("Strömförsörjning", "AC 100–240 V — ett jordat uttag per armatur"),
        ("Miljö",            "Endast inomhus"),
    ],
    toc=[
        ("1", "Rigga paketet — ordning och säkerhet",  "sida 2"),
        ("2", "LED T-bar med fyra PAR-armaturer",      "sida 3"),
        ("3", "Kaleidoskop 6-arm med laser",           "sida 4"),
        ("4", "Spindelarmatur 8×RGBW",                 "sida 7"),
        ("5", "Köra alla tre från samma DMX-pult",     "sida 10"),
        ("6", "Felsökning",                            "sida 11"),
    ],
    safety_box=InfoBox("Säkerhet — läs innan du tänder", [
        "Kaleidoskopet innehåller en <b>lasersektion</b>. Rikta den aldrig mot publik, "
        "mot ögonhöjd eller mot fordon. Alla tre armaturerna är för <b>inomhusbruk</b> "
        "i jordat uttag. Ställ stativen på plant underlag, utanför gångstråk, och säkra "
        "kablar som korsar golvet. Bryt strömmen före varje ingrepp."
    ], style="warning"),
    blocks=[
        H2("1. Rigga paketet"),
        P("Räkna med <b>15–20 minuter</b> för hela paketet. Ta stativen först, "
          "armaturerna sedan, och dra ström sist — då slipper du klättra kring "
          "spänningsförande kablar."),
        Steps([
            ("Ställ de tre stativen",
             "T-baren i mitten bakom eller bredvid dansgolvet, kaleidoskopet och "
             "spindelarmaturen på var sin sida. Fäll ut benen helt, plant underlag, "
             "dra åt låsvreden."),
            ("Montera armaturerna",
             "Skruva fast varje armatur i bygeln innan du hissar upp stativet. "
             "Kontrollera att inget glappar."),
            ("Rikta ljuset",
             "Beam-armar, laser och spindelsvep ska gå <b>över</b> huvudhöjd. "
             "PAR-armaturerna på T-baren riktas mot väggen eller ut över golvet."),
            ("Dra ström",
             "Ett jordat uttag per armatur. Säkra kabel som korsar golvet med tejp "
             "eller kabelränna."),
            ("Välj styrsätt",
             "Ljudstyrt på varje armatur för sig (avsnitt 2–4), eller DMX från en "
             "pult enligt adressplanen i avsnitt 5."),
        ]),
        Space(3),
        InfoBox("Rök eller haze gör halva jobbet", [
            "Beam-armarna, lasern och spindelsvepen lever på att strålarna syns i "
            "luften. Utan rök- eller hazemaskin ser gästerna bara ljuspunkterna, inte "
            "effekten. Räkna med haze som en del av paketet när det ska se ut som på bild.",
        ]),
        Break(),

        H2("2. LED T-bar med fyra PAR-armaturer"),
        P("T-baren är fyra RGB PAR-armaturer förmonterade på en tvärslå, "
          "<b>12×9 W RGB LED</b> totalt. Den synkar automatiskt till musiken via "
          "inbyggd mikrofon och är helt plug and play — koppla in strömmen och den "
          "börjar gå."),
        H3("Snabbstart"),
        Steps([
            ("Anslut strömmen",
             "T-baren startar i det läge som användes senast."),
            ("Välj läge på displayen",
             "Bläddra med <b>MENU</b> till ljudstyrt läge för automatik till musiken, "
             "eller till ett fast färgläge om du vill ha stillastående färg."),
            ("Justera",
             "<b>UP</b>/<b>DOWN</b> ändrar hastighet respektive färg inom valt läge."),
        ]),
        Space(2),
        InfoBox("Fullständig kanaltabell för T-baren", [
            "T-barens kompletta DMX-kanaltabell och menyöversikt finns i dess egen "
            "bruksanvisning, <b>SK-LJS-PAK-0001</b> — samma armatur som ingår i "
            "Ljuspaket Medium. Ladda ned den från produktsidan på "
            "<b>scenkonsult.se</b> om du ska köra T-baren DMX-styrd.",
        ]),
        Space(3),
        P("I ljudstyrt läge behöver T-baren ingen pult alls. Den vanligaste "
          "användningen i det här paketet är just det: T-baren ljudstyrd som "
          "grundljus, medan kaleidoskopet och spindelarmaturen står för rörelsen."),
        Break(),

        H2("3. Kaleidoskop 6-arm med laser"),
        LASER_BOX,
        Space(3),
        H3("Meny och knappar"),
        P("<b>MENU</b> bläddrar i huvudmenyn, <b>ENTER</b> går in i undermeny, "
          "<b>UP</b>/<b>DOWN</b> ändrar värdet och <b>ENTER</b> sparar. Armaturen "
          "startar alltid i det senast sparade läget."),
        KALEIDOSKOP_MENY,
        Space(3),
        H3("Automat- och ljudlägen"),
        KALEIDOSKOP_LAGEN,
        P("Hastighet ställs med <b>SPEd 1–9</b>, ljudkänslighet med <b>SEns 0–100</b>. "
          "Vill du köra helt utan laser — välj <b>A3</b>."),
        Break(),

        H3("Fjärrkontrollen"),
        KALEIDOSKOP_FJARR,
        Space(2),
        InfoBox("Bokstaven A säger om DMX kommer fram", [
            "Visar displayen adressen (<b>A001</b>) och <b>“A” blinkar</b> tas giltig "
            "DMX emot. Fast sken = ingen signal. Snabbaste kontrollen innan du "
            "felsöker kabel eller patch.",
        ]),
        Space(3),
        H3("DMX — 24 kanaler"),
        P("Ställ <b>Shou → d512</b> och startadress via <b>Addr</b>. Se adressplanen "
          "i avsnitt 5 för hur den samsas med spindelarmaturen."),
        KALEIDOSKOP_DMX,
        Break(),

        H2("4. Spindelarmatur 8×RGBW"),
        P("Åtta RGBW-huvuden i två rader som tiltar på var sin motor. Fyra knappar "
          "vid displayen (<b>MENU</b>, <b>DOWN</b>, <b>UP</b>, <b>ENTER</b>) och fyra "
          "indikatorlampor för DMX, Slave, Master och Sound."),
        H3("Menyöversikt"),
        SPIDER_MENY,
        Space(2),
        InfoBox("1TIL och 2TIL vänder rörelseriktningen", [
            "De vänder rörelsen på var sin motorrad. Ska spindelsvepen gå åt andra "
            "hållet, eller spegla kaleidoskopets rörelse, är det här inställningen — "
            "ingen omprogrammering i pulten behövs.",
        ]),
        Break(),

        H3("DMX — 7 kanaler"),
        SPIDER_DMX7,
        Space(3),
        H3("DMX — 15 kanaler"),
        SPIDER_DMX15,
        Space(3),
        H3("Effektvärden — Effekt 1–25"),
        P("Gäller <b>CH5</b> i 7-kanalsläget och <b>CH13</b> i 15-kanalsläget. "
          "Värden under 8 ger ingen effekt."),
        SPIDER_EFFEKTER,
        Break(),

        H2("5. Köra alla tre från samma DMX-pult"),
        P("Kedja armaturerna med skärmad DMX-kabel: pultens DMX OUT → armatur 1 DMX IN, "
          "armatur 1 DMX OUT → armatur 2 DMX IN, och så vidare. Sätt en "
          "<b>120 ohms terminator</b> i sista enhetens DMX OUT. Använd aldrig "
          "mikrofonkabel."),
        H3("Förslag på adressplan"),
        DataTable(
            headers=["Armatur", "Kanalläge", "Startadress", "Upptar"],
            rows=[
                ["Kaleidoskop 6-arm",     "24 kan.",      "A001", "1–24"],
                ["Spindelarmatur",        "15 kan.",      "A025", "25–39"],
                ["LED T-bar med 4 PAR",   "enl. egen manual", "A041", "från 41"],
            ],
            col_widths=[45 * mm, 28 * mm, 26 * mm, None],
            mono_cols=[2, 3],
        ),
        Space(2),
        P("Luckan mellan 39 och 41 är medveten — den ger marginal om du senare byter "
          "spindelarmaturen till 15-kanalsläge på en andra enhet. Kör du spindeln i "
          "<b>7-kanalsläge</b> räcker A025–A031, och T-baren kan flyttas ner till A033."),
        Space(3),
        InfoBox("Blandad styrning fungerar", [
            "Du behöver inte köra allt på pult. En vanlig lösning är <b>T-baren "
            "ljudstyrd</b> som grundljus medan kaleidoskop och spindelarmatur ligger "
            "på DMX — eller tvärtom. Armaturer utan DMX-signal går i sitt eget läge "
            "helt oberoende av de andra.",
        ]),
        Break(),

        H2("6. Felsökning"),
        DataTable(
            headers=["Problem", "Åtgärd"],
            rows=[
                ["En armatur svarar inte på pulten",
                 "Kontrollera startadress och kanalläge på just den armaturen, "
                 "kabelriktning (OUT → IN) och terminator i sista enhetens DMX OUT. "
                 "På kaleidoskopet: blinkar <b>A</b> i displayen?"],
                ["Fel funktion på fel fader",
                 "Kanalläget i armaturen stämmer inte med profilen i pulten — vanligast "
                 "på spindelarmaturen (<b>CHND</b> 7CH kontra 15CH)."],
                ["Armaturerna krockar i adressrymden",
                 "Kaleidoskopet tar 24 kanaler, spindeln 7 eller 15. Följ adressplanen "
                 "i avsnitt 5 så överlappar de inte."],
                ["Kaleidoskopet kör automatprogram trots pult",
                 "<b>Shou</b> står i ett automatläge, eller så kommer ingen signal fram. "
                 "Ställ <b>Shou → d512</b>."],
                ["Ljudstyrningen reagerar dåligt",
                 "Höj känsligheten (<b>SEns</b> på kaleidoskopet, <b>SOEN</b> på "
                 "spindeln) eller flytta armaturen närmare högtalaren. Mikrofonerna "
                 "fångar basfrekvenser bäst."],
                ["Strålarna syns knappt",
                 "Luften är för ren. Kör rök- eller hazemaskin."],
                ["Fjärrkontrollen påverkar fel armatur",
                 "Kaleidoskopets fjärr styr bara kaleidoskopet. Har du flera "
                 "kaleidoskop i rummet: <b>irC OFF</b> på alla utom en."],
                ["En armatur blir het eller stänger av sig",
                 "Kontrollera fri yta runt kåpan, fria ventilationsspringor och "
                 "rumstemperaturen."],
            ],
            col_widths=[50 * mm, None],
            tight=True,
        ),
    ],
)


# =============================================================================
# SK-LJS-EFF-0022 — Moving Beam Bar, dubbelsidig
# =============================================================================
# Flyttad hit 2026-09-22 från projektdokumentets version av filen, där den låg
# under platshållarnumret SK-LJS-EFF-0008 ("Beam Curtain Moving Head —
# dubbelsidig"). EFF-0008 tillhör Strobe (2-pack) och får inte användas.
# EFF-0020/0021 är reserverade för Kaleidoskop och Mini Spider styckvis.
SK_LJS_EFF_0022 = ProductManual(
    artno="SK-LJS-EFF-0022",
    name="Moving Beam Bar, dubbelsidig",
    subtitle="Beam-ridå och strobe i samma armatur, 360° oändlig rotation",
    description=[
        "Dubbelsidig moving bar med <b>beam-linser på ena sidan</b> "
        "(12 × 10 W RGBW) och en <b>strobepanel på den andra</b> (224 RGB-chip + "
        "56 vita). Armaturen roterar oändligt runt sin egen axel och ger både "
        "strålridå och blixt från samma enhet.",
        "Styrs via <b>DMX-512</b> i <b>14 kanaler</b> (enkel styrning) eller "
        "<b>27 kanaler</b> (dessutom de inbyggda effektprogrammen). Kan även köras "
        "i auto-, ljud- eller master/slave-läge utan pult.",
    ],
    specs=[
        ("Ljuskälla, beam",   "12 × 10 W RGBW (4-i-1)"),
        ("Ljuskälla, strobe", "224 × 0,2 W RGB (3-i-1) + 56 × 1 W vit 8000 K"),
        ("Rörelse",           "360° oändlig rotation"),
        ("Kanallägen",        "14 / 27 / 84 DMX-kanaler"),
        ("Styrning",          "DMX-512 · Auto · Ljudstyrt · Master/slave · RDM"),
        ("Effekter",          "Stroboskop 1–25 blixt/s · 15 inbyggda auto-/ljudlägen · "
                              "steglös dimmer 0–100 %"),
        ("Färg och kapsling", "RGBW-blandning (16,7 milj. färger) · IP20, endast inomhus"),
        ("Strömförsörjning",  "AC 110–250 V, 50/60 Hz · 250 W"),
        ("Vikt och mått",     "4 kg (5 kg med emballage) · 58 × 17 × 8 cm "
                              "(paket 73 × 21 × 13 cm)"),
    ],
    toc=[
        ("1", "Montering och säkerhet",              "sida 2"),
        ("2", "Display och menyfunktioner",          "sida 3"),
        ("3", "DMX-styrning — 14 kanaler",           "sida 4"),
        ("4", "DMX-styrning — 27 kanaler",           "sida 5"),
        ("5", "Auto, ljudstyrt och master/slave",    "sida 6"),
        ("6", "Felsökning",                          "sida 6"),
    ],
    safety_box=InfoBox("Innan du riggar", [
        "<b>IP20</b> — aldrig regn eller fukt. Bryt strömmen innan kåpan öppnas. "
        "Riggpunkten ska klara <b>minst 10 × armaturens vikt</b> och säkras med "
        "säkerhetswire. Minst <b>0,5 m</b> till brännbart material."
    ], style="warning"),
    blocks=[
        # ---------- SIDA 2 ----------
        H2("1. Montering och säkerhet"),
        P("Armaturen väger 4 kg och roterar fritt 360° — den behöver fri yta runt "
          "om och en rigg som tål dynamisk last."),
        H3("Innan du monterar"),
        UL([
            "Packa upp och kontrollera transportskador. Vid skada: montera <b>inte</b> "
            "armaturen — kontakta oss.",
            "I kartongen ska finnas: armatur, nätkabel, DMX-kabel, två omega-fästen "
            "och bruksanvisning.",
            "Riggpunkten ska klara <b>minst 10 gånger</b> armaturens vikt.",
            "Säkra alltid med <b>säkerhetswire</b> utöver omega-fästet. Fästet, "
            "bottenplattan och riggpunkten för säkerhetswiren sitter i samma enhet.",
        ]),
        H3("Placering"),
        UL([
            "Montera utanför gångstråk, sittplatser och ytor där obehöriga kan nå "
            "armaturen.",
            "Minst <b>0,5 meter</b> fritt till brännbart material — dekor, draperi, "
            "kabelstege.",
            "Stå aldrig rakt under armaturen vid montering, demontering eller service.",
            "Fullborda all rigg <b>innan</b> nätkabeln ansluts till vägguttaget.",
            "Saknar du riggvana — låt någon annan göra monteringen. Felaktig "
            "infästning kan orsaka personskada.",
        ]),
        H3("Signalkablage"),
        P("DMX ansluts med tvåledad, skärmad kabel med 3-pol XLR: från pultens "
          "DMX OUT (hona) till armaturens DMX IN (hane), vidare från armaturens "
          "DMX OUT till nästa enhet. Sätt en <b>120 ohms terminator</b> i sista "
          "enhetens DMX OUT. Använd aldrig mikrofonkabel."),
        Break(),

        # ---------- SIDA 3 ----------
        H2("2. Display och menyfunktioner"),
        P("Fyra knappar sitter vid displayen på armaturens bakstycke: <b>MENU</b> "
          "växlar funktion, <b>UP</b>/<b>DOWN</b> ändrar värde eller adress, och "
          "<b>ENTER</b> sparar. Ett ändrat värde gäller först när du tryckt ENTER."),
        DataTable(
            headers=["Visas i display", "Värde", "Funktion"],
            rows=[
                ["A001",      "001–512",  "DMX-startadress"],
                ["27CH",      "14/27/84", "Kanalläge — måste matcha profilen i pulten"],
                ["CF01–CF30", "00–30",    "Automatprogram för beam. ENTER → hastighet SP01–SP15"],
                ["EF01–EF30", "00–30",    "Automatprogram för strobe i färg. ENTER → hastighet SP01–SP15"],
                ["UF01–UF30", "00–30",    "Automatprogram för vit strobe. ENTER → hastighet SP01–SP15"],
                ["Soud",      "—",        "Ljudstyrt läge. ENTER → känslighet SE01–SE15"],
                ["r/G/b/U",   "000–255",  "Beam: fast nivå per färgkanal (röd, grön, blå, vit)"],
                ["r/G/b/U",   "000–255",  "Strobe: fast nivå per färgkanal (röd, grön, blå, vit)"],
                ["n000",      "000–255",  "Motorns position — grundinställning av utgångsläget"],
                ["J000",      "000–255",  "Motorns hastighet"],
            ],
            col_widths=[26 * mm, 24 * mm, None],
            mono_cols=[0, 1],
            tight=True,
        ),
        Space(3),
        InfoBox("Två saker att veta om menyn", [
            "<b>Spara en manuell färgnivå:</b> ställ värdet med UP/DOWN och tryck "
            "<b>ENTER två gånger</b> — då ligger nivån kvar i minnet efter strömavbrott.",
            "<b>Tryckfel i originalmanualen:</b> menyraden för kanalläge listar "
            "“17/27/84”. Lägena heter i själva verket <b>14, 27 och 84 kanaler</b>, "
            "vilket kanaltabellerna i tillverkarens egen manual bekräftar.",
        ]),
        Space(3),
        P("<b>84-kanalsläget</b> är ett pixelläge där varje LED-grupp adresseras för "
          "sig. Det är inte dokumenterat fullständigt av tillverkaren och beskrivs "
          "inte i den här guiden — hör av dig om du behöver det för ett jobb."),
        Break(),

        # ---------- SIDA 4 ----------
        H2("3. DMX-styrning — 14 kanaler"),
        P("Ställ startadress (<b>A001–A512</b>) och kanalläge i displayen, och "
          "patcha samma antal kanaler i pulten. 14-kanalsläget räcker för vanlig "
          "användning: rörelse, dimmer, strobe och färg på båda sidorna. "
          "Adressavstånd vid flera armaturer: <b>+14 per enhet</b>."),
        DataTable(
            headers=["Kanal", "Värde", "Funktion"],
            rows=[
                ["CH1",  "0–255", "Motor — rörelse inom 1080°"],
                ["CH2",  "0–255", "Motor — 360° oändlig rotation"],
                ["CH3",  "0–255", "Motorhastighet, långsam → snabb"],
                ["CH4",  "0–255", "Master-dimmer, mörk → ljus"],
                ["CH5",  "0–255", "Stroboskop, beam-sidan"],
                ["CH6",  "0–255", "Beam: röd"],
                ["CH7",  "0–255", "Beam: grön"],
                ["CH8",  "0–255", "Beam: blå"],
                ["CH9",  "0–255", "Beam: vit"],
                ["CH10", "0–255", "Strobe: röd"],
                ["CH11", "0–255", "Strobe: grön"],
                ["CH12", "0–255", "Strobe: blå"],
                ["CH13", "0–255", "Strobe: vit"],
                ["CH14", "0–255", "Reset"],
            ],
            col_widths=[16 * mm, 22 * mm, None],
            mono_cols=[0, 1],
            tight=True,
        ),
        Space(3),
        InfoBox("Rök gör effekten", [
            "Beam-sidan lever på att strålarna syns i luften. Utan rök- eller "
            "hazemaskin ser publiken bara ljuspunkterna, inte ridån. Räkna med "
            "haze som en del av effekten när du säljer in eller riggar armaturen.",
            "<b>Reset (CH14):</b> lägg aldrig reset-kanalen på en fader som kan "
            "råka röras under show — armaturen nollställer sig mitt i numret.",
        ]),
        Break(),

        # ---------- SIDA 5 ----------
        H2("4. DMX-styrning — 27 kanaler"),
        P("27-kanalsläget ger samma grundfunktioner som 14-kanalsläget, men lägger "
          "till <b>inbyggda effektprogram</b>, hastighet och bakgrundsfärg för "
          "beam- respektive strobesidan var för sig. Adressavstånd: "
          "<b>+27 per enhet</b>."),
        DataTable(
            headers=["Kanal", "Värde", "Funktion"],
            rows=[
                ["CH1",  "0–255",   "Motor — rörelse inom 1080°"],
                ["CH2",  "0–255",   "Motor — 360° oändlig rotation"],
                ["CH3",  "0–255",   "Motorhastighet"],
                ["CH4",  "0–255",   "Beam: master-dimmer"],
                ["CH5",  "0–255",   "Beam: stroboskop"],
                ["CH6",  "0–255",   "Beam: röd"],
                ["CH7",  "0–255",   "Beam: grön"],
                ["CH8",  "0–255",   "Beam: blå"],
                ["CH9",  "0–255",   "Beam: vit"],
                ["CH10", "0–249",   "Beam: effektprogram"],
                ["CH10", "250–255", "Beam: ljudstyrt läge"],
                ["CH11", "0–255",   "Beam: hastighet i effektprogram"],
                ["CH12", "0–255",   "Beam: dimmer för bakgrundsfärg"],
                ["CH13", "0–255",   "Beam: bakgrundsfärg"],
                ["CH14", "0–255",   "Strobe: master-dimmer"],
                ["CH15", "0–255",   "Strobe: blixt"],
                ["CH16", "0–255",   "Strobe: röd"],
                ["CH17", "0–255",   "Strobe: grön"],
                ["CH18", "0–255",   "Strobe: blå"],
                ["CH19", "0–255",   "Strobe: effektprogram (RGB)"],
                ["CH20", "0–255",   "Strobe: hastighet i effektprogram"],
                ["CH21", "0–255",   "Strobe: dimmer för bakgrundsfärg"],
                ["CH22", "0–255",   "Strobe: bakgrundsfärg"],
                ["CH23", "0–255",   "Strobe: blixt, vita sektionen"],
                ["CH24", "0–255",   "Strobe: vit"],
                ["CH25", "10–255",  "Strobe: effektprogram, vit"],
                ["CH26", "0–255",   "Strobe: hastighet, vitt effektprogram"],
                ["CH27", "0–255",   "Reset"],
            ],
            col_widths=[16 * mm, 22 * mm, None],
            mono_cols=[0, 1],
            tight=True,
        ),
        Break(),

        # ---------- SIDA 6 ----------
        H2("5. Auto, ljudstyrt och master/slave"),
        H3("Automatprogram"),
        P("Tryck <b>MENU</b> till <b>CF</b> (beam), <b>EF</b> (strobe i färg) eller "
          "<b>UF</b> (vit strobe). Välj program <b>00–30</b> med UP/DOWN, tryck "
          "<b>ENTER</b> och ställ hastigheten <b>SP01–SP15</b>. De tre grupperna "
          "kan köras var för sig."),
        H3("Ljudstyrt"),
        P("<b>MENU</b> → <b>Soud</b> → <b>ENTER</b> → känslighet <b>SE01–SE15</b>. "
          "Armaturen följer musiken via inbyggd mikrofon. Triggar den på allt: sänk "
          "känsligheten. Står den still under låten: höj den, eller flytta armaturen "
          "närmare ljudkällan."),
        H3("Master/slave — flera armaturer utan pult"),
        Steps([
            ("Koppla ihop enheterna",
             "3-pol DMX-kabel mellan armaturerna, DMX OUT → DMX IN."),
            ("Sätt mastern",
             "Ställ den armatur som ska styra i ett showläge — automatprogram eller "
             "ljudstyrt."),
            ("Slavarna följer",
             "Ställ övriga armaturer på adress <b>A001</b>. De växlar automatiskt till "
             "slavläge och följer mastern. I slavläge saknar adressen betydelse."),
        ]),
        P("Så snart en DMX-pult skickar giltig signal tar DMX över styrningen."),
        Space(3),
        H2("6. Felsökning"),
        DataTable(
            headers=["Problem", "Åtgärd"],
            rows=[
                ["Fel funktion på fel fader",
                 "Nästan alltid fel kanalläge. Kontrollera att displayens läge "
                 "(14 / 27 / 84) stämmer med profilen i pulten — annars förskjuts alla kanaler."],
                ["Armaturen svarar inte alls",
                 "Verifiera startadress och att pulten sänder. Skärmad DMX-kabel och "
                 "120 ohms terminator i sista enhetens DMX OUT."],
                ["Armaturen står stilla",
                 "CH3 (motorhastighet) kan ligga på 0. Kontrollera även menyns "
                 "<b>J</b>-värde (motorhastighet) och <b>n</b>-värde (utgångsläge)."],
                ["Strålarna syns knappt",
                 "Luften är för ren. Kör rök- eller hazemaskin — beam-effekten "
                 "förutsätter partiklar i luften."],
                ["Armaturen flimrar eller hoppar",
                 "Dålig DMX-signal. Byt kabel, korta kabellängden, kontrollera terminatorn."],
                ["Går i automatläge trots inkopplad pult",
                 "Ingen giltig DMX tas emot. Kontrollera kabel, riktning (OUT → IN) och "
                 "att pulten faktiskt sänder på rätt universe."],
                ["Ljudläget triggar på allt / ingenting",
                 "Justera känsligheten <b>SE01–SE15</b>."],
            ],
            col_widths=[55 * mm, None],
            tight=True,
        ),
    ],
)


# =============================================================================
# SK-LJS-DMX-0011 — MA2 Fader Wing console
# =============================================================================
# Ny 2026-09-22. Källa: grandMA2 v2.x-manualen (kinesisk översättning, 709 s.)
# som följde med bordet. Den beskriver hela grandMA2-familjen och säger inget
# om just den här kontrollytan. Hårdvarudelen bygger därför på produktbilden
# (knapplayout) och säljarens spec (1 536 kanaler, A/B-fadrar 100 mm, nivåhjul,
# inbyggt nätaggregat), bekräftad av Per 2026-09-22. Antal DMX-portar och
# onPC-version är inte bekräftade — lägg inte till dem utan att kontrollera.
SK_LJS_DMX_0011 = ProductManual(
    artno="SK-LJS-DMX-0011",
    name="MA2 Fader Wing console",
    subtitle="Ljusbord för grandMA2 onPC — svensk snabbguide",
    description=[
        "Kontrollyta i grandMA2-stil som styr programmet <b>grandMA2 onPC</b> på "
        "en Windows-dator. Du får fysiska fadrar, playback-knappar, encoders och "
        "hela kommandoblocket — i stället för att klicka med musen.",
        "grandMA2 är ett <b>kommandoradsbord</b>: knapparna bygger en mening som "
        "du avslutar med <b>Please</b>. <i>Fixture 1 Thru 4 At 50 Please</i> tänder "
        "armatur 1–4 på 50 %. Lär dig det mönstret först, så följer resten.",
        "Den här guiden täcker det du behöver för ett event: koppla upp, patcha, "
        "programmera cues och köra dem live. Den fullständiga grandMA2-manualen "
        "finns hos MA Lighting.",
    ],
    specs=[
        ("Programvara",     "grandMA2 onPC (Windows) — gratis från malighting.com"),
        ("Kapacitet",       "1 536 kanaler i realtid tillsammans med grandMA2 onPC"),
        ("Executors",       "6 fader-executors med knappar · 6 knapp-executors (101–106)"),
        ("Huvudexecutor",   "2 A/B-fadrar (100 mm) med <b>Go+</b>, <b>Go−</b> och <b>Pause</b>"),
        ("Programmering",   "4 encoders · nivåhjul · kommandoblock i MA2-layout"),
        ("Master",          "Grand master-fader och <b>B.O.</b> (blackout)"),
        ("Knappar",         "Bakgrundsbelysta, dimbara och tysta"),
        ("Ström",           "Inbyggt universalnätaggregat"),
    ],
    toc=[
        ("1", "Koppla upp bordet",                    "sida 2"),
        ("2", "Knapparna — vad som finns var",        "sida 2"),
        ("3", "Patcha armaturer",                     "sida 4"),
        ("4", "Programmera ljus och spara cues",      "sida 5"),
        ("5", "Köra showen live",                     "sida 6"),
        ("6", "Felsökning och felmeddelanden",        "sida 7"),
    ],
    safety_box=InfoBox("Innan eventdagen", [
        "Bordet gör ingenting utan en dator med <b>grandMA2 onPC</b>. Installera "
        "programmet och <b>testa hela kedjan</b> — dator, bord, DMX-kabel och en "
        "armatur — innan du åker. Ta med datorns laddare. Showfilen sparas på "
        "datorn, inte i bordet.",
    ], style="navy"),
    blocks=[
        # ---------- SIDA 2 ----------
        H2("1. Koppla upp bordet"),
        Steps([
            ("Installera grandMA2 onPC",
             "Ladda ner grandMA2 onPC från <b>malighting.com</b> och installera på en "
             "Windows-dator. Programmet är gratis. Kör det en gång innan bordet ansluts."),
            ("Anslut bordet",
             "Anslut strömkabeln till bordet och koppla bordet till datorn. "
             "Starta sedan grandMA2 onPC."),
            ("Kontrollera kontakten",
             "Dra i fader 1. Executor 1 på skärmen ska följa med. Gör den inte det "
             "har programmet inte hittat bordet — se felsökningen på sida 7."),
            ("Starta en ny show",
             "Tryck <b>Backup</b> → <b>New Show</b> och ge showen ett namn. Börja "
             "alltid med en tom show när du hyr — då ligger ingen gammal patch kvar."),
            ("Dra DMX till riggen",
             "DMX-kabel från bordets DMX-utgång till första armaturens DMX IN, vidare "
             "armatur till armatur. <b>120 ohms terminator</b> i sista armaturens "
             "DMX OUT."),
        ]),
        Space(3),
        H2("2. Knapparna — vad som finns var"),
        P("Bordet har fyra zoner: <b>executors</b> till vänster (det du kör showen "
          "med), <b>huvudexecutorn</b> med Go-knapparna i mitten, "
          "<b>kommandoblocket</b> till höger (det du programmerar med) och "
          "<b>encoders</b> överst."),
        H3("Executors och playback"),
        DataTable(
            headers=["Kontroll", "Funktion"],
            rows=[
                ["Fader 1–6",           "Executor-fadrar — nivå på sekvensen eller gruppen som ligger där"],
                ["Knappar över/under",  "Executorns knappar — t.ex. Go, Flash, Toggle, beroende på inställning"],
                ["101–106",             "Knapp-executors utan fader — bra för effekter och makron"],
                ["A/B-fadrar (100 mm)", "Huvudexecutorns två fadrar — för manuella övertoningar mellan cues"],
                ["Go+ / Go− / Pause",   "Huvudexecutorn: nästa cue, föregående cue, pausa fade"],
                ["Grand master",        "Fadern längst till höger — total ljusnivå för allt"],
                ["B.O.",                "Blackout — släcker allt. Beroende på inställning bara medan knappen hålls in, eller tills du trycker igen"],
                ["Fd Pg · Bt Pg +/−",   "Byter sida för fadrar respektive knapp-executors"],
            ],
            col_widths=[42 * mm, None],
            tight=True,
        ),
        Break(),

        # ---------- SIDA 3 ----------
        H3("Kommandoblocket"),
        DataTable(
            headers=["Knapp", "Funktion"],
            rows=[
                ["Fixture · Channel",   "Väljer armaturer (Fixture) eller dimmerkanaler (Channel)"],
                ["Group · Preset",      "Väljer grupp eller sparad färg/position"],
                ["Sequ · Cue · Exec",   "Sekvens, cue respektive executor i kommandoraden"],
                ["0–9 · . ",            "Nummerbord. <b>. .</b> (två punkter) ger 0 %"],
                ["Thru · + · −",        "Från–till, lägg till, ta bort: <i>1 Thru 4 + 8</i>"],
                ["At · Full",           "Sätter nivå: <i>At 50</i>, <i>Full</i> = 100 %"],
                ["Please",              "Utför kommandot — motsvarar Enter"],
                ["Store · Update",      "Sparar nytt / uppdaterar det som redan finns"],
                ["Clear",               "Rensar programmern — se ruta nedan"],
                ["Oops · Esc",          "Ångrar senaste åtgärd / avbryter kommandoraden"],
                ["Edit · Del · Copy · Move", "Redigera, radera, kopiera, flytta"],
                ["Highlt · Solo",       "Visar vald armatur tydligt / bara vald armatur tänd"],
                ["Blind · Prvw",        "Programmera utan att det syns på scen / förhandsvisa"],
                ["Prev · Next",         "Stegar mellan valda armaturer, en i taget"],
                ["Setup · Backup",      "Inställningar och patch / spara och ladda show"],
                ["Shift-knappen",       "Andra funktionen på en knapp (märkt <b>MA</b> på original-MA)"],
            ],
            col_widths=[42 * mm, None],
            tight=True,
        ),
        Space(3),
        InfoBox("Clear — tre tryck, tre steg", [
            "<b>1:a trycket</b> avmarkerar armaturerna, men värdena ligger kvar. "
            "<b>2:a trycket</b> gör värdena inaktiva — de syns kvar men följer inte med vid Store. <b>3:e trycket</b> tömmer "
            "programmern helt och armaturerna går tillbaka till det som spelas. "
            "Håll in Clear en sekund för att göra alla tre på en gång.",
            "Det som står i programmern (rött på skärmen) är <b>inte sparat</b> "
            "förrän du tryckt Store.",
        ]),
        Break(),

        # ---------- SIDA 4 ----------
        H2("3. Patcha armaturer"),
        P("Patchen talar om för bordet vilka armaturer som finns och på vilken "
          "DMX-adress. Ställ först adressen på varje armatur — se armaturens "
          "egen manual — och lägg sedan in samma adress här."),
        Steps([
            ("Öppna patchen",
             "<b>Setup</b> → fliken <b>Show</b> → <b>Patch &amp; Fixture Schedule</b>."),
            ("Lägg till armaturer",
             "Tryck <b>Add</b> → <b>Add new Fixtures</b>. Välj typ med "
             "<b>Add Fixturetypes from Library</b>: tillverkare, modell och kanalläge. "
             "Kanalläget måste vara <b>samma som på armaturen</b>."),
            ("Antal, ID och adress",
             "Ange antal (t.ex. 4), första Fixture ID (t.ex. 1) och patchadress i "
             "formen <b>universe.adress</b> — <b>1.001</b> är universe 1, kanal 1. "
             "Flera armaturer adresseras i följd automatiskt."),
            ("Bekräfta och lämna",
             "Tryck <b>Apply</b> / <b>OK</b>, stäng Setup och svara ja på frågan om "
             "att spara ändringarna."),
        ]),
        Space(2),
        DataTable(
            headers=["Exempel", "Armatur", "Kanalläge", "Adress i patchen"],
            rows=[
                ["Fixture 1–4", "LED PAR (8 kan.)",       "8 kanaler",  "1.001 · 1.009 · 1.017 · 1.025"],
                ["Fixture 5–6", "Moving Beam Bar",        "14 kanaler", "1.033 · 1.047"],
                ["Fixture 7",   "Rökmaskin",              "enligt manual", "1.061"],
            ],
            col_widths=[24 * mm, 40 * mm, 26 * mm, None],
            mono_cols=[3],
            tight=True,
        ),
        Space(3),
        InfoBox("Hittar du inte armaturen i biblioteket?", [
            "Välj en <b>Generic</b>-typ med samma antal kanaler, eller ring oss — "
            "vi har profiler till armaturerna vi hyr ut. Patcha aldrig en armatur "
            "med fel kanalantal: alla kanaler efter den förskjuts.",
        ]),
        Break(),

        # ---------- SIDA 5 ----------
        H2("4. Programmera ljus och spara cues"),
        H3("Tänd och ställ in"),
        DataTable(
            headers=["Du trycker", "Det händer"],
            rows=[
                ["Fixture 1 At Full Please",           "Armatur 1 på 100 %"],
                ["Fixture 1 Thru 4 At 50 Please",      "Armatur 1–4 på 50 %"],
                ["Fixture 1 Thru 10 − 5 At 70 Please", "1–10 utom 5 på 70 %"],
                ["Group 1 At Full Please",             "Hela grupp 1 på 100 %"],
                ["Fixture 3 . . ",                     "Armatur 3 på 0 %"],
            ],
            col_widths=[70 * mm, None],
            mono_cols=[0],
            tight=True,
        ),
        P("Färg, position och gobo ställs med de <b>fyra encoderna</b>. Skärmen "
          "visar vilken attributgrupp encoderna styr just nu — dimmer, position, "
          "färg, beam — och du byter grupp på skärmen. Nivåhjulet ändrar dimmern "
          "på de valda armaturerna."),
        H3("Spara som grupp och preset"),
        P("Välj armaturer, tryck <b>Store</b> och sedan en tom ruta i "
          "gruppfönstret. Samma sak med färger och positioner i presetfönstren. "
          "Grupper och presets gör resten av programmeringen mycket snabbare."),
        H3("Spara cues"),
        Steps([
            ("Bygg ljusbilden",
             "Tänd och ställ in det du vill ha med i cuen."),
            ("Spara",
             "<b>Store Please</b> sparar en ny cue på huvudexecutorn. "
             "<b>Store Cue 5 Please</b> sparar som cue 5. För en annan executor: "
             "<b>Store</b> och sedan executorns knapp."),
            ("Töm programmern",
             "<b>Clear</b> tre gånger innan du bygger nästa cue — annars följer "
             "värden med som du inte tänkt dig."),
            ("Rätta en cue",
             "Spela cuen, ändra det som ska ändras och tryck <b>Update</b>. Välj "
             "cuen i fönstret som visas. Sparar du på en cue som redan finns frågar "
             "bordet: <b>Merge</b> lägger till ändringarna, <b>Overwrite</b> "
             "ersätter hela cuen."),
        ]),
        Break(),

        # ---------- SIDA 6 ----------
        H2("5. Köra showen live"),
        UL([
            "<b>Go+</b> spelar nästa cue på huvudexecutorn, <b>Go−</b> backar ett "
            "steg, <b>Pause</b> fryser en fade som pågår.",
            "Executor-fadrarna styr nivån på det som ligger på varje executor — "
            "t.ex. en sekvens på fader 1 och en effekt på fader 2.",
            "<b>Grand master</b> är den sista räddningen: dra ner och allt blir "
            "mörkare. <b>B.O.</b> släcker allt på en gång.",
            "Byt executorsida med <b>Fd Pg +/−</b> om du lagt fler sekvenser än "
            "fadrarna räcker till.",
            "Vill du förbereda nästa bild under pågående show: tryck <b>Blind</b>, "
            "programmera, spara och slå av Blind igen. Publiken ser ingenting.",
        ]),
        H3("Spara showen"),
        P("<b>Backup</b> → <b>Save Show</b>. Gör det efter varje större ändring och "
          "alltid innan du stänger datorn. Showfilen ligger i datorn — ta en kopia "
          "på USB-minne om du vill kunna öppna den på en annan dator."),
        Space(3),
        InfoBox("Checklista före publiken kommer in", [
            "Grand master uppe · B.O. av · rätt executorsida · huvudexecutorn står "
            "på cue 1 eller i blackout · showen sparad · datorn på laddning och "
            "med <b>viloläge avstängt</b> — somnar datorn slutar bordet att sända.",
        ], style="navy"),
        Break(),

        # ---------- SIDA 7 ----------
        H2("6. Felsökning"),
        DataTable(
            headers=["Problem", "Åtgärd"],
            rows=[
                ["Fadrarna gör ingenting på skärmen",
                 "Programmet hittar inte bordet. Stäng grandMA2 onPC, kontrollera "
                 "kabeln till datorn, prova en annan USB-port och starta programmet igen."],
                ["Skärmen reagerar men riggen gör ingenting",
                 "Kontrollera att <b>Grand master</b> är uppe och att <b>B.O.</b> inte "
                 "är aktiv. Sedan DMX-kabeln, riktningen (OUT → IN) och terminatorn."],
                ["Bara vissa armaturer svarar",
                 "Fel adress eller universe i patchen, eller fel kanalläge. Jämför "
                 "armaturens display med patchen rad för rad."],
                ["Fel funktion på fel encoder",
                 "Kanalläget i patchen matchar inte armaturen. Ändra i patchen eller "
                 "på armaturen så att de är lika."],
                ["Värden följer med till nästa cue",
                 "Programmern var inte tömd. <b>Clear</b> tre gånger innan varje ny cue."],
                ["Något gick fel nyss",
                 "<b>Oops</b> ångrar senaste åtgärden. <b>Esc</b> avbryter en halvskriven "
                 "kommandorad."],
                ["Bordet slutar sända under show",
                 "Datorn har gått i viloläge eller tappat USB-strömmen. Stäng av "
                 "viloläge och energisparläge för USB i Windows."],
            ],
            col_widths=[52 * mm, None],
            tight=True,
        ),
        Space(3),
        H3("Vanliga felmeddelanden i kommandoraden"),
        DataTable(
            headers=["Nr", "Meddelande", "Betyder"],
            rows=[
                ["#1",  "Unknown command",   "Bordet förstår inte kommandot — tryck Esc och börja om"],
                ["#14", "Object does not exist", "Du pekar på något som inte finns, t.ex. en tom grupp"],
                ["#27", "Syntax error",      "Fel ordning i kommandot — kontrollera Thru, At och Please"],
                ["#33", "Destination not empty", "Platsen är upptagen — välj Overwrite, Merge eller en annan"],
                ["#44", "Insufficient user rights", "Inloggad användare saknar behörighet — logga in som Administrator"],
            ],
            col_widths=[14 * mm, 48 * mm, None],
            mono_cols=[0],
            tight=True,
        ),
    ],
)


# =============================================================================
# PRODUKTLISTA
# =============================================================================
# Ljuspaketens manualer ligger här. De fem tidigare armatur-manualerna
# (SK-LJS-EFF-0004, SK-LJS-DMX-0001, SK-LJS-ROK-0006, SK-LJS-EFF-0007,
# SK-LJS-EFF-0008) ligger ännu kvar i projektdokumentets version av den här
# filen och flyttas hit vid nästa revidering av dem. Undantag: EFF-0008 var
# en platshållare och är flyttad hit 2026-09-22 som SK-LJS-EFF-0022.
#
# OBS: SK-LJS-EFF-0009 och SK-LJS-EFF-0010 var PLATSHÅLLARE och är ersatta av
# SK-LJS-PAK-0020 respektive SK-LJS-PAK-0018. De gamla numren tillhör
# Laser RGB och Moving Head Wash i effektkatalogen och får inte återanvändas.

PRODUCTS = [
    SK_LJS_PAK_0018,
    SK_LJS_PAK_0020,
    SK_LJS_PAK_0025,
    SK_LJS_EFF_0022,
    SK_LJS_DMX_0011,
]


if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "/mnt/user-data/outputs"
    for p in PRODUCTS:
        path = build_manual(p, output_dir=out)
        print(f"OK {p.artno}  {p.name}  ->  {path}")
