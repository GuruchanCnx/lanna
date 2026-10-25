import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Check, RefreshCw, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface HeroImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onSave: (newUrl: string) => void;
  lang: Language;
}

const PRESET_HERO_IMAGES = [
  {
    id: 'default',
    titleTh: 'ถุงเก็บความเย็นลายล้านนา',
    titleEn: 'Lanna Traditional Bag',
    url: '/images/chiangmai-bag.png',
  },
  {
    id: 'patongko',
    titleTh: 'น้ำเต้าหู้ & ปาท่องโก๋ร้อนๆ',
    titleEn: 'Hot Soy Milk & Patongko',
    url: '/images/patongko-soy.png',
  },
  {
    id: 'dessert',
    titleTh: 'เต้าทึง & บัวลอยน้ำขิง',
    titleEn: 'Traditional Tao Tung Dessert',
    url: '/images/tao-tung.png',
  },
  {
    id: 'chiangmai',
    titleTh: 'เสน่ห์ถนนคนเดินวัวลาย เชียงใหม่',
    titleEn: 'Wua Lai Walking Street, Chiang Mai',
    url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'craft',
    titleTh: 'ผ้าทอหัตถกรรมพื้นบ้านล้านนา',
    titleEn: 'Handcrafted Northern Textiles',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
  },
];

export const HeroImageModal: React.FC<HeroImageModalProps> = ({
  isOpen,
  onClose,
  currentImage,
  onSave,
  lang,
}) => {
  const t = translations[lang];
  const [selectedUrl, setSelectedUrl] = useState<string>(currentImage);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file upload with canvas compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();

      img.onload = () => {
        // Resize for crisp banner without overloading storage (max 1000px, 0.75 quality)
        const maxDim = 1000;
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
          setSelectedUrl(compressed);
        } else {
          setSelectedUrl(rawDataUrl);
        }
        setIsUploading(false);
      };

      img.onerror = () => {
        setSelectedUrl(rawDataUrl);
        setIsUploading(false);
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      setSelectedUrl(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleResetToDefault = () => {
    setSelectedUrl('/images/chiangmai-bag.png');
  };

  const handleSave = () => {
    onSave(selectedUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                {t.heroImageModalTitle}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {lang === 'th' ? 'อัปโหลดหรือเลือกรูปภาพภาพหน้าปกที่ต้องการ' : 'Upload or pick a curated hero cover'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Live Preview */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {lang === 'th' ? 'ตัวอย่างภาพหน้าปกปัจจุบัน' : 'Current Preview'}
            </label>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border-2 border-rose-500/30 shadow-inner group">
              <img 
                src={selectedUrl} 
                alt="Hero Preview" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-bold drop-shadow-md">
                  {lang === 'th' ? 'หายยา น้ำเต้าหู้ & ถุงเก็บความเย็นล้านนา' : 'Haiya Soy Milk & Lanna Cooler Bags'}
                </span>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {lang === 'th' ? 'อัปโหลดภาพจากอุปกรณ์ของคุณ' : 'Upload Image from Device'}
            </label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:border-rose-500 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'th' ? 'กำลังประมวลผลรูปภาพ...' : 'Processing image...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>{lang === 'th' ? 'คลิกเพื่อเลือกไฟล์รูปภาพ (JPG, PNG, WebP)' : 'Click to select image file'}</span>
                </>
              )}
            </button>
          </div>

          {/* Curated Presets */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {lang === 'th' ? 'หรือเลือกภาพแนะนำเมืองเชียงใหม่' : 'Or select Chiang Mai Presets'}
              </label>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetToDefault}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_HERO_IMAGES.map((preset) => {
                const isCurrent = selectedUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedUrl(preset.url)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all text-left group cursor-pointer ${
                      isCurrent
                        ? 'border-rose-500 ring-2 ring-rose-500/30 scale-102 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.titleEn} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-slate-950/40 p-1.5 flex flex-col justify-end">
                      <span className="text-[10px] font-bold text-white line-clamp-1">
                        {lang === 'th' ? preset.titleTh : preset.titleEn}
                      </span>
                    </div>
                    {isCurrent && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct URL Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {lang === 'th' ? 'ใส่ลิงก์รูปภาพ (Image URL)' : 'Or Enter Image URL'}
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                disabled={!customUrl.trim()}
                className="px-4 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all cursor-pointer"
              >
                {lang === 'th' ? 'ใช้รูปนี้' : 'Apply'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5 bg-slate-50/50 dark:bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.saveChanges}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
