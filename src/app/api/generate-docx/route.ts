import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  SectionType,
} from "docx";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { letter, senderName, receiverName, noticeRef, applicableLaws } = await req.json();

    if (!letter) {
      return NextResponse.json({ error: "Letter content is required" }, { status: 400 });
    }

    // Parse the letter into paragraphs
    const lines = letter.split("\n");
    const docParagraphs: Paragraph[] = [];

    // Add top border line
    docParagraphs.push(
      new Paragraph({
        border: {
          bottom: { style: BorderStyle.DOUBLE, size: 3, color: "000000" },
        },
        spacing: { after: 200 },
      })
    );

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine === "") {
        docParagraphs.push(new Paragraph({ spacing: { after: 80 } }));
        continue;
      }

      // Detect headers / important lines
      const isHeader =
        trimmedLine === "LEGAL NOTICE" ||
        trimmedLine.startsWith("LEGAL NOTICE") ||
        trimmedLine === "WITHOUT PREJUDICE" ||
        trimmedLine.startsWith("WITHOUT PREJUDICE");
      
      const isSubHeader =
        trimmedLine.startsWith("SUBJECT:") ||
        trimmedLine.startsWith("TO:") ||
        trimmedLine.startsWith("FROM:") ||
        trimmedLine.startsWith("DATE:") ||
        trimmedLine.startsWith("REF") ||
        trimmedLine.startsWith("Ref") ||
        trimmedLine.startsWith("SENT VIA") ||
        trimmedLine.startsWith("Sent via") ||
        trimmedLine.startsWith("CC:") ||
        trimmedLine.startsWith("Encl:");

      const isBoldLine =
        trimmedLine.startsWith("AND WHEREAS") ||
        trimmedLine.startsWith("WHEREAS") ||
        trimmedLine.startsWith("I HEREBY") ||
        trimmedLine.startsWith("I/MY CLIENT HEREBY") ||
        trimmedLine.startsWith("MY CLIENT HEREBY") ||
        trimmedLine.startsWith("PLEASE TAKE NOTICE") ||
        trimmedLine.startsWith("FAILING WHICH") ||
        trimmedLine.startsWith("TAKE NOTICE") ||
        trimmedLine.startsWith("NOW THEREFORE");

      if (isHeader) {
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: trimmedLine,
                bold: true,
                size: 32,
                font: "Times New Roman",
                underline: {},
              }),
            ],
          })
        );
      } else if (isSubHeader) {
        docParagraphs.push(
          new Paragraph({
            spacing: { before: 120, after: 80 },
            children: [
              new TextRun({
                text: trimmedLine,
                bold: true,
                size: 22,
                font: "Times New Roman",
              }),
            ],
          })
        );
      } else if (isBoldLine) {
        // Split into bold prefix and normal rest
        const boldPrefixes = [
          "AND WHEREAS",
          "WHEREAS",
          "I/MY CLIENT HEREBY CALL UPON YOU",
          "I HEREBY CALL UPON YOU",
          "MY CLIENT HEREBY",
          "PLEASE TAKE NOTICE",
          "FAILING WHICH",
          "TAKE NOTICE",
          "NOW THEREFORE",
        ];
        let matchedPrefix = "";
        for (const prefix of boldPrefixes) {
          if (trimmedLine.startsWith(prefix)) {
            matchedPrefix = prefix;
            break;
          }
        }
        const rest = trimmedLine.slice(matchedPrefix.length);

        docParagraphs.push(
          new Paragraph({
            spacing: { before: 160, after: 80 },
            children: [
              new TextRun({
                text: matchedPrefix,
                bold: true,
                size: 22,
                font: "Times New Roman",
              }),
              new TextRun({
                text: rest,
                size: 22,
                font: "Times New Roman",
              }),
            ],
          })
        );
      } else {
        // Regular paragraph
        docParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: trimmedLine,
                size: 22,
                font: "Times New Roman",
              }),
            ],
          })
        );
      }
    }

    // Add bottom border
    docParagraphs.push(
      new Paragraph({
        border: {
          top: { style: BorderStyle.DOUBLE, size: 3, color: "000000" },
        },
        spacing: { before: 200, after: 100 },
      })
    );

    // Footer note
    docParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100 },
        children: [
          new TextRun({
            text: "Generated by LexAI — AI Legal Agent | For professional legal advice, consult a qualified advocate",
            size: 16,
            font: "Times New Roman",
            italics: true,
            color: "666666",
          }),
        ],
      })
    );

    const doc = new Document({
      creator: "LexAI - AI Legal Agent",
      title: `Legal Notice - ${senderName || "Sender"} to ${receiverName || "Receiver"}`,
      description: `Legal Notice ${noticeRef || ""}`,
      styles: {
        default: {
          document: {
            run: {
              font: "Times New Roman",
              size: 22,
            },
          },
        },
      },
      sections: [
        {
          properties: {
            type: SectionType.CONTINUOUS,
            page: {
              margin: {
                top: 1440,    // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: docParagraphs,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const uint8 = new Uint8Array(buffer);

    return new Response(uint8, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="Legal_Notice_${(noticeRef || "LexAI").replace(/\//g, "_")}.docx"`,
      },
    });
  } catch (error: unknown) {
    console.error("DOCX generation error:", error);
    return NextResponse.json({ error: "Failed to generate document" }, { status: 500 });
  }
}
