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
# PRODUKTLISTA
# =============================================================================
# Ljuspaketens manualer ligger här. De fem tidigare armatur-manualerna
# (SK-LJS-EFF-0004, SK-LJS-DMX-0001, SK-LJS-ROK-0006, SK-LJS-EFF-0007,
# SK-LJS-EFF-0008) ligger ännu kvar i projektdokumentets version av den här
# filen och flyttas hit vid nästa revidering av dem.
#
# OBS: SK-LJS-EFF-0009 och SK-LJS-EFF-0010 var PLATSHÅLLARE och är ersatta av
# SK-LJS-PAK-0020 respektive SK-LJS-PAK-0018. De gamla numren tillhör
# Laser RGB och Moving Head Wash i effektkatalogen och får inte återanvändas.

PRODUCTS = [
    SK_LJS_PAK_0018,
    SK_LJS_PAK_0020,
    SK_LJS_PAK_0025,
]


if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "/mnt/user-data/outputs"
    for p in PRODUCTS:
        path = build_manual(p, output_dir=out)
        print(f"OK {p.artno}  {p.name}  ->  {path}")
