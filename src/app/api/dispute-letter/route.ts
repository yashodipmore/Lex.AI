import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { getUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { getDisputeLetterPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      senderName,
      senderAddress,
      senderPhone,
      senderEmail,
      senderAdvocate,
      receiverName,
      receiverAddress,
      receiverDesignation,
      agreementDate,
      agreementType,
      clauseText,
      incidentDescription,
      incidentDate,
      reliefSought,
      documentType = "other",
    } = body;

    // Validate ALL required fields — nothing should be empty
    const requiredFields: [string, string][] = [
      ["senderName", "Your Full Name"],
      ["senderAddress", "Your Address"],
      ["senderPhone", "Your Phone Number"],
      ["senderEmail", "Your Email"],
      ["receiverName", "Receiver's Full Name"],
      ["receiverAddress", "Receiver's Address"],
      ["agreementDate", "Date of Agreement"],
      ["agreementType", "Type of Agreement"],
      ["clauseText", "Relevant Clause"],
      ["incidentDescription", "Incident Description"],
      ["incidentDate", "Date of Incident"],
      ["reliefSought", "Relief / Remedy Sought"],
    ];

    const missingFields: string[] = [];
    for (const [key, label] of requiredFields) {
      const val = body[key];
      if (!val || (typeof val === "string" && val.trim().length === 0)) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Please fill all required fields: ${missingFields.join(", ")}`,
          missingFields,
        },
        { status: 400 }
      );
    }

    const prompt = getDisputeLetterPrompt(
      senderName,
      senderAddress,
      senderPhone,
      senderEmail,
      senderAdvocate || "",
      receiverName,
      receiverAddress,
      receiverDesignation || "",
      agreementDate,
      agreementType,
      clauseText,
      incidentDescription,
      incidentDate,
      reliefSought,
      documentType
    );

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return NextResponse.json({ error: "AI returned empty response" }, { status: 502 });
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 502 });
    }

    // Log activity
    await connectDB();
    await Activity.create({
      userId: user.userId,
      type: "dispute_generated",
      description: `Generated legal notice for "${receiverName}" regarding ${agreementType}`,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Dispute letter error:", error);
    return NextResponse.json({ error: "Failed to generate dispute letter" }, { status: 500 });
  }
}
