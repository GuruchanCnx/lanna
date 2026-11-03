import React, { useState } from 'react';
import { 
  Flame, Award, Star, TrendingUp, Sparkles, Heart, Plus, ShoppingBag, 
  Check, Coffee, ChevronRight, Zap, Filter
} from 'lucide-react';
import { Product } from '../lib/types';
import { translations, Language } from '../lib/translations';

interface BestSellersPageProps {
  products: Product[];
  lang: Language;
  isSimple: boolean;
  favorites: string[];
  onToggleFavorite: (productId: string, e?: React.MouseEvent) => void;
  onAddToCart: (product: Product) => void;
  selectedBevOptions: Record<string, { temperature: 'hot' | 'cold', toppings: 'none' | 'with' }>;
  onSelectOption: (productId: string, optionKey: 'temperature' | 'toppings', val: any) => void;
}

export const BestSellersPage: React.FC<BestSellersPageProps> = ({
  products,
  lang,
  isSimple,
  favorites,
  onToggleFavorite,
  onAddToCart,
  selectedBevOptions,
  onSelectOption,
}) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | 'snacks' | 'drinks' | 'ginger' | 'toast'>('all');

  // Curated Best Seller IDs based on Wua Lai Road Soi 2 popularity
  const bestSellerMeta: Record<string, { rank: number; badgeTh: string; badgeEn: string; salesCount: number; rating: number; tag: 'snacks' | 'drinks' | 'ginger' | 'toast' }> = {
    // 1. ปาท่องโก๋
    'snack-1': { rank: 1, badgeTh: '🔥 ขายดีอันดับ 1 ในตำนาน', badgeEn: '#1 All-Time Legend', salesCount: 5420, rating: 5.0, tag: 'snacks' },
    // 2. ขนมปังสังขยาชุด
    'snack-2': { rank: 2, badgeTh: '⭐ ชุดยอดฮิต ประจำโต๊ะ', badgeEn: '#2 Table Favorite Set', salesCount: 3890, rating: 4.9, tag: 'snacks' },
    // 3. น้ำเต้าหู้ทรงเครื่อง
    'soy-4': { rank: 3, badgeTh: '🥣 ซิกเนเจอร์ทรงเครื่องแน่น', badgeEn: '#3 Loaded Grains Signature', salesCount: 4210, rating: 4.9, tag: 'drinks' },
    // 4. นมสดชาเย็น
    'milk-8': { rank: 4, badgeTh: '🧋 ชาไทยเข้มข้น นมสดแท้', badgeEn: '#4 Creamy Thai Tea Latte', salesCount: 3120, rating: 4.9, tag: 'drinks' },
    // 5. เต้าฮวยน้ำขิงทรงเครื่อง
    'ginger-4': { rank: 5, badgeTh: '🫚 เผ็ดร้อนไล่ลม เนื้อเนียน', badgeEn: '#5 Hot Ginger Douhua', salesCount: 2850, rating: 4.8, tag: 'ginger' },
    // 6. เนยนมน้ำตาล ปังปิ้ง
    'toast-1': { rank: 6, badgeTh: '🍞 ปังปิ้งเตาถ่าน เนยฉ่ำ', badgeEn: '#6 Charcoal Butter Toast', salesCount: 2640, rating: 4.8, tag: 'toast' },
    // 7. นมสดชาเขียว
    'milk-7': { rank: 7, badgeTh: '🍵 ชาเขียวมัทฉะนมสด', badgeEn: '#7 Matcha Fresh Milk', salesCount: 2410, rating: 4.8, tag: 'drinks' },
    // 8. น้ำเต้าหู้ใส่เครื่อง
    'soy-2': { rank: 8, badgeTh: '🥛 หวานน้อย สุขภาพดี', badgeEn: '#8 Healthy Low Sugar', salesCount: 2980, rating: 4.9, tag: 'drinks' },
    // 9. เนยนมช็อกโกแลต
    'toast-7': { rank: 9, badgeTh: '🍫 ช็อกโกแลตเข้มข้น', badgeEn: '#9 Dark Chocolate Toast', salesCount: 2150, rating: 4.8, tag: 'toast' }
  };

  // Filter products by best seller list
  const bestSellerProducts = products
    .filter(p => bestSellerMeta[p.id])
    .sort((a, b) => (bestSellerMeta[a.id]?.rank || 99) - (bestSellerMeta[b.id]?.rank || 99));

  const filteredProducts = bestSellerProducts.filter(p => {
    if (filter === 'all') return true;
    return bestSellerMeta[p.id]?.tag === filter;
  });

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-rose-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-500/15">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-black uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>{lang === 'th' ? 'เมนูยอดนิยมอันดับ 1 ของเชียงใหม่' : 'Chiang Mai #1 Top Sellers'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            {lang === 'th' ? 'สินค้าขายดีประจำร้าน' : 'Best Sellers & Customer Favorites'}
          </h2>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
            {lang === 'th' 
              ? 'คัดสรรเมนูยอดฮิตที่ลูกค้าทั้งคนเชียงใหม่และนักท่องเที่ยวสั่งซ้ำมากที่สุด ปาท่องโก๋สะบัดน้ำมันกรอบนอกนุ่มใน น้ำเต้าหู้ และปังปิ้งเตาถ่าน' 
              : 'Our highest-rated, most-ordered signature dishes. Handcrafted crispy Chinese donuts, creamy fresh soymilk, and charcoal toast.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-white/80 font-bold">
            <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>{lang === 'th' ? 'ทอดสดใหม่ทุกวัน' : 'Fried Fresh Daily'}</span>
            </span>
            <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>{lang === 'th' ? 'เรตติ้งเฉลี่ย 4.9/5' : '4.9/5 Average Rating'}</span>
            </span>
            <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>{lang === 'th' ? 'มากกว่า 25,000+ ออเดอร์' : '25,000+ Orders Placed'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', labelTh: 'ทั้งหมด (Top 9)', labelEn: 'All Best Sellers' },
          { key: 'snacks', labelTh: 'ของทานเล่น & ปาท่องโก๋', labelEn: 'Snacks & Patongko' },
          { key: 'drinks', labelTh: 'น้ำเต้าหู้ & นมสด', labelEn: 'Soy Milk & Drinks' },
          { key: 'ginger', labelTh: 'เต้าฮวย & น้ำขิง', labelEn: 'Ginger & Douhua' },
          { key: 'toast', labelTh: 'ปังปิ้งเตาถ่าน', labelEn: 'Charcoal Toast' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-2xl font-bold text-xs whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
              filter === tab.key
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
            }`}
          >
            {lang === 'th' ? tab.labelTh : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          const meta = bestSellerMeta[p.id];
          const isFav = favorites.includes(p.id);
          const isBeverage = p.isBeverage || ['beverages', 'soymilk', 'milk', 'drinks'].includes(p.category);
          const bevOptions = selectedBevOptions[p.id] || { temperature: 'hot', toppings: 'none' };

          return (
            <div 
              key={p.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all hover:shadow-2xl relative group hover:-translate-y-1"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <img 
                  src={p.image} 
                  alt={p.nameEn} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />

                {/* Rank Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-md ${
                    meta?.rank === 1 
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-white/80' 
                      : meta?.rank === 2 
                      ? 'bg-slate-200 text-slate-900 ring-2 ring-white/80' 
                      : meta?.rank === 3 
                      ? 'bg-amber-700 text-white ring-2 ring-white/80' 
                      : 'bg-slate-900/80 text-white backdrop-blur-sm'
                  }`}>
                    #{meta?.rank}
                  </span>
                  {meta && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-md shadow-sm">
                      {lang === 'th' ? meta.badgeTh : meta.badgeEn}
                    </span>
                  )}
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => onToggleFavorite(p.id, e)}
                  title={isFav ? (lang === 'th' ? "ลบออกจากรายการโปรด" : "Remove from favorites") : (lang === 'th' ? "เพิ่มในรายการโปรด" : "Add to favorites")}
                  className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-75 shadow-md ${
                    isFav
                      ? 'bg-rose-500 text-white shadow-rose-500/30 ring-2 ring-white/50'
                      : 'bg-white/85 dark:bg-slate-900/85 text-slate-400 hover:text-rose-500 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-current scale-110' : ''}`} />
                </button>

                {/* Price Pill */}
                <div className="absolute bottom-3 right-3 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                  ฿{p.price}
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-slate-700 dark:text-slate-200">{meta?.rating || 4.9}</span>
                    </span>
                    <span>
                      {meta?.salesCount?.toLocaleString()} {lang === 'th' ? 'สั่งแล้ว' : 'ordered'}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-800 dark:text-white leading-tight">
                    {lang === 'th' ? p.nameTh : p.nameEn}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {lang === 'th' ? p.descriptionTh : p.descriptionEn}
                  </p>
                </div>

                {/* Beverage Customization Options */}
                {isBeverage && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>{lang === 'th' ? 'ระดับอุณหภูมิ' : 'Temperature'}:</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectOption(p.id, 'temperature', 'hot')}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                            bevOptions.temperature === 'hot'
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lang === 'th' ? 'ร้อน' : 'Hot'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectOption(p.id, 'temperature', 'cold')}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                            bevOptions.temperature === 'cold'
                              ? 'bg-sky-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lang === 'th' ? 'เย็น' : 'Cold'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="pt-2">
                  <button
                    id={`add-btn-${p.id}`}
                    onClick={() => onAddToCart(p)}
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-2xl text-xs transition-all active:scale-95 shadow-lg shadow-rose-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'th' ? 'ใส่ตะกร้า' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
