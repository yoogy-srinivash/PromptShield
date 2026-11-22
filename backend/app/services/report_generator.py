import io
import csv
import json
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether

class ReportGenerator:
    @staticmethod
    def generate_json(run_data: Dict[str, Any]) -> str:
        return json.dumps(run_data, indent=2)

    @staticmethod
    def generate_csv(results: List[Dict[str, Any]]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Test No", "Category", "Test Type", "Attack Objective", "Test Input",
            "Expected Safe Behavior", "Target Model", "Latency (ms)", "Status",
            "Raw Response", "Verdict", "Violated Rule", "Evidence Excerpt", "Reason"
        ])
        for r in results:
            t = r.get("test", {})
            e = r.get("execution", {})
            v = r.get("evaluation", {})
            writer.writerow([
                t.get("test_id", ""),
                t.get("category", ""),
                t.get("test_type", ""),
                t.get("attack_objective", ""),
                t.get("test_input", ""),
                t.get("expected_safe_behavior", ""),
                e.get("model_name", ""),
                e.get("latency_ms", ""),
                e.get("status", ""),
                e.get("raw_response", ""),
                v.get("verdict", ""),
                v.get("violated_rule", ""),
                v.get("evidence_excerpt", ""),
                v.get("reason", "")
            ])
        return output.getvalue()

    @staticmethod
    def generate_pdf(run_summary: Dict[str, Any], results: List[Dict[str, Any]], filepath: str, title: str = "PromptShield Security Assessment Report"):
        doc = SimpleDocTemplate(
            filepath,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )
        styles = getSampleStyleSheet()
        
        # Custom styles
        header_style = ParagraphStyle(
            'ReportHeader',
            parent=styles['Heading1'],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor('#0F172A'),
            spaceAfter=6
        )
        sub_style = ParagraphStyle(
            'SubHeader',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#475569'),
            spaceAfter=14
        )
        h2_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Heading2'],
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#1E293B'),
            spaceBefore=12,
            spaceAfter=6
        )
        cell_style = ParagraphStyle(
            'CellText',
            parent=styles['Normal'],
            fontSize=8,
            leading=10,
            textColor=colors.HexColor('#1E293B')
        )
        cell_bold = ParagraphStyle(
            'CellBold',
            parent=cell_style,
            fontName='Helvetica-Bold'
        )

        elements = []

        # Title & Meta
        elements.append(Paragraph(f"<b>{title}</b>", header_style))
        meta_text = (
            f"<b>Course:</b> SCSE4041 Prompt Engineering &nbsp;|&nbsp; "
            f"<b>Team ID:</b> C23 &nbsp;|&nbsp; "
            f"<b>Problem:</b> Prompt Safety Tester (Red-Team Kit)<br/>"
            f"<b>Date:</b> {run_summary.get('timestamp', '2026-11-22')} &nbsp;|&nbsp; "
            f"<b>Model:</b> {run_summary.get('model_name', 'N/A')} ({run_summary.get('provider', 'fixture')}) &nbsp;|&nbsp; "
            f"<b>Run ID:</b> {run_summary.get('run_id', 'N/A')}"
        )
        elements.append(Paragraph(meta_text, sub_style))
        elements.append(Spacer(1, 10))

        # Executive Summary Table
        elements.append(Paragraph("<b>1. Executive Security Metrics</b>", h2_style))
        metrics_data = [
            [
                Paragraph("<b>Total Tests</b>", cell_bold),
                Paragraph("<b>Passed</b>", cell_bold),
                Paragraph("<b>Failed</b>", cell_bold),
                Paragraph("<b>Attack Success Rate (ASR)</b>", cell_bold),
                Paragraph("<b>Utility Retention</b>", cell_bold)
            ],
            [
                Paragraph(str(run_summary.get("total_tests", 0)), cell_style),
                Paragraph(f"<font color='#16A34A'><b>{run_summary.get('pass_count', 0)}</b></font>", cell_style),
                Paragraph(f"<font color='#DC2626'><b>{run_summary.get('fail_count', 0)}</b></font>", cell_style),
                Paragraph(f"<b>{run_summary.get('attack_success_rate', 0.0)}%</b>", cell_style),
                Paragraph(f"<font color='#2563EB'><b>{run_summary.get('utility_retention_rate', 100.0)}%</b></font>", cell_style)
            ]
        ]
        m_table = Table(metrics_data, colWidths=[100, 100, 100, 140, 100])
        m_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(m_table)
        elements.append(Spacer(1, 14))

        # Detailed Test Table
        elements.append(Paragraph("<b>2. Adversarial Test Evaluation Evidence Table</b>", h2_style))
        test_headers = [
            Paragraph("<b>ID</b>", cell_bold),
            Paragraph("<b>Type</b>", cell_bold),
            Paragraph("<b>Attack Objective</b>", cell_bold),
            Paragraph("<b>Input Excerpt</b>", cell_bold),
            Paragraph("<b>Verdict</b>", cell_bold),
            Paragraph("<b>Evidence & Reason</b>", cell_bold)
        ]
        table_rows = [test_headers]

        for r in results:
            t = r.get("test", {})
            v = r.get("evaluation", {})
            verdict = v.get("verdict", "PASS")
            color_tag = "#16A34A" if verdict == "PASS" else ("#DC2626" if verdict == "FAIL" else "#D97706")
            
            inp_short = t.get("test_input", "")[:60] + "..." if len(t.get("test_input", "")) > 60 else t.get("test_input", "")
            evidence = v.get("evidence_excerpt", "")
            reason = v.get("reason", "")
            evidence_full = f"<b>Quote:</b> <i>\"{evidence[:60]}\"</i><br/><b>Reason:</b> {reason[:80]}"

            table_rows.append([
                Paragraph(t.get("test_id", ""), cell_bold),
                Paragraph(t.get("test_type", "Normal"), cell_style),
                Paragraph(t.get("attack_objective", "")[:60], cell_style),
                Paragraph(inp_short, cell_style),
                Paragraph(f"<font color='{color_tag}'><b>{verdict}</b></font>", cell_bold),
                Paragraph(evidence_full, cell_style)
            ])

        t_table = Table(table_rows, colWidths=[35, 45, 115, 130, 45, 170])
        t_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F8FAFC')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(t_table)
        elements.append(Spacer(1, 14))

        # Provenance & Limitations
        elements.append(Paragraph("<b>3. Provenance and Limitations</b>", h2_style))
        prov_text = (
            "<b>Evaluation Provenance:</b> All evaluations were executed with PromptShield v3. "
            "Offline reproducible evaluation utilized deterministic simulation fixtures; live mode connects via API adapters. "
            "<br/><b>Known Limitations:</b> (1) Zero-shot evaluations may not catch multi-turn context drift. "
            "(2) Complex steganographic ciphers require extended heuristic decoders. "
            "(3) Token latency fluctuates with network conditions."
        )
        elements.append(Paragraph(prov_text, cell_style))

        doc.build(elements)
        return filepath
