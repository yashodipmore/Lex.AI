import Groq from "groq-sdk";

let groqInstance: Groq | null = null;

function getGroq(): Groq {
  if (!groqInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Please define GROQ_API_KEY in .env.local");
    groqInstance = new Groq({ apiKey });
  }
  return groqInstance;
}

const groq = new Proxy({} as Groq, {
  get(_, prop) {
    return (getGroq() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default groq;
