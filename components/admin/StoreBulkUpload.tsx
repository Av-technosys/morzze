"use client";

import { useRef, useState } from "react";
import { Upload, Download, Loader2, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { bulkCreateStores } from "@/helper/stores/action";

// ── Sample CSV content aligned with StoreForm fields ──────────────────────────
const SAMPLE_CSV = `storeName,state,city,latitude,longitude,address,contactNumber,email,mapEmbedUrl,landline,contactPerson
Morzze Flagship Jaipur,Rajasthan,Jaipur,26.9124,75.7873,"Shop No. 5, MI Road, Jaipur",+91 9876543210,jaipur@morzze.com,https://www.google.com/maps/embed?pb=!1m18,0141-1234567,Rahul Sharma
Morzze Store Delhi,Delhi,New Delhi,28.6139,77.2090,"Connaught Place, New Delhi",+91 9123456780,delhi@morzze.com,,,
`;

function downloadSampleCSV() {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "stores_sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}

type UploadResult = {
  total: number;
  success: number;
  failed: number;
  errors: string[];
};

export function StoreBulkUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setResult(null);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.endsWith(".csv")) {
      setFile(f);
      setResult(null);
    } else {
      toast.error("Please drop a valid .csv file");
    }
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const text = await file.text();
      const res = await bulkCreateStores(text);

      if (res.success) {
        setResult(res.result!);
        toast.success(
          `Bulk upload complete: ${res.result!.success} of ${res.result!.total} stores added`
        );
      } else {
        toast.error(res.message ?? "Bulk upload failed");
      }
    } catch {
      toast.error("An unexpected error occurred during upload");
    } finally {
      setLoading(false);
    }
  }

  function resetDialog() {
    setFile(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function closeDialog() {
    resetDialog();
    setOpen(false);
  }

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="outline"
        
        onClick={() => setOpen(true)}
      >
        <Upload className="w-4 h-4 mr-2" />
        Bulk Upload
      </Button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#2D5A5D]" />
                <h2 className="text-lg font-semibold text-[#2D5A5D]">
                  Bulk Upload Stores
                </h2>
              </div>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Sample CSV download */}
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Need a template?
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Download the sample CSV to see the correct format.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-400 text-amber-700 hover:bg-amber-100 shrink-0"
                  onClick={downloadSampleCSV}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Sample CSV
                </Button>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file
                    ? "border-[#2D5A5D] bg-[#2D5A5D]/5"
                    : "border-gray-300 hover:border-[#2D5A5D] hover:bg-gray-50"
                  }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-[#2D5A5D]" />
                    <p className="font-medium text-[#2D5A5D]">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB — click to change
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Upload className="w-8 h-8" />
                    <p className="text-sm font-medium">
                      Drag & drop your CSV here, or{" "}
                      <span className="text-[#2D5A5D] underline">browse</span>
                    </p>
                    <p className="text-xs">Only .csv files are accepted</p>
                  </div>
                )}
              </div>

              {/* Result summary */}
              {result && (
                <div
                  className={`rounded-lg border p-4 space-y-2 text-sm ${result.failed === 0
                      ? "border-green-200 bg-green-50"
                      : "border-amber-200 bg-amber-50"
                    }`}
                >
                  <p className="font-semibold text-gray-700">Upload Summary</p>
                  <div className="flex gap-4">
                    <span className="text-gray-500">
                      Total: <strong>{result.total}</strong>
                    </span>
                    <span className="text-green-700">
                      Added: <strong>{result.success}</strong>
                    </span>
                    {result.failed > 0 && (
                      <span className="text-red-600">
                        Failed: <strong>{result.failed}</strong>
                      </span>
                    )}
                  </div>
                  {result.errors.length > 0 && (
                    <ul className="mt-2 space-y-1 max-h-28 overflow-y-auto">
                      {result.errors.map((err, i) => (
                        <li key={i} className="text-xs text-red-600">
                          • {err}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeDialog}>
                  {result ? "Close" : "Cancel"}
                </Button>
                {!result && (
                  <Button
                    
                    disabled={!file || loading}
                    onClick={handleUpload}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Stores
                      </>
                    )}
                  </Button>
                )}
                {result && (
                  <Button
                    variant="outline"
                    
                    onClick={resetDialog}
                  >
                    Upload Another
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
