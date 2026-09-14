#!/usr/bin/env python3
"""Render docs/changes/complete-pos-logic-th.md to a Thai PDF."""

from __future__ import annotations

import re
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
)

ROOT = Path(__file__).resolve().parents[2]
MD_PATH = Path(__file__).with_name("complete-pos-logic-th.md")
PDF_PATH = Path(__file__).with_name("complete-pos-logic-th.pdf")
FONT_PATH = Path("/System/Library/Fonts/Supplemental/Ayuthaya.ttf")

ORANGE = HexColor("#c2410c")
STONE = HexColor("#44403c")
MUTED = HexColor("#78716c")
CODE_BG = HexColor("#f5f5f4")


def register_font() -> str:
    if not FONT_PATH.exists():
        raise SystemExit(f"Thai font not found: {FONT_PATH}")
    pdfmetrics.registerFont(TTFont("Thai", str(FONT_PATH)))
    return "Thai"


def escape(text: str) -> str:
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"`([^`]+)`", r"<font name='Courier' size='9'>\1</font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    return text


def parse_blocks(markdown: str) -> list[tuple[str, str | list[str]]]:
    blocks: list[tuple[str, str | list[str]]] = []
    lines = markdown.replace("\r\n", "\n").split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            chunk: list[str] = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                chunk.append(lines[i])
                i += 1
            blocks.append(("code", "\n".join(chunk)))
            i += 1
            continue
        if line.startswith("# "):
            blocks.append(("h1", line[2:].strip()))
        elif line.startswith("## "):
            blocks.append(("h2", line[3:].strip()))
        elif line.startswith("### "):
            blocks.append(("h3", line[4:].strip()))
        elif line.startswith("---"):
            blocks.append(("rule", ""))
        elif line.startswith("- "):
            items = [line[2:].strip()]
            i += 1
            while i < len(lines) and lines[i].startswith("- "):
                items.append(lines[i][2:].strip())
                i += 1
            blocks.append(("ul", items))
            continue
        elif re.match(r"^\d+\. ", line):
            items = [re.sub(r"^\d+\. ", "", line).strip()]
            i += 1
            while i < len(lines) and re.match(r"^\d+\. ", lines[i]):
                items.append(re.sub(r"^\d+\. ", "", lines[i]).strip())
                i += 1
            blocks.append(("ol", items))
            continue
        elif line.strip():
            para = [line.strip()]
            i += 1
            while i < len(lines) and lines[i].strip() and not lines[i].startswith(("#", "-", "```", "---")) and not re.match(r"^\d+\. ", lines[i]):
                para.append(lines[i].strip())
                i += 1
            blocks.append(("p", " ".join(para)))
            continue
        i += 1
    return blocks


def header_footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFillColor(ORANGE)
    canvas.rect(0, A4[1] - 8 * mm, A4[0], 8 * mm, fill=1, stroke=0)
    canvas.setFillColor(MUTED)
    canvas.setFont("Thai", 8)
    canvas.drawString(18 * mm, 12 * mm, "Fair POS — สรุปการเปลี่ยนแปลง")
    canvas.drawRightString(A4[0] - 18 * mm, 12 * mm, str(doc.page))
    canvas.restoreState()


def build() -> None:
    font = register_font()
    styles = {
        "h1": ParagraphStyle(
            "h1",
            fontName=font,
            fontSize=20,
            leading=28,
            textColor=ORANGE,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName=font,
            fontSize=14,
            leading=20,
            textColor=ORANGE,
            spaceBefore=14,
            spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "h3",
            fontName=font,
            fontSize=12,
            leading=17,
            textColor=STONE,
            spaceBefore=10,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            fontName=font,
            fontSize=10.5,
            leading=16,
            textColor=STONE,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        ),
        "li": ParagraphStyle(
            "li",
            fontName=font,
            fontSize=10.5,
            leading=16,
            textColor=STONE,
        ),
        "code": ParagraphStyle(
            "code",
            fontName="Courier",
            fontSize=9,
            leading=13,
            textColor=STONE,
            backColor=CODE_BG,
            leftIndent=6,
            rightIndent=6,
            spaceBefore=4,
            spaceAfter=8,
        ),
        "meta": ParagraphStyle(
            "meta",
            fontName=font,
            fontSize=10,
            leading=15,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=4,
        ),
    }

    story = []
    markdown = MD_PATH.read_text(encoding="utf-8")
    for kind, payload in parse_blocks(markdown):
        if kind == "h1":
            story.append(Spacer(1, 8 * mm))
            story.append(Paragraph(escape(str(payload)), styles["h1"]))
        elif kind == "h2":
            story.append(Paragraph(escape(str(payload)), styles["h2"]))
        elif kind == "h3":
            story.append(Paragraph(escape(str(payload)), styles["h3"]))
        elif kind == "p":
            text = escape(str(payload))
            style = styles["meta"] if story and isinstance(story[-1], Paragraph) and story[-1].style.name == "h1" else styles["body"]
            # first few meta lines after title use muted style if they look like metadata
            if "สาขา:" in str(payload) or "วันที่:" in str(payload) or "ผู้จัดทำ:" in str(payload):
                style = styles["meta"]
            story.append(Paragraph(text, style))
        elif kind in ("ul", "ol"):
            items = []
            for item in payload:  # type: ignore[union-attr]
                items.append(ListItem(Paragraph(escape(item), styles["li"]), leftIndent=12, bulletColor=ORANGE))
            story.append(
                ListFlowable(
                    items,
                    bulletType="1" if kind == "ol" else "bullet",
                    start="1",
                    leftIndent=18,
                    bulletFontName=font,
                    bulletFontSize=10,
                    spaceAfter=8,
                )
            )
        elif kind == "code":
            story.append(Preformatted(str(payload), styles["code"]))
        elif kind == "rule":
            story.append(Spacer(1, 4 * mm))

    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=20 * mm,
        title="สรุปการเปลี่ยนแปลง Fair POS",
        author="Fair POS",
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"Wrote {PDF_PATH}")


if __name__ == "__main__":
    build()
