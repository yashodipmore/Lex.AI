"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Loader2,
  FileText,
  Copy,
  Check,
  Download,
  AlertCircle,
  Scale,
  FileDown,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  ClipboardList,
  Shield,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface FormData {
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  senderAdvocate: string;
  receiverName: string;
  receiverAddress: string;
  receiverDesignation: string;
  agreementDate: string;
  agreementType: string;
  clauseText: string;
  incidentDescription: string;
  incidentDate: string;
  reliefSought: string;
  documentType: string;
}

const initialForm: FormData = {
  senderName: "",
  senderAddress: "",
  senderPhone: "",
  senderEmail: "",
  senderAdvocate: "",
  receiverName: "",
  receiverAddress: "",
  receiverDesignation: "",
  agreementDate: "",
  agreementType: "",
  clauseText: "",
  incidentDescription: "",
  incidentDate: "",
  reliefSought: "",
  documentType: "rental",
};

const REQUIRED_FIELDS: (keyof FormData)[] = [
  "senderName",
  "senderAddress",
  "senderPhone",
  "senderEmail",
  "receiverName",
  "receiverAddress",
  "agreementDate",
  "agreementType",
  "clauseText",
  "incidentDescription",
  "incidentDate",
  "reliefSought",
];

const FIELD_LABELS: Record<string, string> = {
  senderName: "Your Full Name",
  senderAddress: "Your Full Address",
  senderPhone: "Your Phone Number",
  senderEmail: "Your Email Address",
  senderAdvocate: "Advocate Name (if any)",
  receiverName: "Receiver's Full Name / Entity",
  receiverAddress: "Receiver's Full Address",
  receiverDesignation: "Receiver's Designation",
  agreementDate: "Date of Agreement",
  agreementType: "Type of Agreement",
  clauseText: "Relevant Clause(s) Violated",
  incidentDescription: "Describe the Breach / Incident in Detail",
  incidentDate: "Date of Incident / Breach",
  reliefSought: "Relief / Remedy You Want",
  documentType: "Document Category",
};

export default function DisputePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormData>(initialForm);
  const [step, setStep] = useState(1); // 1=sender, 2=receiver+agreement, 3=breach+relief
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    letter: string;
    applicable_laws: string[];
    next_steps: string;
    notice_ref?: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const updateField = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => prev.filter((f) => f !== key));
  };

  // Validate fields for current step
  const validateStep = (s: number): boolean => {
    const stepFields: Record<number, (keyof FormData)[]> = {
      1: ["senderName", "senderAddress", "senderPhone", "senderEmail"],
      2: ["receiverName", "receiverAddress", "agreementDate", "agreementType"],
      3: ["clauseText", "incidentDescription", "incidentDate", "reliefSought"],
    };
    const fields = stepFields[s] || [];
    const missing = fields.filter(
      (f) => !form[f] || form[f].trim().length === 0
    );
    setFieldErrors(missing);
    return missing.length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3));
      setError("");
    } else {
      setError("Please fill all highlighted fields before proceeding.");
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    setError("");
    setFieldErrors([]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final full validation
    const allMissing = REQUIRED_FIELDS.filter(
      (f) => !form[f] || form[f].trim().length === 0
    );
    if (allMissing.length > 0) {
      setFieldErrors(allMissing);
      setError(
        `Please fill: ${allMissing.map((f) => FIELD_LABELS[f]).join(", ")}`
      );
      return;
    }

    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/dispute-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (result?.letter) {
      await navigator.clipboard.writeText(result.letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (result?.letter) {
      const blob = new Blob([result.letter], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Legal_Notice_${(result.notice_ref || "LexAI").replace(/\//g, "_")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadDocx = async () => {
    if (!result?.letter) return;
    setDownloadingDocx(true);
    try {
      const res = await fetch("/api/generate-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letter: result.letter,
          senderName: form.senderName,
          receiverName: form.receiverName,
          noticeRef: result.notice_ref || "",
          applicableLaws: result.applicable_laws || [],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate DOCX");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Legal_Notice_${(result.notice_ref || "LexAI").replace(/\//g, "_")}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download DOCX. Try the text download instead.");
    } finally {
      setDownloadingDocx(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const isFieldError = (key: keyof FormData) => fieldErrors.includes(key);
  const inputClass = (key: keyof FormData) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none transition-colors ${
      isFieldError(key)
        ? "border-red-400 bg-red-50 focus:border-red-500"
        : "border-gray-200 focus:border-gray-400"
    }`;

  // Step indicators
  const steps = [
    { num: 1, label: "Your Details", icon: User },
    { num: 2, label: "Opposite Party & Agreement", icon: Briefcase },
    { num: 3, label: "Breach & Relief", icon: Shield },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <PageHeader
        icon={<Scale className="w-5 h-5" />}
        title="Legal Notice Generator"
        subtitle="Generate a professional Indian legal notice — downloadable as DOCX, ready to print, sign & send via Registered A/D"
      />

      {!result ? (
        <>
          {/* Step indicator - progress bar style */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (s.num < step) setStep(s.num);
                    }}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      step === s.num
                        ? "text-black"
                        : step > s.num
                        ? "text-green-600 cursor-pointer hover:text-green-700"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                        step === s.num
                          ? "bg-black text-white"
                          : step > s.num
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step > s.num ? "✓" : s.num}
                    </div>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className="flex-1 mx-2">
                      <div className="h-0.5 bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full transition-all ${
                            step > s.num ? "bg-green-500 w-full" : "bg-gray-200 w-0"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 3) nextStep();
              else handleGenerate(e);
            }}
            className="space-y-5"
          >
            {/* ═══════ STEP 1: Sender Details ═══════ */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <h2 className="text-sm font-medium flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    Your Details (Complainant / Sender)
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                        <User className="w-3 h-3" />
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.senderName}
                        onChange={(e) => updateField("senderName", e.target.value)}
                        placeholder="e.g. Rajesh Kumar Sharma"
                        className={inputClass("senderName")}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                        <Phone className="w-3 h-3" />
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.senderPhone}
                        onChange={(e) => updateField("senderPhone", e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className={inputClass("senderPhone")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <Mail className="w-3 h-3" />
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.senderEmail}
                      onChange={(e) => updateField("senderEmail", e.target.value)}
                      placeholder="e.g. rajesh.sharma@email.com"
                      className={inputClass("senderEmail")}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <MapPin className="w-3 h-3" />
                      Full Address <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.senderAddress}
                      onChange={(e) => updateField("senderAddress", e.target.value)}
                      placeholder="e.g. Flat 302, Sunshine Apartments, MG Road, Pune, Maharashtra - 411001"
                      className={`${inputClass("senderAddress")} h-20 resize-none`}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <Briefcase className="w-3 h-3" />
                      Through Advocate (optional)
                    </label>
                    <input
                      type="text"
                      value={form.senderAdvocate}
                      onChange={(e) => updateField("senderAdvocate", e.target.value)}
                      placeholder="e.g. Adv. Priya Mehta, Bar Council No. MH/1234/2020"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════ STEP 2: Receiver & Agreement ═══════ */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <h2 className="text-sm font-medium flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    Opposite Party Details (Noticee / Receiver)
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                        <User className="w-3 h-3" />
                        Full Name / Entity <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.receiverName}
                        onChange={(e) => updateField("receiverName", e.target.value)}
                        placeholder="e.g. Amit Verma / XYZ Pvt Ltd"
                        className={inputClass("receiverName")}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                        <Briefcase className="w-3 h-3" />
                        Designation (optional)
                      </label>
                      <input
                        type="text"
                        value={form.receiverDesignation}
                        onChange={(e) => updateField("receiverDesignation", e.target.value)}
                        placeholder="e.g. Landlord / Managing Director / HR Manager"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <MapPin className="w-3 h-3" />
                      Full Address <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.receiverAddress}
                      onChange={(e) => updateField("receiverAddress", e.target.value)}
                      placeholder="e.g. 15, Industrial Area Phase 2, Noida, Uttar Pradesh - 201301"
                      className={`${inputClass("receiverAddress")} h-20 resize-none`}
                    />
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <h2 className="text-sm font-medium flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4" />
                    Agreement / Contract Details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                        <Calendar className="w-3 h-3" />
                        Date of Agreement <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.agreementDate}
                        onChange={(e) => updateField("agreementDate", e.target.value)}
                        className={inputClass("agreementDate")}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                        <FileText className="w-3 h-3" />
                        Document Category
                      </label>
                      <select
                        value={form.documentType}
                        onChange={(e) => updateField("documentType", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none cursor-pointer"
                      >
                        <option value="rental">Rental / Lease Agreement</option>
                        <option value="employment">Employment Contract</option>
                        <option value="freelance">Freelance / Service Contract</option>
                        <option value="loan">Loan Agreement</option>
                        <option value="partnership">Partnership Deed</option>
                        <option value="sale">Sale / Purchase Agreement</option>
                        <option value="nda">Non-Disclosure Agreement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <FileText className="w-3 h-3" />
                      Type of Agreement <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.agreementType}
                      onChange={(e) => updateField("agreementType", e.target.value)}
                      placeholder="e.g. Residential Rent Agreement dated 01/01/2024 for Flat 302"
                      className={inputClass("agreementType")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════ STEP 3: Breach & Relief ═══════ */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <h2 className="text-sm font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Breach / Violation Details
                  </h2>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <FileText className="w-3 h-3" />
                      Relevant Clause(s) Violated <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.clauseText}
                      onChange={(e) => updateField("clauseText", e.target.value)}
                      placeholder='Paste the exact clause text, e.g. "Clause 5: The Tenant shall pay monthly rent of Rs. 25,000 on or before the 5th of each month..."'
                      className={`${inputClass("clauseText")} h-28 resize-none`}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <Calendar className="w-3 h-3" />
                      Date of Incident / Breach <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.incidentDate}
                      onChange={(e) => updateField("incidentDate", e.target.value)}
                      className={inputClass("incidentDate")}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <ClipboardList className="w-3 h-3" />
                      Describe the Breach in Detail <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.incidentDescription}
                      onChange={(e) => updateField("incidentDescription", e.target.value)}
                      placeholder="e.g. The landlord has not returned the security deposit of Rs. 1,50,000 despite the agreement ending on 31/12/2024. Multiple verbal and written requests were made on 15/01/2025 and 01/02/2025 but no response was received..."
                      className={`${inputClass("incidentDescription")} h-36 resize-none`}
                    />
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-5 space-y-4">
                  <h2 className="text-sm font-medium flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Relief / Remedy Sought
                  </h2>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      What do you want the other party to do? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={form.reliefSought}
                      onChange={(e) => updateField("reliefSought", e.target.value)}
                      placeholder="e.g. 1) Refund security deposit of Rs. 1,50,000 with 18% interest. 2) Pay compensation of Rs. 50,000 for mental harassment. 3) Provide proper No Objection Certificate."
                      className={`${inputClass("reliefSought")} h-28 resize-none`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                )}
              </div>
              <div>
                {step < 3 ? (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={generating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {generating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Scale className="w-4 h-4" />
                    )}
                    {generating
                      ? "Generating Legal Notice..."
                      : "Generate Legal Notice"}
                  </button>
                )}
              </div>
            </div>

            {/* Progress hint */}
            {step === 3 && !generating && (
              <p className="text-xs text-gray-400 text-center">
                All fields marked with <span className="text-red-400">*</span> are mandatory. The AI will generate a professional legal notice ready for printing.
              </p>
            )}
          </form>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setResult(null);
                setError("");
                setStep(1);
              }}
              className="text-sm text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              ← Generate another notice
            </button>
            {result.notice_ref && (
              <span className="text-xs text-gray-400 font-mono">
                Ref: {result.notice_ref}
              </span>
            )}
          </div>

          {/* Letter */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Legal Notice
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-background transition-colors cursor-pointer bg-background"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-background transition-colors cursor-pointer bg-background"
                >
                  <Download className="w-3 h-3" />
                  .txt
                </button>
                <button
                  onClick={handleDownloadDocx}
                  disabled={downloadingDocx}
                  className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {downloadingDocx ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <FileDown className="w-3 h-3" />
                  )}
                  Download .docx
                </button>
              </div>
            </div>
            <div className="p-6 bg-background">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-serif leading-relaxed">
                {result.letter}
              </pre>
            </div>
          </div>

          {/* Laws cited */}
          {result.applicable_laws && result.applicable_laws.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                Laws & Sections Cited
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.applicable_laws.map((law, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600 border border-gray-200"
                  >
                    {law}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Next steps */}
          {result.next_steps && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4" />
                Next Steps After Sending
              </h3>
              <p className="text-sm text-blue-800 whitespace-pre-wrap leading-relaxed">
                {result.next_steps}
              </p>
            </div>
          )}

          {/* Download CTA at bottom */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Download your legal notice as a professional Word document
            </p>
            <button
              onClick={handleDownloadDocx}
              disabled={downloadingDocx}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {downloadingDocx ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              {downloadingDocx
                ? "Generating Document..."
                : "Download as .docx (Word)"}
            </button>
            <p className="text-xs text-gray-400">
              Print on advocate&apos;s letterhead, sign, and send via Registered
              Post A/D
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
