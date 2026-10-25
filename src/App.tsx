import { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, Coffee, ShoppingBag, MapPin, ShieldCheck, 
  User, Sparkles, Phone, Check, Share2, Accessibility, 
  ChevronRight, Heart, ArrowRight, LogIn, LogOut, Trash2, Clock
} from 'lucide-react';
import { translations, Language } from './lib/translations';
import { db } from './lib/firebaseMock';
import { Product, CartItem, Order, UserProfile, Category } from './lib/types';
import { MapComponent } from './components/MapComponent';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { SimpleModeToggle } from './components/SimpleModeToggle';
import { SocialShare } from './components/SocialShare';
import { OrderStatusTracker } from './components/OrderStatusTracker';
import { Admin } from './pages/Admin';

function App() {
  // Localization & Theme states
  const [lang, setLang] = useState<Language>('th');
  const [isSimple, setIsSimple] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'bags' | 'map' | 'admin' | 'profile'>('home');

  // Auth & Database states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Favorites & Menu filter states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [menuFilter, setMenuFilter] = useState<'all' | 'favorites' | Category>('all');

  // Item customization state (for menu)
  const [selectedBevOptions, setSelectedBevOptions] = useState<Record<string, { temperature: 'hot' | 'cold', toppings: 'none' | 'with' }>>({});

  const t = translations[lang];

  // Load initial data
  useEffect(() => {
    setCurrentUser(db.getCurrentUser());
    fetchProducts();
    
    // Check if user has preferred language/simple mode in localStorage
    const storedLang = localStorage.getItem('lang') as Language;
    if (storedLang) setLang(storedLang);

    const storedSimple = localStorage.getItem('is_simple') === 'true';
    if (storedSimple) setIsSimple(storedSimple);

    // Load saved favorites
    const storedFavs = localStorage.getItem('fs_favorites');
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  // Fetch orders when user changes
  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
    } else {
      setUserOrders([]);
    }
  }, [currentUser]);

  const fetchProducts = async () => {
    const data = await db.collection('products').get() as Product[];
    setProducts(data);
  };

  const fetchUserOrders = async () => {
    if (!currentUser) return;
    const allOrders = await db.collection('orders').get() as Order[];
    const filtered = allOrders.filter(o => o.userId === currentUser.uid);
    setUserOrders(filtered);
  };

  // Poll for updates if there are active (non-completed) orders
  useEffect(() => {
    if (!currentUser) return;
    const hasActiveOrders = userOrders.some(o => o.status !== 'completed');
    if (!hasActiveOrders) return;

    const interval = setInterval(() => {
      fetchUserOrders();
    }, 3500);

    return () => clearInterval(interval);
  }, [currentUser, userOrders]);

  const handleToggleFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      const next = isFav ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem('fs_favorites', JSON.stringify(next));
      } catch (err) {
        console.warn('Could not save favorites to localStorage', err);
      }
      return next;
    });
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const handleSimpleModeChange = (val: boolean) => {
    setIsSimple(val);
    localStorage.setItem('is_simple', val ? 'true' : 'false');
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    fetchUserOrders();
  };

  const handleLogout = async () => {
    await db.logout();
    setCurrentUser(null);
    setUserOrders([]);
    setActiveTab('home');
  };

  // Cart Operations
  const handleAddToCart = (product: Product) => {
    const options = product.isBeverage || product.category === 'beverages'
      ? selectedBevOptions[product.id] || { temperature: 'hot', toppings: 'none' }
      : undefined;

    setCart((prevCart) => {
      // Find if item with same options already exists
      const existingIdx = prevCart.findIndex(
        (item) => 
          item.product.id === product.id && 
          JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existingIdx !== -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { product, quantity: 1, vesselDiscount: false, options }];
      }
    });

    // Provide sensory feedback
    const btn = document.getElementById(`add-btn-${product.id}`);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = lang === 'th' ? '✓ ใส่ตะกร้าแล้ว!' : '✓ Added!';
      btn.classList.add('bg-emerald-500', 'text-white');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-emerald-500', 'text-white');
      }, 1500);
    }
  };

  const handleUpdateCartQuantity = (productId: string, options: any, delta: number) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex(
        (item) => 
          item.product.id === productId && 
          JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (idx === -1) return prevCart;

      const newCart = [...prevCart];
      const newQty = newCart[idx].quantity + delta;

      if (newQty <= 0) {
        newCart.splice(idx, 1);
      } else {
        newCart[idx].quantity = newQty;
      }
      return newCart;
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Handle drink options
  const handleOptionChange = (productId: string, key: 'temperature' | 'toppings', value: any) => {
    setSelectedBevOptions((prev) => {
      const current = prev[productId] || { temperature: 'hot', toppings: 'none' };
      return {
        ...prev,
        [productId]: {
          ...current,
          [key]: value
        }
      };
    });
  };

  // Render a single product card with favorite heart toggle
  const renderProductCard = (p: Product) => {
    const isDrink = p.isBeverage || p.category === 'beverages';
    const bevOptions = selectedBevOptions[p.id] || { temperature: 'hot', toppings: 'none' };
    const isFav = favorites.includes(p.id);

    return (
      <div 
        key={p.id} 
        className={`bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-md border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all hover:shadow-lg relative group ${
          isSimple ? 'border-2 border-slate-200 dark:border-slate-700 p-5' : ''
        }`}
      >
        <div className="space-y-3">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950">
            <img src={p.image} alt={p.nameEn} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            
            {/* Favorite Toggle Button */}
            <button
              type="button"
              onClick={(e) => handleToggleFavorite(p.id, e)}
              title={isFav ? (lang === 'th' ? "ลบออกจากรายการโปรด" : "Remove from favorites") : (lang === 'th' ? "เพิ่มในรายการโปรด" : "Add to favorites")}
              aria-label={isFav ? "Favorited" : "Add to favorites"}
              className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-75 shadow-md ${
                isFav
                  ? 'bg-rose-500 text-white shadow-rose-500/30 ring-2 ring-white/50 dark:ring-slate-900/50'
                  : 'bg-white/85 dark:bg-slate-900/85 text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-current scale-110' : ''}`} />
            </button>

            {p.stock <= 5 && (
              <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                {lang === 'th' ? `เหลือ ${p.stock} ชิ้น` : `${p.stock} left`}
              </span>
            )}
          </div>

          <div>
            <h4 className={`font-black text-slate-800 dark:text-white leading-tight ${isSimple ? 'text-lg' : 'text-sm'}`}>
              {lang === 'th' ? p.nameTh : p.nameEn}
            </h4>
            {p.descriptionTh && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                {lang === 'th' ? p.descriptionTh : p.descriptionEn}
              </p>
            )}
          </div>

          {/* Customization options for beverages */}
          {isDrink && !isSimple && (
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800/60">
              {/* Temperature */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Temp</span>
                <div className="flex bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleOptionChange(p.id, 'temperature', 'hot')}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all ${
                      bevOptions.temperature === 'hot'
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {t.hot}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOptionChange(p.id, 'temperature', 'cold')}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all ${
                      bevOptions.temperature === 'cold'
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {t.cold}
                  </button>
                </div>
              </div>

              {/* Toppings */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Toppings</span>
                <div className="flex bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleOptionChange(p.id, 'toppings', 'none')}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all ${
                      bevOptions.toppings === 'none'
                        ? 'bg-rose-500 text-white'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {t.noToppings}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOptionChange(p.id, 'toppings', 'with')}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all ${
                      bevOptions.toppings === 'with'
                        ? 'bg-rose-500 text-white'
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

        <div className="flex items-center justify-between gap-4 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className={`font-black text-rose-500 ${isSimple ? 'text-xl' : 'text-sm'}`}>
            ฿{p.price}
          </span>
          <button
            id={`add-btn-${p.id}`}
            onClick={() => handleAddToCart(p)}
            className={`px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs transition-all active:scale-95 shadow-md shadow-rose-500/5 flex items-center gap-1 ${
              isSimple ? 'text-sm py-3 px-6 rounded-2xl' : ''
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.addToCart}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* TOP HEADER BAR (Minimalist, accessible) */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-4 py-3 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/10">
              <Coffee className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-black text-xs leading-tight tracking-tight text-slate-800 dark:text-white uppercase">
                {lang === 'th' ? "หายยา" : "Haiya"}
              </h1>
              <p className="text-[9px] font-bold text-rose-500 tracking-wider">
                {lang === 'th' ? "น้ำเต้าหู้ & ถุงล้านนา" : "Soy Milk & Lanna Bags"}
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            {/* Simple Mode Toggle for Seniors & Kids */}
            <SimpleModeToggle 
              isSimple={isSimple} 
              onChange={handleSimpleModeChange} 
              lang={lang} 
            />

            {/* Language Toggle */}
            <LanguageToggle 
              lang={lang} 
              onChange={handleLanguageChange} 
            />

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 px-4 py-6 max-w-6xl w-full mx-auto pb-24">
        
        {/* SIMPLE MODE HEADER GUIDE (For seniors & kids) */}
        {isSimple && (
          <div className="mb-6 p-4 bg-amber-500/10 border-2 border-amber-500 rounded-3xl text-slate-800 dark:text-amber-200">
            <div className="flex items-center gap-3">
              <Accessibility className="w-7 h-7 text-amber-500 animate-bounce" />
              <div>
                <h4 className="font-extrabold text-base">{t.seniorMode}</h4>
                <p className="text-xs font-bold opacity-90 mt-0.5">{t.tapToOrder}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENTS */}
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Hero banner */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 transition-all duration-300">
              <div className="p-6 md:p-10 flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 rounded-full text-xs font-black self-start">
                  <Sparkles className="w-4 h-4" />
                  <span>{t.tagline}</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
                  {lang === 'th' ? "ถุงเก็บความเย็นล้านนา" : "Lanna Traditional Bags"}
                </h2>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {t.slogan}
                </p>

                {/* Vessel Discount Callout */}
                <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <Coffee className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-slate-800 dark:text-white">{t.bringVesselTitle}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t.bringVesselDesc}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-500/10 transition-all flex items-center gap-2 active:scale-95 text-sm"
                  >
                    <span>{lang === 'th' ? "สั่งซื้อน้ำเต้าหู้ & ถุงผ้า" : "Order Soy Milk & Bags"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-square md:aspect-auto min-h-[300px]">
                <img 
                  src="/images/chiangmai-bag.png" 
                  alt="Chiang Mai Traditional Bag" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              </div>
            </div>

            {/* Simple Steps Guide */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300">
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4">
                {t.easySteps}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl space-y-1 border border-slate-100 dark:border-slate-800/60">
                  <h4 className="font-extrabold text-xs text-rose-500">{t.step1}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.step1Desc}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl space-y-1 border border-slate-100 dark:border-slate-800/60">
                  <h4 className="font-extrabold text-xs text-rose-500">{t.step2}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.step2Desc}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl space-y-1 border border-slate-100 dark:border-slate-800/60">
                  <h4 className="font-extrabold text-xs text-rose-500">{t.step3}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{t.step3Desc}</p>
                </div>
              </div>
            </div>

            {/* Social Share & Map teaser */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SocialShare lang={lang} />
              <MapComponent lang={lang} />
            </div>
          </div>
        )}

        {/* TAB 2: MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Category selection */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none items-center">
              {/* All Filter */}
              <button
                onClick={() => setMenuFilter('all')}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-sm border ${
                  menuFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {lang === 'th' ? "✨ ทั้งหมด" : "✨ All"}
              </button>

              {/* Favorites Filter */}
              <button
                onClick={() => setMenuFilter('favorites')}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-sm border flex items-center gap-1.5 ${
                  menuFilter === 'favorites'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                    : 'bg-white dark:bg-slate-900 text-rose-500 border-rose-200 dark:border-rose-950/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${menuFilter === 'favorites' || favorites.length > 0 ? 'fill-current' : ''}`} />
                <span>{t.catFavorites}</span>
                {favorites.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    menuFilter === 'favorites'
                      ? 'bg-white text-rose-600'
                      : 'bg-rose-500 text-white'
                  }`}>
                    {favorites.length}
                  </span>
                )}
              </button>

              {(['donuts', 'beverages', 'desserts', 'bags'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setMenuFilter(cat);
                    const el = document.getElementById(`cat-section-${cat}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-sm border ${
                    menuFilter === cat
                      ? cat === 'donuts' ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-500/30' :
                        cat === 'beverages' ? 'bg-sky-500 text-white border-sky-500 ring-2 ring-sky-500/30' :
                        cat === 'desserts' ? 'bg-emerald-500 text-white border-emerald-500 ring-2 ring-emerald-500/30' :
                        'bg-rose-500 text-white border-rose-500 ring-2 ring-rose-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  {cat === 'donuts' && t.catDonuts}
                  {cat === 'beverages' && t.catBeverages}
                  {cat === 'desserts' && t.catDesserts}
                  {cat === 'bags' && t.catBags}
                </button>
              ))}
            </div>

            {/* Product categories list or Favorites view */}
            {menuFilter === 'favorites' ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b pb-2 border-rose-500/10">
                  <h3 className={`font-black tracking-tight text-rose-500 flex items-center gap-2 ${isSimple ? 'text-xl' : 'text-base'}`}>
                    <Heart className="w-5 h-5 fill-current animate-pulse text-rose-500" />
                    <span>{t.catFavorites} ({products.filter(p => favorites.includes(p.id)).length})</span>
                  </h3>
                  {favorites.length > 0 && (
                    <button
                      onClick={() => {
                        setFavorites([]);
                        try {
                          localStorage.removeItem('fs_favorites');
                        } catch {
                          // ignore error
                        }
                      }}
                      className="text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      {lang === 'th' ? "ล้างรายการโปรดทั้งหมด" : "Clear all"}
                    </button>
                  )}
                </div>

                {products.filter(p => favorites.includes(p.id)).length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                      <Heart className="w-8 h-8 animate-pulse text-rose-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-lg text-slate-800 dark:text-white">
                        {t.noFavoritesTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                        {t.noFavoritesDesc}
                      </p>
                    </div>
                    <button
                      onClick={() => setMenuFilter('all')}
                      className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95"
                    >
                      {lang === 'th' ? "ดูเมนูทั้งหมด" : "Browse Full Menu"}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.filter(p => favorites.includes(p.id)).map(renderProductCard)}
                  </div>
                )}
              </div>
            ) : (
              (['donuts', 'beverages', 'desserts', 'bags'] as Category[])
                .filter(cat => menuFilter === 'all' || menuFilter === cat)
                .map((cat) => {
                  const catProducts = products.filter(p => p.category === cat);
                  if (catProducts.length === 0) return null;

                  return (
                    <div key={cat} id={`cat-section-${cat}`} className="space-y-4 pt-4">
                      <h3 className={`font-black tracking-tight border-b pb-2 flex items-center gap-2 ${
                        cat === 'donuts' ? 'text-amber-500 border-amber-500/10' :
                        cat === 'beverages' ? 'text-sky-500 border-sky-500/10' :
                        cat === 'desserts' ? 'text-emerald-500 border-emerald-500/10' :
                        'text-rose-500 border-rose-500/10'
                      } ${isSimple ? 'text-xl' : 'text-base'}`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                        <span>
                          {cat === 'donuts' && t.catDonuts}
                          {cat === 'beverages' && t.catBeverages}
                          {cat === 'desserts' && t.catDesserts}
                          {cat === 'bags' && t.catBags}
                        </span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {catProducts.map(renderProductCard)}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* TAB 3: LANNA BAGS SHOWCASE */}
        {activeTab === 'bags' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300">
              <div className="max-w-2xl mx-auto text-center space-y-3">
                <div className="inline-flex p-3 bg-rose-500/10 text-rose-500 rounded-full">
                  <Heart className="w-6 h-6 animate-pulse" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
                  {t.bagFeatureTitle}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.bagFeatureDesc}
                </p>
              </div>
            </div>

            {/* Bags list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.filter(p => p.category === 'bags').map((p) => {
                const isFav = favorites.includes(p.id);
                return (
                  <div key={p.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all hover:shadow-2xl relative group">
                    <div className="relative aspect-square bg-slate-50 dark:bg-slate-950">
                      <img src={p.image} alt={p.nameEn} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      
                      {/* Favorite Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(p.id, e)}
                        title={isFav ? (lang === 'th' ? "ลบออกจากรายการโปรด" : "Remove from favorites") : (lang === 'th' ? "เพิ่มในรายการโปรด" : "Add to favorites")}
                        aria-label="Toggle favorite"
                        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-75 shadow-md ${
                          isFav
                            ? 'bg-rose-500 text-white shadow-rose-500/30 ring-2 ring-white/50 dark:ring-slate-900/50'
                            : 'bg-white/85 dark:bg-slate-900/85 text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-900'
                        }`}
                      >
                        <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-current scale-110' : ''}`} />
                      </button>

                      <span className="absolute bottom-3 left-3 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                        ฿{p.price}
                      </span>
                    </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-800 dark:text-white leading-tight">
                        {lang === 'th' ? p.nameTh : p.nameEn}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {lang === 'th' ? p.descriptionTh : p.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl text-xs transition-all active:scale-95 shadow-lg shadow-rose-500/10 flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{lang === 'th' ? "สั่งซื้อถุงผ้านี้" : "Order This Bag"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        )}

        {/* TAB 4: SHOP MAP */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <MapComponent lang={lang} />
            
            {/* Contact details */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 text-center space-y-4">
              <div className="inline-flex p-3 bg-rose-500/10 text-rose-500 rounded-full">
                <Phone className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className={`font-black text-slate-800 dark:text-white ${isSimple ? 'text-xl' : 'text-base'}`}>
                  {t.callShop}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'th' ? "เปิดให้บริการทุกวัน: 06:00 - 21:00 น." : "Open Daily: 6:00 AM - 9:00 PM"}
                </p>
              </div>
              <a
                href="tel:0812345678"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-500/10 transition-all active:scale-95 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>{lang === 'th' ? "โทรออกด่วน" : "Call Now"}</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <Admin 
            lang={lang} 
            currentUser={currentUser} 
            onLoginRequest={() => setIsAuthModalOpen(true)}
            onRefreshProducts={fetchProducts}
          />
        )}

        {/* TAB 6: PROFILE & AUTH */}
        {activeTab === 'profile' && (
          <div className="max-w-md mx-auto space-y-6">
            {!currentUser ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 text-center space-y-5">
                <div className="inline-flex p-4 bg-rose-500/10 text-rose-500 rounded-full">
                  <LogIn className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-800 dark:text-white tracking-tight">
                    {lang === 'th' ? "เข้าสู่ระบบสมาชิก" : "Sign In to Lanna Bags"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    {lang === 'th' 
                      ? "เข้าสู่ระบบเพื่อสะสมแต้ม ดูประวัติการสั่งซื้อ และรับสิทธิพิเศษมากมาย" 
                      : "Sign in to track orders, save favorites, and enjoy exclusive Lanna rewards."}
                  </p>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-500/10 transition-all active:scale-95 text-sm"
                >
                  {t.login}
                </button>
              </div>
            ) : (
              <>
                {/* Profile Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 flex items-center gap-4">
                  <img 
                    src={currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} 
                    alt={currentUser.displayName} 
                    className="w-16 h-16 rounded-2xl object-cover shadow-md bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-lg text-slate-800 dark:text-white truncate">
                      {currentUser.displayName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                    <div className="flex gap-1.5 mt-1.5">
                      <span className="bg-rose-500/10 text-rose-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        {currentUser.provider}
                      </span>
                      {currentUser.isAdmin && (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 rounded-xl transition-all"
                    title={t.logout}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>

                {/* Order History */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-rose-500" />
                    <span>{lang === 'th' ? "ประวัติการสั่งซื้อของคุณ" : "Your Order History"}</span>
                  </h4>

                  {userOrders.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 italic">
                      {lang === 'th' ? "ไม่มีประวัติการสั่งซื้อ" : "No orders placed yet."}
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                      {userOrders.map((o) => (
                        <div key={o.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-3.5 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                            <span className="font-mono text-[11px] text-slate-500">#{o.id}</span>
                            <span className="text-[10px] bg-slate-200/60 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-600 dark:text-slate-300 font-medium">
                              {o.paymentMethod === 'promptpay' ? 'PromptPay' : (lang === 'th' ? 'เงินสด' : 'Cash')}
                            </span>
                          </div>

                          {/* Order Status Visual Tracker */}
                          <OrderStatusTracker
                            order={o}
                            lang={lang}
                            isSimple={isSimple}
                            onRefresh={fetchUserOrders}
                          />
                          
                          {/* Items summary */}
                          <div className="space-y-1.5 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                <span>{lang === 'th' ? item.nameTh : item.nameEn} x{item.quantity}</span>
                                <span>฿{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
                            <span className="font-bold text-slate-400">
                              {lang === 'th' ? "ยอดรวมทั้งสิ้น" : "Total"}
                            </span>
                            <span className="font-black text-rose-500 text-sm">฿{o.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

      </main>

      {/* FLOATING CART BUTTON (Bottom right, extremely accessible for one-handed use) */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-2 -right-2 bg-white text-rose-500 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-rose-500 shadow">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
        </button>
      )}

      {/* BOTTOM NAVIGATION TAB BAR (Perfect for mobile thumb reach) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800/80 px-2 py-2 transition-colors duration-300">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all active:scale-95 ${
              activeTab === 'home' 
                ? 'text-rose-500 font-extrabold' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">{t.navHome}</span>
          </button>

          {/* Menu Tab */}
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all active:scale-95 ${
              activeTab === 'menu' 
                ? 'text-rose-500 font-extrabold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Coffee className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">{t.navMenu}</span>
          </button>

          {/* Traditional Bags Tab */}
          <button
            onClick={() => setActiveTab('bags')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all active:scale-95 ${
              activeTab === 'bags' 
                ? 'text-rose-500 font-extrabold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">{t.navBags}</span>
          </button>

          {/* Map Tab */}
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all active:scale-95 ${
              activeTab === 'map' 
                ? 'text-rose-500 font-extrabold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[9px] tracking-tight">{t.navMap}</span>
          </button>

          {/* Admin / Profile Tab */}
          {currentUser?.isAdmin ? (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all active:scale-95 ${
                activeTab === 'admin' 
                  ? 'text-rose-500 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[9px] tracking-tight">{t.navAdmin}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all active:scale-95 ${
                activeTab === 'profile' 
                  ? 'text-rose-500 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[9px] tracking-tight">{t.navProfile}</span>
            </button>
          )}

        </div>
      </nav>

      {/* AUTHENTICATION MODAL */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        lang={lang} 
        onAuthSuccess={handleAuthSuccess} 
      />

      {/* CART DRAWER */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onUpdateQuantity={handleUpdateCartQuantity} 
        onClearCart={handleClearCart} 
        lang={lang} 
        currentUser={currentUser} 
        onLoginRequest={() => setIsAuthModalOpen(true)} 
        isSimple={isSimple}
      />

    </div>
  );
}

export default App;
