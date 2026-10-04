import React, { useState, useRef } from 'react';
import { Upload, X, AlertTriangle, CheckCircle2, FileText, Download, RefreshCw } from 'lucide-react';
import { validateAndParseCSV, exportDatasetToCSV } from '../lib/dataEngine';
import { useIntelligence } from '../context/IntelligenceContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loadCustomDataset, analyzedDataset, resetToDemoDataset, isCustomDataset } = useIntelligence();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const [parsedDataHolder, setParsedDataHolder] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (uploadedFile: File) => {
    setErrors([]);
    setWarnings([]);
    setParsedCount(null);
    setParsedDataHolder(null);

    if (!uploadedFile.name.endsWith('.csv')) {
      setErrors(['Please upload a valid .csv file format.']);
      return;
    }

    setFile(uploadedFile);
    setFileName(uploadedFile.name);

    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      if (!text) {
        setErrors(['File appears to be empty.']);
        return;
      }

      const result = validateAndParseCSV(text);
      if (!result.valid) {
        setErrors(result.errors);
        setWarnings(result.warnings);
      } else {
        setParsedCount(result.parsedData.length);
        setParsedDataHolder(result.parsedData);
        setWarnings(result.warnings);
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyse = () => {
    if (parsedDataHolder && parsedDataHolder.length > 0) {
      loadCustomDataset(parsedDataHolder, fileName || 'Uploaded Custom Dataset');
      onSuccess();
      onClose();
    }
  };

  const handleDownloadSampleCSV = () => {
    const sample = exportDatasetToCSV(analyzedDataset.slice(0, 20));
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ai_detective_sample_schema.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-serif">
              Upload Consumer Dataset
            </h3>
            <p className="text-xs text-zinc-400">
              Ingest raw consumer feedback records for purchase friction intelligence.
            </p>
          </div>
        </div>

        {/* Schema Requirement Card */}
        <div className="my-4 p-3 rounded-lg bg-zinc-950/70 border border-zinc-800 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-zinc-300">Expected CSV Columns (Header):</span>
            <button
              onClick={handleDownloadSampleCSV}
              className="flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Download Sample CSV</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {['id', 'source', 'date', 'rating', 'title', 'text', 'productCategory (optional)'].map(
              col => (
                <span
                  key={col}
                  className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                >
                  {col}
                </span>
              )
            )}
          </div>
        </div>

        {/* Drag and drop zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-pink-500 bg-pink-500/10'
              : 'border-zinc-700 bg-zinc-950/40 hover:border-zinc-500 hover:bg-zinc-950/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={e => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />

          <FileText className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-200">
            {file ? file.name : 'Click to select CSV or drag and drop file here'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Supports UTF-8 CSV datasets up to 10MB
          </p>
        </div>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <div className="mt-4 p-3.5 rounded-lg bg-rose-950/30 border border-rose-800/50 text-xs">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Validation Errors Detected</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-rose-200/90">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Validation Success */}
        {parsedCount !== null && errors.length === 0 && (
          <div className="mt-4 p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Schema Validated Successfully</span>
            </div>
            <p className="text-emerald-200">
              Found <strong>{parsedCount.toLocaleString()}</strong> valid conversation records ready for friction intelligence classification.
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          {isCustomDataset ? (
            <button
              onClick={() => {
                resetToDemoDataset();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Standard Demo Dataset</span>
            </button>
          ) : (
            <span className="text-xs text-zinc-500">Currently in standard demo mode</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAnalyse}
              disabled={!parsedDataHolder || errors.length > 0}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-900/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>ANALYSE DATASET</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
