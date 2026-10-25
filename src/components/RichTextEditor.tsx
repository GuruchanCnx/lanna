import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, List, Image as ImageIcon, Code, Eye, Sparkles, Upload, Check, RefreshCw } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface RichTextEditorProps {
  lang: Language;
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ lang, value, onChange, label }) => {
  const [showHtml, setShowHtml] = useState(false);
  const [showImageInserter, setShowImageInserter] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  // Presets for easy inserting
  const presets = [
    { name: "Chiang Mai Bag", url: "/images/chiangmai-bag.png" },
    { name: "Patongko & Soy", url: "/images/patongko-soy.png" },
    { name: "Tao Tung Dessert", url: "/images/tao-tung.png" },
    { name: "Soy Milk Bag", url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400" }
  ];

  const insertTag = (tagOpen: string, tagClose: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = tagOpen + selectedText + tagClose;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Refocus and restore selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length);
    }, 50);
  };

  const insertImageHtml = (url: string, alt: string = "embedded image") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;
    const imageTag = `<img src="${url}" alt="${alt}" class="w-full max-w-[200px] h-auto rounded-xl my-2 inline-block shadow-sm" />`;

    const newValue = text.substring(0, start) + imageTag + text.substring(start);
    onChange(newValue);
    setShowImageInserter(false);

    setTimeout(() => {
      textarea.focus();
    }, 50);
  };

  const handleEditorFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onloadend = () => {
            insertImageHtml(reader.result as string, file.name);
            setUploading(false);
          };
          reader.readAsDataURL(file);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <div className="space-y-1.5 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 transition-colors">
      {/* Label and Mode Toggles */}
      <div className="bg-slate-50 dark:bg-slate-900/60 px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <button
          type="button"
          onClick={() => setShowHtml(!showHtml)}
          className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:underline"
        >
          {showHtml ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? "ดูตัวอย่างแบบสมบูรณ์" : "Visual Preview"}</span>
            </>
          ) : (
            <>
              <Code className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? "แก้ไขรหัส HTML" : "Edit HTML Source"}</span>
            </>
          )}
        </button>
      </div>

      {/* Formatting Toolbar */}
      <div className="px-2 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => insertTag('<b>', '</b>')}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-all"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertTag('<i>', '</i>')}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-all"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertTag('<u>', '</u>')}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-all"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertTag('<li>', '</li>')}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-all"
          title="List Item"
        >
          <List className="w-4 h-4" />
        </button>
        
        {/* Insert Image Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowImageInserter(!showImageInserter)}
            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1 ${
              showImageInserter ? 'text-rose-500 bg-rose-500/5' : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
            }`}
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase">Upload</span>
          </button>

          {/* Image Inserter Popover */}
          {showImageInserter && (
            <div className="absolute left-0 mt-2 z-30 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="text-xs font-black text-slate-800 dark:text-white">Insert Image</span>
                <button 
                  type="button" 
                  onClick={() => setShowImageInserter(false)} 
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Upload input */}
              <div className="space-y-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleEditorFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{progress}%</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'th' ? "อัปโหลดภาพลงในข้อความ" : "Upload Image to Text"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preset selection */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Choose Preset</span>
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => insertImageHtml(p.url, p.name)}
                      className="aspect-square rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-rose-500 transition-all"
                      title={p.name}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-2 min-h-[120px] bg-slate-50/20 dark:bg-slate-950/40">
        {showHtml ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[120px] p-2 bg-transparent text-slate-800 dark:text-white font-mono text-xs focus:outline-none resize-y border-0"
            placeholder="Enter description HTML (e.g. <b>Fresh</b>, <i>traditional</i>, or images)"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Easy Text Entry */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full min-h-[120px] p-2 bg-transparent text-slate-800 dark:text-white text-xs focus:outline-none resize-y border-0 border-r border-slate-100 dark:border-slate-800/60"
              placeholder={lang === 'th' ? "พิมพ์คำอธิบายสินค้าที่นี่... ใช้เครื่องมือด้านบนเพื่อจัดข้อความให้สวยงาม" : "Type product description here... Use the toolbar above to style."}
            />
            {/* Right Column: Live visual HTML rendering preview */}
            <div className="p-2 min-h-[120px] text-xs text-slate-600 dark:text-slate-300 overflow-y-auto leading-relaxed max-h-36 selection:bg-rose-500/10">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 border-b border-slate-100 dark:border-slate-800 pb-0.5">Live Preview</div>
              <div 
                className="prose dark:prose-invert max-w-none text-xs"
                dangerouslySetInnerHTML={{ __html: value || `<span class="text-slate-400 italic">${lang === 'th' ? 'ไม่มีคำอธิบาย' : 'No description'}</span>` }} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
