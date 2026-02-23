"use client";

interface LanguageToggleProps {
  language: string;
  onChange: (lang: string) => void;
}

export default function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5">
      <button
        onClick={() => onChange("en")}
        className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
          language === "en"
            ? "bg-white text-black font-medium shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onChange("hi")}
        className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
          language === "hi"
            ? "bg-white text-black font-medium shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        हिं
      </button>
    </div>
  );
}
