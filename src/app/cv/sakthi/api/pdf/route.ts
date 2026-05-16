import { renderToBuffer, DocumentProps } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { CVCoverLetter } from "../../_components/CVCoverLetter";
import { CVResume } from "../../_components/CVResume";
import { cvData } from "../../_data/cvData";
import { registerFonts } from "../../_styles";
import React from "react";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "cv";
  const isHeadhunterMode = searchParams.get("headhunter") === "true";

  try {
    // Ensure fonts are registered on the server
    await registerFonts();

    let element: React.ReactElement<DocumentProps>;
    if (type === "coverletter") {
      element = React.createElement(CVCoverLetter, {
        data: cvData,
        isHeadhunterMode,
      }) as React.ReactElement<DocumentProps>;
    } else {
      element = React.createElement(CVResume, {
        data: cvData,
        isHeadhunterMode,
      }) as React.ReactElement<DocumentProps>;
    }

    const buffer = await renderToBuffer(element);

    const fileNameSuffix = isHeadhunterMode ? "Candidate" : "Sakthi_Buddha";
    const fileName =
      type === "coverletter" ? `Cover_Letter_${fileNameSuffix}.pdf` : `CV_${fileNameSuffix}.pdf`;

    return new NextResponse(buffer as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: unknown) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
