import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Facebook, Instagram, Send } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface SocialShareProps {
  lang: Language;
}

export const SocialShare: React.FC<SocialShareProps> = ({ lang }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const shareUrl = window.location.origin;
  const shareText = `${t.appName} - ${t.slogan}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    tiktok: `https://www.tiktok.com/`, // TikTok doesn't support simple URL sharing, we guide the user
    instagram: `https://www.instagram.com/`
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="text-center mb-5">
        <div className="inline-flex p-3.5 bg-rose-500/10 text-rose-500 rounded-full mb-3">
          <Share2 className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-xl text-slate-800 dark:text-white">
          {t.shareTitle}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.sharePrompt}
        </p>
      </div>

      {/* Sharing Grid */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {/* TikTok */}
        <a
          href={shareLinks.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            handleCopy();
          }}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center text-white shadow-md">
            {/* TikTok Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.17 1.02 1.12 2.45 1.8 3.97 1.97v3.89c-1.78-.07-3.51-.73-4.91-1.84-.13-.1-.26-.2-.37-.31v6.82c.04 4.54-3.23 8.46-7.75 9.14-4.87.82-9.45-2.52-10.23-7.4C-1.92 11.23 1.5 6.36 6.47 5.61c1.29-.2 2.62-.1 3.86.3v3.91c-.88-.41-1.86-.53-2.79-.34-1.95.34-3.37 2.15-3.27 4.13.13 2.19 2.11 3.82 4.3 3.59 1.77-.13 3.19-1.53 3.27-3.31V.02z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-black dark:group-hover:text-white">TikTok</span>
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/10">
            <Facebook className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600">Facebook</span>
        </a>

        {/* Instagram */}
        <a
          href={shareLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            handleCopy();
          }}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Instagram className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-rose-500">Instagram</span>
        </a>

        {/* LINE */}
        <a
          href={shareLinks.line}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-500">LINE</span>
        </a>
      </div>

      {/* Copy Link Input Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl">
        <input
          type="text"
          readOnly
          value={`${shareText} ${shareUrl}`}
          className="flex-1 bg-transparent text-xs text-slate-500 dark:text-slate-400 font-medium px-2 focus:outline-none overflow-ellipsis whitespace-nowrap"
        />
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all active:scale-95 shadow-md shadow-rose-500/10"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? "คัดลอกแล้ว" : "Copied"}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? "คัดลอก" : "Copy"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
