import React from 'react';
import { Accessibility, Sparkles } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface SimpleModeToggleProps {
  isSimple: boolean;
  onChange: (simple: boolean) => void;
  lang: Language;
  className?: string;
}

export const SimpleModeToggle: React.FC<SimpleModeToggleProps> = ({ isSimple, onChange, lang, className = "" }) => {
  const t = translations[lang];

  return (
    <button
      onClick={() => onChange(!isSimple)}
      className={`flex items-center gap-2 py-2.5 px-4 rounded-2xl font-black text-xs transition-all shadow-sm active:scale-95 ${
        isSimple
          ? 'bg-amber-500 text-white shadow-amber-500/20 scale-105'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105'
      } ${className}`}
    >
      {isSimple ? (
        <>
          <Sparkles className="w-4 h-4 text-white animate-bounce" />
          <span>{t.normalMode}</span>
        </>
      ) : (
        <>
          <Accessibility className="w-4 h-4 text-amber-500" />
          <span>{t.seniorMode}</span>
        </>
      )}
    </button>
  );
};
