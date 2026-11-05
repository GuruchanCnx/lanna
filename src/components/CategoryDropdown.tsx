import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter, Check, Heart, Sparkles, X } from 'lucide-react';
import { Product } from '../lib/types';
import { Language, translations } from '../lib/translations';

export interface CategoryItem {
  id: string;
  labelKey: string;
  icon: string;
  color: string;
  badgeColor: string;
}

interface CategoryDropdownProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchedProducts: Product[];
  favoritesCount: number;
  categories: CategoryItem[];
  lang: Language;
  isSimple?: boolean;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  activeCategory,
  onSelectCategory,
  searchedProducts,
  favoritesCount,
  categories,
  lang,
  isSimple = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Find active category item
  const currentCategoryItem = categories.find((c) => c.id === activeCategory);

  const getActiveLabel = () => {
    if (activeCategory === 'all') {
      return {
        icon: '✨',
        title: lang === 'th' ? 'เมนูทั้งหมด' : 'All Menu',
        count: searchedProducts.length,
      };
    }
    if (activeCategory === 'favorites') {
      return {
        icon: '❤️',
        title: t.catFavorites,
        count: favoritesCount,
      };
    }
    if (currentCategoryItem) {
      const count = searchedProducts.filter((p) => p.category === currentCategoryItem.id).length;
      const dict = t as unknown as Record<string, string>;
      return {
        icon: currentCategoryItem.icon,
        title: dict[currentCategoryItem.labelKey] || currentCategoryItem.id,
        count,
      };
    }
    return {
      icon: '📂',
      title: t.categoryDropdown,
      count: searchedProducts.length,
    };
  };

  const activeInfo = getActiveLabel();

  const handleSelect = (catId: string) => {
    onSelectCategory(catId);
    setIsOpen(false);

    if (catId !== 'favorites' && catId !== 'all') {
      setTimeout(() => {
        const el = document.getElementById(`cat-section-${catId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="relative w-full z-30" ref={dropdownRef}>
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Main Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex-1 min-w-[220px] flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-2 rounded-2xl shadow-sm transition-all duration-200 active:scale-98 cursor-pointer ${
            isOpen 
              ? 'border-rose-500 ring-4 ring-rose-500/10' 
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          } ${isSimple ? 'py-4 text-base' : 'text-sm'}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-lg flex-shrink-0" role="img" aria-label="category icon">
              {activeInfo.icon}
            </span>
            <div className="text-left truncate">
              <span className="block font-black text-slate-800 dark:text-white truncate">
                {activeInfo.title}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {lang === 'th' ? 'แตะเพื่อเปลี่ยนหมวดหมู่' : 'Tap to change category'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs px-2 py-0.5 rounded-full font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {activeInfo.count}
            </span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-rose-50 dark:bg-rose-950/40 text-rose-500' : ''}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Quick Shortcut Buttons (All & Favorites) for high speed */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            title={lang === 'th' ? "ดูทั้งหมด" : "View All"}
            className={`px-3 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 border flex items-center gap-1 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'th' ? 'ทั้งหมด' : 'All'}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('favorites')}
            title={t.catFavorites}
            className={`px-3 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 border flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'favorites'
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/20'
                : 'bg-white dark:bg-slate-900 text-rose-500 border-rose-200 dark:border-rose-950/60 hover:bg-rose-50 dark:hover:bg-rose-950/20'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeCategory === 'favorites' || favoritesCount > 0 ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{t.catFavorites}</span>
            {favoritesCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeCategory === 'favorites' ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Dropdown Menu Modal / Popover */}
      {isOpen && (
        <>
          {/* Subtle backdrop for mobile touch dismiss */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-xs md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div 
            className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[70vh] sm:max-h-[460px] overflow-y-auto"
            role="listbox"
          >
            {/* Dropdown Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-rose-500" />
                <span>{t.categoryDropdown}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Options */}
            <div className="space-y-1">
              {/* Option: All */}
              <button
                type="button"
                onClick={() => handleSelect('all')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-black'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'
                }`}
                role="option"
                aria-selected={activeCategory === 'all'}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">✨</span>
                  <div>
                    <span className="text-sm block">{lang === 'th' ? 'เมนูทั้งหมด' : 'All Menu'}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {lang === 'th' ? 'รวมทุกรายการอาหารและเครื่องดื่ม' : 'Show all products & beverages'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {searchedProducts.length}
                  </span>
                  {activeCategory === 'all' && <Check className="w-4 h-4 text-rose-500" />}
                </div>
              </button>

              {/* Option: Favorites */}
              <button
                type="button"
                onClick={() => handleSelect('favorites')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                  activeCategory === 'favorites'
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-black'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'
                }`}
                role="option"
                aria-selected={activeCategory === 'favorites'}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">❤️</span>
                  <div>
                    <span className="text-sm block">{t.catFavorites}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {lang === 'th' ? 'เมนูที่คุณบันทึกไว้ในดวงใจ' : 'Items you marked with heart'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                    {favoritesCount}
                  </span>
                  {activeCategory === 'favorites' && <Check className="w-4 h-4 text-rose-500" />}
                </div>
              </button>

              <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

              {/* Dynamic Categories */}
              {categories.map((catItem) => {
                const count = searchedProducts.filter((p) => p.category === catItem.id).length;
                const isSelected = activeCategory === catItem.id;
                const dict = t as unknown as Record<string, string>;
                const label = dict[catItem.labelKey] || catItem.id;

                return (
                  <button
                    key={catItem.id}
                    type="button"
                    onClick={() => handleSelect(catItem.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-black'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{catItem.icon}</span>
                      <span className="text-sm">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {count}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-rose-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
