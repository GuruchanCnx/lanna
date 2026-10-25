import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../lib/translations';

interface LanguageToggleProps {
  lang: Language;
  onChange: (lang: Language) => void;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ lang, onChange, className = "" }) => {
  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'th' : 'en';
    onChange(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 py-2.5 px-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-sm font-bold text-xs ${className}`}
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4 text-rose-500" />
      <span>{lang === 'en' ? 'ไทย' : 'EN'}</span>
    </button>
  );
};
