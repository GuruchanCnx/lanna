import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Check, RefreshCw, Sparkles } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface ImageUploaderProps {
  lang: Language;
  currentValue: string;
  onChange: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ lang, currentValue, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  // Beautiful curated presets for easy admin selection
  const presets = [
    { name: "Chiang Mai Bag", url: "/images/chiangmai-bag.png" },
    { name: "Patongko & Soy", url: "/images/patongko-soy.png" },
    { name: "Tao Tung Dessert", url: "/images/tao-tung.png" },
    { name: "Soy Milk Hot", url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400" },
    { name: "Fresh Milk", url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400" },
    { name: "Ginger Water", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400" },
    { name: "Pandan Custard", url: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400" },
    { name: "Steamed Bread", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(20);

    const reader = new FileReader();
    reader.onload = (event) => {
      setProgress(50);
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setProgress(80);
        const maxDim = 600;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.75);
          onChange(compressed);
        } else {
          onChange(rawDataUrl);
        }
        setProgress(100);
        setUploading(false);
      };
      img.onerror = () => {
        onChange(rawDataUrl);
        setProgress(100);
        setUploading(false);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {t.productImage}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upload Box */}
        <div className="md:col-span-1">
          <div
            onClick={triggerFileInput}
            className={`relative h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 ${
              currentValue
                ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-rose-500 dark:hover:border-rose-500'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {uploading ? (
              <div className="text-center space-y-2">
                <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
                <div className="text-xs font-bold text-rose-500">{progress}% {lang === 'th' ? "กำลังอัปโหลด..." : "Uploading..."}</div>
                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mx-auto">
                  <div className="h-full bg-rose-500 transition-all duration-150" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : currentValue ? (
              <div className="relative w-full h-full group rounded-xl overflow-hidden">
                <img src={currentValue} alt="Uploaded" className="w-full h-full object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 rounded-full inline-block">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300">{t.uploadImage}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">PNG, JPG up to 5MB</div>
              </div>
            )}
          </div>
        </div>

        {/* Preset Selection (Super Easy for Seniors/Non-tech) */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t.imagePresetLabel}</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
            {t.imagePresetDesc}
          </p>
          <div className="grid grid-cols-4 gap-2 max-h-28 overflow-y-auto pr-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                  currentValue === preset.url
                    ? 'border-rose-500 scale-100 shadow-md ring-2 ring-rose-500/20'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white font-bold py-0.5 text-center truncate px-1">
                  {preset.name}
                </div>
                {currentValue === preset.url && (
                  <div className="absolute top-1 right-1 bg-rose-500 text-white p-0.5 rounded-full shadow-sm">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
