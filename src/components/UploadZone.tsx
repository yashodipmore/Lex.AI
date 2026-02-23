"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, FileText, Type, X } from "lucide-react";

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  onTextSubmit: (text: string) => void;
  loading?: boolean;
}

export default function UploadZone({ onFileUpload, onTextSubmit, loading }: UploadZoneProps) {
  const [tab, setTab] = useState<"upload" | "paste">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setSelectedFile(file);
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  const handleTextSubmit = () => {
    if (pasteText.trim().length > 50) {
      onTextSubmit(pasteText.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab("upload")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 transition-colors cursor-pointer ${
            tab === "upload"
              ? "border-black text-black font-medium"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload File
        </button>
        <button
          onClick={() => setTab("paste")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 transition-colors cursor-pointer ${
            tab === "paste"
              ? "border-black text-black font-medium"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Paste Text
        </button>
      </div>

      {tab === "upload" ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-black bg-gray-50"
              : selectedFile
              ? "border-gray-300 bg-gray-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          } ${loading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
            onChange={handleFileSelect}
          />
          {selectedFile ? (
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {!loading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-black cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-8 h-8 text-gray-300" />
              <div>
                <p className="text-sm text-gray-500">
                  Drop your document here or <span className="text-black font-medium">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, Images, or Text files</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your contract or agreement text here..."
            className="w-full h-48 px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-gray-400 transition-colors"
            disabled={loading}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {pasteText.length > 0 ? `${pasteText.length} characters` : "Minimum 50 characters"}
            </span>
            <button
              onClick={handleTextSubmit}
              disabled={pasteText.trim().length < 50 || loading}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Analyze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
