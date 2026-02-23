/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed script for benchmark clauses
 * Run: node scripts/seed-benchmarks.js
 * Requires MONGODB_URI in .env.local
 */

const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Load env
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, ...vals] = line.split("=");
    if (key && !key.startsWith("#")) {
      process.env[key.trim()] = vals.join("=").trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

const BenchmarkClauseSchema = new mongoose.Schema({
  clauseType: String,
  docType: String,
  industry: String,
  value: String,
  marketPercentile: Number,
  standardValue: String,
  isFavorableToUser: Boolean,
  note: String,
});

const BenchmarkClause =
  mongoose.models.BenchmarkClause || mongoose.model("BenchmarkClause", BenchmarkClauseSchema);

const benchmarks = [
  // ========== RENTAL ==========
  // Security Deposit
  { clauseType: "security_deposit", docType: "rental", industry: "general", value: "1 month rent", marketPercentile: 15, standardValue: "2-3 months", isFavorableToUser: true, note: "Very favorable — most landlords ask 2-3 months" },
  { clauseType: "security_deposit", docType: "rental", industry: "general", value: "2 months rent", marketPercentile: 45, standardValue: "2-3 months", isFavorableToUser: true, note: "Standard in most Indian cities" },
  { clauseType: "security_deposit", docType: "rental", industry: "general", value: "3 months rent", marketPercentile: 75, standardValue: "2-3 months", isFavorableToUser: false, note: "Common in Mumbai/Delhi — upper range of market" },
  { clauseType: "security_deposit", docType: "rental", industry: "general", value: "6 months rent", marketPercentile: 95, standardValue: "2-3 months", isFavorableToUser: false, note: "Excessive — negotiate down to 2-3 months" },
  { clauseType: "security_deposit", docType: "rental", industry: "general", value: "10 months rent", marketPercentile: 99, standardValue: "2-3 months", isFavorableToUser: false, note: "Common in Bangalore — well above national average" },

  // Notice Period (Rental)
  { clauseType: "notice_period", docType: "rental", industry: "general", value: "15 days", marketPercentile: 10, standardValue: "30 days", isFavorableToUser: true, note: "Very short — favorable for tenant flexibility" },
  { clauseType: "notice_period", docType: "rental", industry: "general", value: "30 days", marketPercentile: 55, standardValue: "30 days", isFavorableToUser: true, note: "Industry standard for Indian rentals" },
  { clauseType: "notice_period", docType: "rental", industry: "general", value: "60 days", marketPercentile: 80, standardValue: "30 days", isFavorableToUser: false, note: "Above standard — negotiate to 30 days" },
  { clauseType: "notice_period", docType: "rental", industry: "general", value: "90 days", marketPercentile: 95, standardValue: "30 days", isFavorableToUser: false, note: "Excessive for residential rental" },

  // Lock-in Period (Rental)
  { clauseType: "lock_in_period", docType: "rental", industry: "general", value: "No lock-in", marketPercentile: 5, standardValue: "3-6 months", isFavorableToUser: true, note: "Best case — full flexibility" },
  { clauseType: "lock_in_period", docType: "rental", industry: "general", value: "3 months", marketPercentile: 30, standardValue: "3-6 months", isFavorableToUser: true, note: "Reasonable lock-in period" },
  { clauseType: "lock_in_period", docType: "rental", industry: "general", value: "6 months", marketPercentile: 60, standardValue: "3-6 months", isFavorableToUser: false, note: "Standard in most agreements — upper range" },
  { clauseType: "lock_in_period", docType: "rental", industry: "general", value: "11 months", marketPercentile: 90, standardValue: "3-6 months", isFavorableToUser: false, note: "Full agreement term — very restrictive" },

  // Rent Escalation
  { clauseType: "rent_escalation", docType: "rental", industry: "general", value: "5% per year", marketPercentile: 30, standardValue: "5-10% per year", isFavorableToUser: true, note: "Below average increase — favorable" },
  { clauseType: "rent_escalation", docType: "rental", industry: "general", value: "8% per year", marketPercentile: 50, standardValue: "5-10% per year", isFavorableToUser: false, note: "Market median in metro cities" },
  { clauseType: "rent_escalation", docType: "rental", industry: "general", value: "10% per year", marketPercentile: 75, standardValue: "5-10% per year", isFavorableToUser: false, note: "High end — may violate Rent Control in some states" },
  { clauseType: "rent_escalation", docType: "rental", industry: "general", value: "15% per year", marketPercentile: 95, standardValue: "5-10% per year", isFavorableToUser: false, note: "Excessive — likely illegal under most state Rent Control Acts" },

  // Maintenance charges
  { clauseType: "maintenance", docType: "rental", industry: "general", value: "Included in rent", marketPercentile: 20, standardValue: "Separate from rent", isFavorableToUser: true, note: "Best for tenant — no hidden costs" },
  { clauseType: "maintenance", docType: "rental", industry: "general", value: "Fixed amount separate", marketPercentile: 50, standardValue: "Separate from rent", isFavorableToUser: true, note: "Standard — predictable costs" },
  { clauseType: "maintenance", docType: "rental", industry: "general", value: "Actual cost borne by tenant", marketPercentile: 80, standardValue: "Separate from rent", isFavorableToUser: false, note: "Risky — no cap on what landlord can claim" },

  // ========== EMPLOYMENT ==========
  // Notice Period (Employment)
  { clauseType: "notice_period", docType: "employment", industry: "IT", value: "15 days", marketPercentile: 10, standardValue: "30-60 days", isFavorableToUser: true, note: "Rare in IT — usually for probation period" },
  { clauseType: "notice_period", docType: "employment", industry: "IT", value: "30 days", marketPercentile: 35, standardValue: "30-60 days", isFavorableToUser: true, note: "Standard in startups and mid-size IT" },
  { clauseType: "notice_period", docType: "employment", industry: "IT", value: "60 days", marketPercentile: 65, standardValue: "30-60 days", isFavorableToUser: false, note: "Common in established IT companies" },
  { clauseType: "notice_period", docType: "employment", industry: "IT", value: "90 days", marketPercentile: 85, standardValue: "30-60 days", isFavorableToUser: false, note: "Common in MNCs and FAANG — negotiate if possible" },
  { clauseType: "notice_period", docType: "employment", industry: "IT", value: "180 days", marketPercentile: 99, standardValue: "30-60 days", isFavorableToUser: false, note: "Extremely unusual — likely unenforceable for most roles" },

  // Non-Compete
  { clauseType: "non_compete", docType: "employment", industry: "IT", value: "No non-compete", marketPercentile: 30, standardValue: "6-12 months", isFavorableToUser: true, note: "Best case — note that non-competes are largely unenforceable in India under §27" },
  { clauseType: "non_compete", docType: "employment", industry: "IT", value: "6 months", marketPercentile: 50, standardValue: "6-12 months", isFavorableToUser: false, note: "Standard but likely unenforceable under Indian Contract Act §27" },
  { clauseType: "non_compete", docType: "employment", industry: "IT", value: "12 months", marketPercentile: 75, standardValue: "6-12 months", isFavorableToUser: false, note: "Common in senior roles — note this is void under Indian law §27" },
  { clauseType: "non_compete", docType: "employment", industry: "IT", value: "24 months", marketPercentile: 95, standardValue: "6-12 months", isFavorableToUser: false, note: "Excessive and unenforceable under Indian Contract Act §27" },

  // Probation Period
  { clauseType: "probation_period", docType: "employment", industry: "IT", value: "No probation", marketPercentile: 5, standardValue: "3-6 months", isFavorableToUser: true, note: "Rare but very favorable — immediate full benefits" },
  { clauseType: "probation_period", docType: "employment", industry: "IT", value: "3 months", marketPercentile: 40, standardValue: "3-6 months", isFavorableToUser: true, note: "Standard in most Indian IT companies" },
  { clauseType: "probation_period", docType: "employment", industry: "IT", value: "6 months", marketPercentile: 70, standardValue: "3-6 months", isFavorableToUser: false, note: "Common in large corporations" },
  { clauseType: "probation_period", docType: "employment", industry: "IT", value: "12 months", marketPercentile: 95, standardValue: "3-6 months", isFavorableToUser: false, note: "Excessive — rare even in MNCs" },

  // IP Assignment
  { clauseType: "ip_assignment", docType: "employment", industry: "IT", value: "Work-related IP only", marketPercentile: 40, standardValue: "All work-related IP", isFavorableToUser: true, note: "Standard and fair — covers only what you create for the company" },
  { clauseType: "ip_assignment", docType: "employment", industry: "IT", value: "All IP during employment", marketPercentile: 70, standardValue: "All work-related IP", isFavorableToUser: false, note: "Broad — includes personal projects. Negotiate to exclude personal work" },
  { clauseType: "ip_assignment", docType: "employment", industry: "IT", value: "All IP including post-employment", marketPercentile: 95, standardValue: "All work-related IP", isFavorableToUser: false, note: "Very restrictive — may be challengeable under Indian law" },

  // ========== FREELANCE ==========
  // Payment Terms
  { clauseType: "payment_terms", docType: "freelance", industry: "general", value: "Advance payment", marketPercentile: 10, standardValue: "50% advance, 50% on delivery", isFavorableToUser: true, note: "Best case — full payment upfront" },
  { clauseType: "payment_terms", docType: "freelance", industry: "general", value: "50% advance, 50% on delivery", marketPercentile: 40, standardValue: "50% advance, 50% on delivery", isFavorableToUser: true, note: "Industry standard for freelancers in India" },
  { clauseType: "payment_terms", docType: "freelance", industry: "general", value: "On delivery / completion", marketPercentile: 60, standardValue: "50% advance, 50% on delivery", isFavorableToUser: false, note: "Risk of non-payment — insist on milestone payments" },
  { clauseType: "payment_terms", docType: "freelance", industry: "general", value: "Net 30 after delivery", marketPercentile: 75, standardValue: "50% advance, 50% on delivery", isFavorableToUser: false, note: "30-day wait after completion — standard in corporate contracts" },
  { clauseType: "payment_terms", docType: "freelance", industry: "general", value: "Net 60 after delivery", marketPercentile: 90, standardValue: "50% advance, 50% on delivery", isFavorableToUser: false, note: "Very long wait — common in enterprise but risky for freelancers" },

  // IP Transfer (Freelance)
  { clauseType: "ip_transfer", docType: "freelance", industry: "general", value: "License to use, creator retains IP", marketPercentile: 20, standardValue: "Full IP transfer on payment", isFavorableToUser: true, note: "Best for freelancer — keep portfolio rights" },
  { clauseType: "ip_transfer", docType: "freelance", industry: "general", value: "Full IP transfer on payment", marketPercentile: 55, standardValue: "Full IP transfer on payment", isFavorableToUser: false, note: "Standard — ensure payment is received first" },
  { clauseType: "ip_transfer", docType: "freelance", industry: "general", value: "IP transfers on signing", marketPercentile: 85, standardValue: "Full IP transfer on payment", isFavorableToUser: false, note: "Dangerous — client owns your work before paying. Negotiate payment-based transfer" },

  // Revision limits
  { clauseType: "revisions", docType: "freelance", industry: "general", value: "Unlimited revisions", marketPercentile: 90, standardValue: "2-3 revisions", isFavorableToUser: false, note: "Scope creep risk — always cap revisions" },
  { clauseType: "revisions", docType: "freelance", industry: "general", value: "3 revisions included", marketPercentile: 50, standardValue: "2-3 revisions", isFavorableToUser: true, note: "Industry standard" },
  { clauseType: "revisions", docType: "freelance", industry: "general", value: "2 revisions included", marketPercentile: 35, standardValue: "2-3 revisions", isFavorableToUser: true, note: "Slightly favorable for freelancer" },
  { clauseType: "revisions", docType: "freelance", industry: "general", value: "No free revisions", marketPercentile: 10, standardValue: "2-3 revisions", isFavorableToUser: true, note: "Rare but best for freelancer" },

  // ========== NDA ==========
  // Duration
  { clauseType: "nda_duration", docType: "nda", industry: "general", value: "1 year", marketPercentile: 25, standardValue: "2-3 years", isFavorableToUser: true, note: "Short NDA — favorable for the disclosing employee/partner" },
  { clauseType: "nda_duration", docType: "nda", industry: "general", value: "2 years", marketPercentile: 45, standardValue: "2-3 years", isFavorableToUser: true, note: "Standard NDA duration in India" },
  { clauseType: "nda_duration", docType: "nda", industry: "general", value: "3 years", marketPercentile: 65, standardValue: "2-3 years", isFavorableToUser: false, note: "Common in strategic partnerships" },
  { clauseType: "nda_duration", docType: "nda", industry: "general", value: "5 years", marketPercentile: 85, standardValue: "2-3 years", isFavorableToUser: false, note: "Long — only justified for trade secrets" },
  { clauseType: "nda_duration", docType: "nda", industry: "general", value: "Perpetual / indefinite", marketPercentile: 95, standardValue: "2-3 years", isFavorableToUser: false, note: "Excessive — negotiate a defined term" },

  // Scope
  { clauseType: "nda_scope", docType: "nda", industry: "general", value: "Specific information only", marketPercentile: 25, standardValue: "All confidential information", isFavorableToUser: true, note: "Narrowly defined — clear and fair" },
  { clauseType: "nda_scope", docType: "nda", industry: "general", value: "All marked confidential", marketPercentile: 50, standardValue: "All confidential information", isFavorableToUser: true, note: "Standard — clear marking requirement" },
  { clauseType: "nda_scope", docType: "nda", industry: "general", value: "All information shared", marketPercentile: 80, standardValue: "All confidential information", isFavorableToUser: false, note: "Very broad — even casual conversations become confidential" },

  // ========== LOAN ==========
  // Prepayment penalty
  { clauseType: "prepayment_penalty", docType: "loan", industry: "general", value: "No penalty", marketPercentile: 15, standardValue: "2-4% of outstanding", isFavorableToUser: true, note: "Best case — RBI has pushed banks toward zero prepayment penalty on floating rate loans" },
  { clauseType: "prepayment_penalty", docType: "loan", industry: "general", value: "2% of outstanding", marketPercentile: 40, standardValue: "2-4% of outstanding", isFavorableToUser: true, note: "Standard for fixed rate loans" },
  { clauseType: "prepayment_penalty", docType: "loan", industry: "general", value: "4% of outstanding", marketPercentile: 75, standardValue: "2-4% of outstanding", isFavorableToUser: false, note: "High — negotiate down, especially for floating rate" },
  { clauseType: "prepayment_penalty", docType: "loan", industry: "general", value: "5%+ of outstanding", marketPercentile: 95, standardValue: "2-4% of outstanding", isFavorableToUser: false, note: "Excessive — check RBI guidelines, may be non-compliant" },

  // Late payment
  { clauseType: "late_payment_penalty", docType: "loan", industry: "general", value: "1% per month", marketPercentile: 30, standardValue: "2% per month", isFavorableToUser: true, note: "Below average late fee" },
  { clauseType: "late_payment_penalty", docType: "loan", industry: "general", value: "2% per month", marketPercentile: 55, standardValue: "2% per month", isFavorableToUser: false, note: "Market standard" },
  { clauseType: "late_payment_penalty", docType: "loan", industry: "general", value: "3%+ per month", marketPercentile: 85, standardValue: "2% per month", isFavorableToUser: false, note: "High — may be considered penal under RBI fair practices code" },

  // ========== TERMS OF SERVICE ==========
  // Liability
  { clauseType: "liability_cap", docType: "tos", industry: "general", value: "Full liability", marketPercentile: 10, standardValue: "Liability capped at fees paid", isFavorableToUser: true, note: "Rare — company takes full responsibility" },
  { clauseType: "liability_cap", docType: "tos", industry: "general", value: "Capped at fees paid", marketPercentile: 40, standardValue: "Liability capped at fees paid", isFavorableToUser: true, note: "Standard and fair" },
  { clauseType: "liability_cap", docType: "tos", industry: "general", value: "Limited to direct damages", marketPercentile: 60, standardValue: "Liability capped at fees paid", isFavorableToUser: false, note: "Excludes consequential damages — standard but limiting" },
  { clauseType: "liability_cap", docType: "tos", industry: "general", value: "No liability", marketPercentile: 85, standardValue: "Liability capped at fees paid", isFavorableToUser: false, note: "May violate Consumer Protection Act 2019 for paid services" },

  // Arbitration
  { clauseType: "arbitration_clause", docType: "tos", industry: "general", value: "Consumer court allowed", marketPercentile: 20, standardValue: "Arbitration with company-chosen arbitrator", isFavorableToUser: true, note: "Best — preserves consumer rights" },
  { clauseType: "arbitration_clause", docType: "tos", industry: "general", value: "Mutual arbitration", marketPercentile: 45, standardValue: "Arbitration with company-chosen arbitrator", isFavorableToUser: true, note: "Fair — both parties agree on arbitrator" },
  { clauseType: "arbitration_clause", docType: "tos", industry: "general", value: "Company-chosen arbitrator", marketPercentile: 70, standardValue: "Arbitration with company-chosen arbitrator", isFavorableToUser: false, note: "Biased — company picks the arbitrator" },
  { clauseType: "arbitration_clause", docType: "tos", industry: "general", value: "Waiver of class action", marketPercentile: 90, standardValue: "Arbitration with company-chosen arbitrator", isFavorableToUser: false, note: "May be challengeable under Consumer Protection Act 2019" },

  // Data usage
  { clauseType: "data_usage", docType: "tos", industry: "general", value: "Essential use only", marketPercentile: 10, standardValue: "Service improvement + marketing", isFavorableToUser: true, note: "Privacy-respecting — rare" },
  { clauseType: "data_usage", docType: "tos", industry: "general", value: "Service improvement", marketPercentile: 35, standardValue: "Service improvement + marketing", isFavorableToUser: true, note: "Reasonable use of data" },
  { clauseType: "data_usage", docType: "tos", industry: "general", value: "Marketing + third party sharing", marketPercentile: 70, standardValue: "Service improvement + marketing", isFavorableToUser: false, note: "Common but invasive — check IT Act compliance" },
  { clauseType: "data_usage", docType: "tos", industry: "general", value: "Unrestricted use", marketPercentile: 95, standardValue: "Service improvement + marketing", isFavorableToUser: false, note: "Likely violates IT Act 2000 §43A and upcoming DPDP Act" },

  // Additional general benchmarks
  { clauseType: "termination_for_convenience", docType: "employment", industry: "general", value: "Either party with notice", marketPercentile: 50, standardValue: "Either party with notice", isFavorableToUser: true, note: "Standard and balanced" },
  { clauseType: "termination_for_convenience", docType: "employment", industry: "general", value: "Employer only without notice", marketPercentile: 90, standardValue: "Either party with notice", isFavorableToUser: false, note: "One-sided — may violate Industrial Disputes Act" },

  { clauseType: "gardening_leave", docType: "employment", industry: "IT", value: "No gardening leave", marketPercentile: 60, standardValue: "No gardening leave", isFavorableToUser: true, note: "Standard in most Indian IT companies" },
  { clauseType: "gardening_leave", docType: "employment", industry: "IT", value: "Full notice period gardening leave", marketPercentile: 30, standardValue: "No gardening leave", isFavorableToUser: true, note: "Favorable — paid leave during notice. Common in senior roles" },

  { clauseType: "confidentiality", docType: "freelance", industry: "general", value: "Project-specific only", marketPercentile: 30, standardValue: "All shared information", isFavorableToUser: true, note: "Narrow and clear" },
  { clauseType: "confidentiality", docType: "freelance", industry: "general", value: "All shared information for 2 years", marketPercentile: 55, standardValue: "All shared information", isFavorableToUser: false, note: "Standard in Indian freelance contracts" },
  { clauseType: "confidentiality", docType: "freelance", industry: "general", value: "Perpetual confidentiality", marketPercentile: 85, standardValue: "All shared information", isFavorableToUser: false, note: "Very restrictive — negotiate a time limit" },

  // Indemnity
  { clauseType: "indemnity", docType: "rental", industry: "general", value: "Mutual indemnity", marketPercentile: 30, standardValue: "Tenant indemnifies landlord", isFavorableToUser: true, note: "Fair — both parties protect each other" },
  { clauseType: "indemnity", docType: "rental", industry: "general", value: "Tenant indemnifies for negligence", marketPercentile: 50, standardValue: "Tenant indemnifies landlord", isFavorableToUser: true, note: "Standard — limited to tenant's fault" },
  { clauseType: "indemnity", docType: "rental", industry: "general", value: "Unlimited tenant indemnity", marketPercentile: 85, standardValue: "Tenant indemnifies landlord", isFavorableToUser: false, note: "One-sided — violates §23 of Contract Act if too broad" },

  // Force Majeure
  { clauseType: "force_majeure", docType: "employment", industry: "general", value: "Both parties excused", marketPercentile: 40, standardValue: "Both parties excused", isFavorableToUser: true, note: "Standard force majeure clause" },
  { clauseType: "force_majeure", docType: "employment", industry: "general", value: "Only employer excused", marketPercentile: 75, standardValue: "Both parties excused", isFavorableToUser: false, note: "One-sided — employee should also be covered" },
  { clauseType: "force_majeure", docType: "employment", industry: "general", value: "No force majeure clause", marketPercentile: 50, standardValue: "Both parties excused", isFavorableToUser: false, note: "Indian Contract Act §56 (frustration) would apply by default" },

  // Deposit refund timeline
  { clauseType: "deposit_refund", docType: "rental", industry: "general", value: "Within 15 days of vacating", marketPercentile: 20, standardValue: "30-60 days", isFavorableToUser: true, note: "Very favorable — quick return" },
  { clauseType: "deposit_refund", docType: "rental", industry: "general", value: "Within 30 days of vacating", marketPercentile: 45, standardValue: "30-60 days", isFavorableToUser: true, note: "Reasonable timeline" },
  { clauseType: "deposit_refund", docType: "rental", industry: "general", value: "Within 60 days of vacating", marketPercentile: 70, standardValue: "30-60 days", isFavorableToUser: false, note: "Long wait — negotiate to 30 days" },
  { clauseType: "deposit_refund", docType: "rental", industry: "general", value: "No specified timeline", marketPercentile: 90, standardValue: "30-60 days", isFavorableToUser: false, note: "Red flag — always insist on specified refund timeline" },

  // Auto-renewal
  { clauseType: "auto_renewal", docType: "rental", industry: "general", value: "No auto-renewal", marketPercentile: 30, standardValue: "Auto-renewal with 30-day notice", isFavorableToUser: true, note: "Clear end date — tenant must actively renew" },
  { clauseType: "auto_renewal", docType: "rental", industry: "general", value: "Auto-renews with 30-day opt-out", marketPercentile: 50, standardValue: "Auto-renewal with 30-day notice", isFavorableToUser: true, note: "Standard — set calendar reminder for opt-out date" },
  { clauseType: "auto_renewal", docType: "rental", industry: "general", value: "Auto-renews with 90-day opt-out", marketPercentile: 80, standardValue: "Auto-renewal with 30-day notice", isFavorableToUser: false, note: "Long notice period — easy to miss and get locked in" },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await BenchmarkClause.deleteMany({});
    console.log("Cleared existing benchmarks");

    await BenchmarkClause.insertMany(benchmarks);
    console.log(`Seeded ${benchmarks.length} benchmark clauses`);

    await mongoose.disconnect();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
