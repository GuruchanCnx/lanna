import React from 'react';
import { Heart, ShoppingBag, Flame, Sparkles } from 'lucide-react';
import { Product } from '../lib/types';
import { Language, translations } from '../lib/translations';

export interface ProductCardProps {
  product: Product;
  isSimple?: boolean;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
  onAddToCart: (product: Product) => void;
  bevOptions?: {
    temperature?: 'hot' | 'cold';
    toppings?: 'none' | 'with';
  };
  onOptionChange?: (productId: string, key: 'temperature' | 'toppings', value: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSimple = false,
  lang,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  bevOptions = { temperature: 'hot', toppings: 'none' },
  onOptionChange,
}) => {
  const t = translations[lang];
  const isDrink = product.isBeverage || ['beverages', 'soymilk', 'milk', 'drinks'].includes(product.category);

  return (
    <div 
      className={`bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-md border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all duration-200 hover:shadow-xl relative group ${
        isSimple ? 'border-2 border-slate-200 dark:border-slate-700 p-5' : ''
      }`}
    >
      <div className="space-y-3">
        {/* Product Image & Badges Container */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950">
          <img 
            src={product.image} 
            alt={lang === 'th' ? product.nameTh : product.nameEn} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy" 
          />

          {/* Visual New / Trending Badge */}
          {product.badge === 'trending' && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md shadow-rose-500/30 text-[10px] font-black tracking-wide border border-white/25 backdrop-blur-sm">
              <Flame className="w-3.5 h-3.5 fill-current text-yellow-200 animate-pulse" />
              <span>{t.badgeTrending}</span>
            </div>
          )}

          {product.badge === 'new' && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-md shadow-emerald-500/30 text-[10px] font-black tracking-wide border border-white/25 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-100 animate-spin-slow" />
              <span>{t.badgeNew}</span>
            </div>
          )}

          {/* Low Stock Warning */}
          {product.stock <= 5 && (
            <span 
              className={`absolute ${product.badge ? 'top-10' : 'top-2.5'} left-2.5 z-10 bg-rose-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm backdrop-blur-xs`}
            >
              {lang === 'th' ? `เหลือ ${product.stock} ชิ้น` : `${product.stock} left`}
            </span>
          )}

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => onToggleFavorite(product.id, e)}
            title={isFavorite ? (lang === 'th' ? "ลบออกจากรายการโปรด" : "Remove from favorites") : (lang === 'th' ? "เพิ่มในรายการโปรด" : "Add to favorites")}
            aria-label={isFavorite ? "Favorited" : "Add to favorites"}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-75 shadow-md ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-rose-500/30 ring-2 ring-white/60 dark:ring-slate-900/60'
                : 'bg-white/85 dark:bg-slate-900/85 text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
          </button>
        </div>

        {/* Product Details */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-black text-slate-800 dark:text-white leading-tight ${isSimple ? 'text-lg' : 'text-sm'}`}>
              {lang === 'th' ? product.nameTh : product.nameEn}
            </h4>
          </div>

          {product.descriptionTh && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
              {lang === 'th' ? product.descriptionTh : product.descriptionEn}
            </p>
          )}
        </div>

        {/* Customization options for beverages */}
        {isDrink && !isSimple && onOptionChange && (
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800/60">
            {/* Temperature Switch */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Temp</span>
              <div className="flex bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onOptionChange(product.id, 'temperature', 'hot')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                    bevOptions.temperature === 'hot'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {t.hot}
                </button>
                <button
                  type="button"
                  onClick={() => onOptionChange(product.id, 'temperature', 'cold')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                    bevOptions.temperature === 'cold'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {t.cold}
                </button>
              </div>
            </div>

            {/* Toppings Switch */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Toppings</span>
              <div className="flex bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onOptionChange(product.id, 'toppings', 'none')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                    bevOptions.toppings === 'none'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {t.noToppings}
                </button>
                <button
                  type="button"
                  onClick={() => onOptionChange(product.id, 'toppings', 'with')}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                    bevOptions.toppings === 'with'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {t.withToppings}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action: Price & Add to Cart */}
      <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div>
          <span className={`font-black text-rose-500 ${isSimple ? 'text-xl' : 'text-base'}`}>
            ฿{product.price}
          </span>
        </div>
        <button
          id={`add-btn-${product.id}`}
          onClick={() => onAddToCart(product)}
          className={`px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs transition-all active:scale-95 shadow-md shadow-rose-500/20 flex items-center gap-1.5 cursor-pointer ${
            isSimple ? 'text-sm py-3 px-5 rounded-2xl' : ''
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t.addToCart}</span>
        </button>
      </div>
    </div>
  );
};
