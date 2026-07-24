import os
import sys
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Skip cover page
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header
        self.drawString(54, 750, "ensPR — Enterprise Sustainability Platform (LCA + PROPER + Karbon Kredit)")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)
        
        # Footer
        self.line(54, 50, 558, 50)
        page_str = f"Halaman {self._pageNumber} dari {page_count}"
        self.drawRightString(558, 36, page_str)
        self.drawString(54, 36, "CONFIDENTIAL — Dokumen Konsep & Strategi Bisnis ensPR")
        self.restoreState()

def parse_markdown_to_story(md_path, styles):
    story = []
    if not os.path.exists(md_path):
        return story

    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_table = False
    table_lines = []

    def flush_table():
        nonlocal in_table, table_lines
        if not table_lines:
            return
        
        # Process table
        headers = [c.strip() for c in table_lines[0].split('|')[1:-1]]
        rows = []
        for line in table_lines[2:]: # skip separator
            if '|' in line:
                cols = [c.strip() for c in line.split('|')[1:-1]]
                rows.append(cols)

        table_data = []
        # Header row
        header_row = [Paragraph(f"<b>{h}</b>", styles['TableHeader']) for h in headers]
        table_data.append(header_row)

        for row in rows:
            formatted_row = [Paragraph(cell, styles['TableCell']) for cell in row]
            table_data.append(formatted_row)

        col_count = len(headers)
        if col_count > 0:
            col_width = 504.0 / col_count
            col_widths = [col_width] * col_count
            t = Table(table_data, colWidths=col_widths)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#059669")),
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('LEFTPADDING', (0,0), (-1,-1), 6),
                ('RIGHTPADDING', (0,0), (-1,-1), 6),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
            ]))
            story.append(Spacer(1, 8))
            story.append(t)
            story.append(Spacer(1, 10))

        table_lines = []
        in_table = False

    for line in lines:
        stripped = line.strip()

        # Handle tables
        if stripped.startswith('|'):
            in_table = True
            table_lines.append(stripped)
            continue
        elif in_table:
            flush_table()

        if not stripped:
            continue

        # Clean markdown bold/italic for ReportLab
        clean_text = stripped
        clean_text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', clean_text)
        clean_text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', clean_text)
        clean_text = re.sub(r'`(.*?)`', r'<font face="Courier" color="#0f766e"><b>\1</b></font>', clean_text)
        clean_text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<u>\1</u>', clean_text)

        # Headings
        if stripped.startswith('# '):
            story.append(Spacer(1, 14))
            story.append(Paragraph(clean_text[2:], styles['DocH1']))
            story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#059669"), spaceBefore=4, spaceAfter=10))
        elif stripped.startswith('## '):
            story.append(Spacer(1, 12))
            story.append(Paragraph(clean_text[3:], styles['DocH2']))
            story.append(Spacer(1, 6))
        elif stripped.startswith('### '):
            story.append(Spacer(1, 10))
            story.append(Paragraph(clean_text[4:], styles['DocH3']))
            story.append(Spacer(1, 4))
        elif stripped.startswith('- ') or stripped.startswith('* ') or stripped.startswith('• '):
            bullet_txt = clean_text[2:]
            story.append(Paragraph(f"• {bullet_txt}", styles['DocBullet']))
        elif stripped.startswith('> '):
            quote_txt = clean_text[2:]
            story.append(Paragraph(f"<i>{quote_txt}</i>", styles['DocQuote']))
        elif stripped.startswith('---'):
            story.append(Spacer(1, 8))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#cbd5e1"), spaceBefore=4, spaceAfter=8))
        else:
            story.append(Paragraph(clean_text, styles['DocBody']))
            story.append(Spacer(1, 4))

    if in_table:
        flush_table()

    return story

def build_pdf():
    pdf_filename = "Dokumen_Lengkap_ensPR.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=60,
        bottomMargin=60
    )

    styles = getSampleStyleSheet()

    # Custom styles
    styles.add(ParagraphStyle('CoverTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=26, leading=32, textColor=colors.HexColor("#0f172a"), alignment=1))
    styles.add(ParagraphStyle('CoverSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=14, leading=20, textColor=colors.HexColor("#059669"), alignment=1))
    styles.add(ParagraphStyle('CoverMeta', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=10, leading=14, textColor=colors.HexColor("#64748b"), alignment=1))

    styles.add(ParagraphStyle('DocH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=colors.HexColor("#0f172a")))
    styles.add(ParagraphStyle('DocH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=colors.HexColor("#059669")))
    styles.add(ParagraphStyle('DocH3', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=colors.HexColor("#334155")))
    styles.add(ParagraphStyle('DocBody', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=14, textColor=colors.HexColor("#1e293b")))
    styles.add(ParagraphStyle('DocBullet', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=14, textColor=colors.HexColor("#1e293b"), leftIndent=15))
    styles.add(ParagraphStyle('DocQuote', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=9.5, leading=14, textColor=colors.HexColor("#0f766e"), leftIndent=15, rightIndent=15))

    styles.add(ParagraphStyle('TableHeader', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=colors.white))
    styles.add(ParagraphStyle('TableCell', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11, textColor=colors.HexColor("#1e293b")))

    story = []

    # COVER PAGE
    story.append(Spacer(1, 100))
    story.append(Paragraph("ensPR — Enterprise Sustainability Platform", styles['CoverTitle']))
    story.append(Spacer(1, 15))
    story.append(Paragraph("Dokumen Panduan, Evaluasi Arsitektur, Strategi Harga & Persiapan PROPER", styles['CoverSubtitle']))
    story.append(Spacer(1, 30))
    story.append(HRFlowable(width="60%", thickness=2, color=colors.HexColor("#059669"), spaceBefore=10, spaceAfter=20))
    story.append(Spacer(1, 150))
    story.append(Paragraph("<b>Dibuat untuk:</b> Manajemen Pabrik, Tim EHS & Direksi BUMN<br/><b>Versi:</b> 1.0 (B2B Enterprise Edition)<br/><b>Tanggal:</b> Juli 2026", styles['CoverMeta']))
    story.append(PageBreak())

    # Order of docs to merge into 1 PDF
    docs_to_merge = [
        ("docs/pricing.md", "Bagian 1: Strategi & Model Penetapan Harga SaaS"),
        ("docs/evaluasi.md", "Bagian 2: Evaluasi Arsitektur 360° & Blueprint Sistem"),
        ("docs/arsitektur_fitur.md", "Bagian 3: Panduan 5 Modul Utama ensPR"),
        ("docs/proper_persiapan.md", "Bagian 4: Checklist Baku Mutu & Persiapan PROPER KLHK")
    ]

    for md_file, section_title in docs_to_merge:
        story.append(Paragraph(section_title, styles['DocH1']))
        story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#059669"), spaceBefore=4, spaceAfter=14))
        doc_story = parse_markdown_to_story(md_file, styles)
        story.extend(doc_story)
        story.append(PageBreak())

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: Generated single PDF document '{pdf_filename}' containing all docs!")

if __name__ == "__main__":
    build_pdf()
