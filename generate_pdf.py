import os
from fpdf import FPDF

class RTRPPDF(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_margins(left=31.75, top=25.4, right=25.4) # 1.25 in left, 1 in others
        self.set_auto_page_break(auto=True, margin=25.4)
        self.is_front_matter = True
        self.doc_title = "AI-POWERED REAL-TIME EXAM PROCTORING SYSTEM"
        self.dept_text = "Department of CSE (AI&ML), KMIT"

    def header(self):
        if self.is_front_matter or self.page_no() <= 10:
            return
        
        # Header for main chapters
        self.set_font("Times", "I", 8.5)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, self.doc_title, align="R", ln=1)
        self.ln(3)

    def footer(self):
        if self.is_front_matter or self.page_no() <= 10:
            # Roman numerals for front matter (not enabled by default, but we hide standard numbers)
            return
            
        self.set_y(-18)
        self.set_font("Times", "", 9.5)
        self.set_text_color(100, 100, 100)
        
        # Draw a thin footer separator line
        self.set_draw_color(200, 200, 200)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(2)
        
        # Page footer text
        self.cell(100, 10, self.dept_text, align="L")
        self.cell(0, 10, f"Page {self.page_no()}", align="R")

def clean_txt(text):
    text = text.replace('\u2019', "'") # smart apostrophe
    text = text.replace('\u2018', "'") # smart apostrophe
    text = text.replace('\u201c', '"') # smart double quote
    text = text.replace('\u201d', '"') # smart double quote
    text = text.replace('\u2013', '-') # en-dash
    text = text.replace('\u2014', '-') # em-dash
    text = text.replace('\u2022', '*') # bullet
    text = text.replace('\u2026', '...') # ellipsis
    text = text.replace('\u2705', 'PASS') # checkmark
    text = text.replace('\u201c', '"').replace('\u201d', '"').replace('\u2018', "'").replace('\u2019', "'")
    return text.encode('latin-1', 'replace').decode('latin-1')

def generate_pdf():
    # Read the markdown documentation
    md_path = "AI_Proctoring_KMIT_RTRP_Documentation.md"
    if not os.path.exists(md_path):
        print(f"Error: {md_path} not found.")
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.read().split('\n')

    pdf = RTRPPDF()
    pdf.add_page()
    pdf.set_font("Times", "", 12)

    in_table = False
    table_headers = []
    table_rows = []

    idx = 0
    while idx < len(lines):
        line = lines[idx].strip()
        
        # Detect Section Breaks (using page break cues or new chapters)
        if line.startswith("## Cover Page") or line.startswith("## Bonafide Certificate") or \
           line.startswith("## Declaration") or line.startswith("## Vision and Mission") or \
           line.startswith("## Program Outcomes") or line.startswith("## Project Outcomes") or \
           line.startswith("## Acknowledgement") or line.startswith("## Abstract") or \
           line.startswith("## Table of Contents") or line.startswith("## List of Figures") or \
           line.startswith("## Chapter"):
            
            # Start normal numbering after front matter (approx after figure lists / chapters start)
            if "Chapter" in line or "Conclusion" in line or "Future Enhancements" in line or "References" in line:
                pdf.is_front_matter = False
            
            pdf.add_page()
            idx += 1
            continue

        # Detect Headings
        if line.startswith("### "):
            text = clean_txt(line[4:])
            pdf.ln(4)
            pdf.set_font("Times", "B", 12)
            pdf.multi_cell(0, 6, text)
            pdf.ln(2)
            pdf.set_font("Times", "", 12)
            idx += 1
            continue
        elif line.startswith("## "):
            text = clean_txt(line[3:].upper())
            pdf.ln(6)
            pdf.set_font("Times", "B", 14)
            pdf.multi_cell(0, 7, text)
            pdf.ln(3)
            pdf.set_font("Times", "", 12)
            idx += 1
            continue
        elif line.startswith("# "):
            text = clean_txt(line[2:].upper())
            pdf.ln(8)
            pdf.set_font("Times", "B", 16)
            # Center Chapter Headings
            pdf.multi_cell(0, 8, text, align="C")
            pdf.ln(4)
            pdf.set_font("Times", "", 12)
            idx += 1
            continue

        # Detect Tables
        if line.startswith("|") and idx + 1 < len(lines) and lines[idx+1].strip().startswith("| :---"):
            in_table = True
            
            # Parse Headers
            table_headers = [clean_txt(cell.strip()) for cell in line.split("|")[1:-1]]
            
            # Skip separator line
            idx += 2
            table_rows = []
            
            # Read rows
            while idx < len(lines) and lines[idx].strip().startswith("|"):
                row_line = lines[idx].strip()
                row_cells = [clean_txt(cell.strip()) for cell in row_line.split("|")[1:-1]]
                table_rows.append(row_cells)
                idx += 1
                
            # Render Table
            pdf.ln(4)
            pdf.set_font("Times", "B", 10)
            
            # Compute proportional column widths based on cell counts
            col_count = len(table_headers)
            w_total = pdf.w - pdf.l_margin - pdf.r_margin
            
            # Simple column width heuristic
            if col_count == 2:
                col_widths = [w_total * 0.4, w_total * 0.6]
            elif col_count == 3:
                col_widths = [w_total * 0.3, w_total * 0.4, w_total * 0.3]
            elif col_count == 4:
                col_widths = [w_total * 0.25, w_total * 0.25, w_total * 0.25, w_total * 0.25]
            elif col_count == 5:
                col_widths = [w_total * 0.1, w_total * 0.35, w_total * 0.2, w_total * 0.25, w_total * 0.1]
            else:
                col_widths = [w_total / col_count] * col_count
                
            # Render Header
            pdf.set_fill_color(26, 26, 58) # #1A1A3A KMIT Dark blue
            pdf.set_text_color(255, 255, 255)
            for c_idx, h_cell in enumerate(table_headers):
                pdf.cell(col_widths[c_idx], 8, h_cell, border=1, align="C", fill=True)
            pdf.ln()
            
            # Render Data Rows
            pdf.set_font("Times", "", 9.5)
            pdf.set_text_color(0, 0, 0)
            
            for r_idx, row_data in enumerate(table_rows):
                # Simple shading
                fill_flag = r_idx % 2 == 0
                if fill_flag:
                    pdf.set_fill_color(245, 245, 245)
                else:
                    pdf.set_fill_color(255, 255, 255)
                    
                # To support multiline cells, compute max height
                max_h = 6
                for c_idx, val in enumerate(row_data):
                    # Pad cell if index out of bounds
                    val_str = val if c_idx < len(row_data) else ""
                    # simple alignment
                    align_style = "C" if col_count > 4 else "L"
                    if col_count == 2:
                        align_style = "L"
                    pdf.cell(col_widths[c_idx], max_h, val_str, border=1, align=align_style, fill=True)
                pdf.ln()
                
            pdf.ln(4)
            pdf.set_font("Times", "", 12)
            in_table = False
            continue

        # Detect Bullet list items
        if line.startswith("* ") or line.startswith("- "):
            text = clean_txt(line[2:])
            pdf.set_font("Times", "", 12)
            # Indent bullet list
            pdf.set_x(pdf.l_margin + 5)
            pdf.cell(5, 6, chr(149), border=0, align="L")
            pdf.multi_cell(0, 6, text)
            pdf.set_x(pdf.l_margin)
            pdf.ln(1.5)
            idx += 1
            continue

        # Standard Paragraph
        if line:
            text = clean_txt(line)
            # Check center alignments
            align_val = "L"
            if "DEPARTMENT OF" in text or "KESHAV MEMORIAL" in text or "A Project Report" in text or "Report on" in text:
                align_val = "C"
                pdf.set_font("Times", "B", 12)
            elif "BACHELOR OF" in text or "Submitted by" in text or "Under the Guidance of" in text:
                align_val = "C"
                pdf.set_font("Times", "B", 12)
            else:
                pdf.set_font("Times", "", 12)
                
            pdf.multi_cell(0, 6, text, align=align_val)
            pdf.ln(3.5)
            
        else:
            pdf.ln(2)

        idx += 1

    output_pdf_path = "AI_Proctoring_KMIT_RTRP_Documentation.pdf"
    pdf.output(output_pdf_path)
    print(f"PDF saved successfully at: {output_pdf_path}")

if __name__ == '__main__':
    generate_pdf()
