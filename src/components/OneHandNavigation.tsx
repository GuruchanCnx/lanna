import React, { useState, useEffect } from 'react';
import { 
  Hand, ArrowUp, ShoppingBag, Filter, Search, RotateCcw, 
  ChevronRight, ChevronLeft, Sparkles, Check, X
} from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface OneHandNavigationProps {
  lang: Language;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenCategoryMenu: () => void;
  onScrollToTop: () => void;
  onFocusSearch: () => void;
  activeCategoryName?: string;
  isSimple?: boolean;
}

export const OneHandNavigation: React.FC<OneHandNavigationProps> = ({
  lang,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenCategoryMenu,
  onScrollToTop,
  onFocusSearch,
  activeCategoryName,
  isSimple = false,
}) => {
  const t = translations[lang];

  // Load one-hand mode preference from localStorage
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('fs_one_hand_enabled');
      return saved !== null ? saved === 'true' : true; // Default to true on mobile for great UX
    } catch {
      return true;
    }
  });

  const [handSide, setHandSide] = useState<'right' | 'left'>(() => {
    try {
      const saved = localStorage.getItem('fs_one_hand_side');
      return saved === 'left' ? 'left' : 'right';
    } catch {
      return 'right';
    }
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('fs_one_hand_enabled', String(isEnabled));
      localStorage.setItem('fs_one_hand_side', handSide);
    } catch {
      // ignore
    }
  }, [isEnabled, handSide]);

  const toggleHandSide = () => {
    setHandSide((prev) => (prev === 'right' ? 'left' : 'right'));
  };

  if (!isEnabled) {
    // Show a minimal enable pill in the corner for easy re-enabling
    return (
      <div className="fixed bottom-20 right-3 z-30 md:hidden">
        <button
          type="button"
          onClick={() => setIsEnabled(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 dark:bg-white/90 text-white dark:text-slate-900 backdrop-blur-md rounded-full shadow-lg text-[10px] font-black border border-white/20 active:scale-95 transition-all"
          title={t.oneHandMode}
        >
          <Hand className="w-3.5 h-3.5 text-rose-400" />
          <span>{lang === 'th' ? "เปิดโหมดมือเดียว" : "One-Hand"}</span>
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`fixed bottom-20 z-30 md:hidden transition-all duration-300 pointer-events-auto ${
        handSide === 'right' ? 'right-3' : 'left-3'
      }`}
    >
      {/* Expanded Quick Action Thumb Arc / Menu */}
      {isExpanded && (
        <div className="mb-2 space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Hand side toggle & dismiss bar */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-white/15 text-white shadow-xl text-[10px] font-bold justify-between">
            <button
              type="button"
              onClick={toggleHandSide}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
              title={lang === 'th' ? "สลับมือซ้าย/ขวา" : "Switch hand"}
            >
              {handSide === 'right' ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span>{handSide === 'right' ? t.oneHandRight : t.oneHandLeft}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEnabled(false)}
              className="px-2 py-1 text-slate-400 hover:text-white text-[9px]"
              title={lang === 'th' ? "ปิดโหมดมือเดียว" : "Turn off"}
            >
              {lang === 'th' ? "ซ่อน" : "Hide"}
            </button>
          </div>

          {/* Quick Thumb Actions Container */}
          <div className="p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 w-48">
            {/* 1. Category Menu Thumb Button */}
            <button
              type="button"
              onClick={() => {
                onOpenCategoryMenu();
                setIsExpanded(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-800 dark:text-white transition-all text-xs font-black active:scale-95"
            >
              <div className="flex items-center gap-2 truncate">
                <Filter className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span className="truncate">{activeCategoryName || t.categoryDropdown}</span>
              </div>
              <span className="text-[10px] text-slate-400">📂</span>
            </button>

            {/* 2. Quick Search Focus */}
            <button
              type="button"
              onClick={() => {
                onFocusSearch();
                setIsExpanded(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-800 dark:text-white transition-all text-xs font-black active:scale-95"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-500" />
                <span>{lang === 'th' ? "ค้นหาเมนู" : "Quick Search"}</span>
              </div>
              <span className="text-[10px] text-slate-400">🔍</span>
            </button>

            {/* 3. Scroll to Top */}
            <button
              type="button"
              onClick={() => {
                onScrollToTop();
                setIsExpanded(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-800 dark:text-white transition-all text-xs font-black active:scale-95"
            >
              <div className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-indigo-500" />
                <span>{lang === 'th' ? "ขึ้นด้านบน" : "Scroll to Top"}</span>
              </div>
              <span className="text-[10px] text-slate-400">🔝</span>
            </button>

            {/* 4. Cart Action if items exist */}
            {cartCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onOpenCart();
                  setIsExpanded(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white transition-all text-xs font-black active:scale-95 shadow-md shadow-rose-500/25"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'th' ? `สั่งซื้อ (${cartCount})` : `Checkout (${cartCount})`}</span>
                </div>
                <span>฿{cartTotal}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Floating Thumb Trigger Pill / FAB */}
      <div className="flex items-center gap-2">
        {/* If cart has items, show quick cart thumb pill alongside */}
        {cartCount > 0 && !isExpanded && (
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-rose-500 text-white font-black text-xs shadow-xl shadow-rose-500/30 active:scale-95 transition-transform border border-white/20"
            title={lang === 'th' ? "ดูตะกร้าสินค้า" : "View Cart"}
          >
            <ShoppingBag className="w-4 h-4 animate-bounce" />
            <span>฿{cartTotal}</span>
            <span className="bg-white text-rose-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </button>
        )}

        {/* Thumb Mode Master Button */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-xl backdrop-blur-md transition-all active:scale-90 border cursor-pointer ${
            isExpanded
              ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/30'
              : 'bg-slate-900/90 dark:bg-slate-800/90 text-white border-slate-700/50 shadow-slate-900/30'
          }`}
          title={`${t.oneHandMode} (${handSide === 'right' ? t.oneHandRight : t.oneHandLeft})`}
          aria-expanded={isExpanded}
          aria-label={t.oneHandMode}
        >
          <Hand className={`w-4 h-4 ${isExpanded ? 'rotate-12' : ''} text-amber-300 transition-transform`} />
          <span className="text-[11px] font-black tracking-wide">
            {isExpanded ? (lang === 'th' ? "ปิด" : "Close") : (lang === 'th' ? "มือเดียว" : "1-Hand")}
          </span>
          <span className="text-[9px] px-1 py-0.2 rounded-md bg-white/20 text-white/90 font-bold uppercase">
            {handSide === 'right' ? 'R' : 'L'}
          </span>
        </button>
      </div>
    </div>
  );
};
