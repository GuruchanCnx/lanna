import { useState, useEffect, useRef } from 'react';
import { 
  Home as HomeIcon, Coffee, ShoppingBag, MapPin, ShieldCheck, 
  User, Sparkles, Phone, Check, Share2, Accessibility, 
  ChevronRight, Heart, ArrowRight, LogIn, LogOut, Trash2, Clock,
  Search, X, Camera, MessageSquare, Flame, Settings as SettingsIcon,
  RotateCcw, Filter, Calendar, Download, Menu, SlidersHorizontal, FileSpreadsheet
} from 'lucide-react';
import { translations, Language } from './lib/translations';
import { db } from './lib/firebaseMock';
import { Product, CartItem, Order, UserProfile, Category, OrderFeedback } from './lib/types';
import { MapComponent } from './components/MapComponent';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { SimpleModeToggle } from './components/SimpleModeToggle';
import { SocialShare } from './components/SocialShare';
import { OrderStatusTracker } from './components/OrderStatusTracker';
import { HeroImageModal } from './components/HeroImageModal';
import { OrderSpendingChart } from './components/OrderSpendingChart';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { LoyaltyPointsCard } from './components/LoyaltyPointsCard';
import { BestSellersPage } from './components/BestSellersPage';
import { OrderStatusToast, OrderStatusToastNotification } from './components/OrderStatusToast';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { OrderFeedbackCard } from './components/OrderFeedbackCard';
import { Admin } from './pages/Admin';
import { ProductCard } from './components/ProductCard';
import { CategoryDropdown } from './components/CategoryDropdown';
import { OneHandNavigation } from './components/OneHandNavigation';
import { playOrderReadyChime } from './lib/audioNotification';
import { exportOrdersToCSV } from './lib/exportCsv';

function App() {
  // Localization & Theme states
  const [lang, setLang] = useState<Language>('th');
  const [isSimple, setIsSimple] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'menu' | 'bestsellers' | 'bags' | 'map' | 'admin' | 'profile'>('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [csvSuccessAlert, setCsvSuccessAlert] = useState<boolean>(false);

  // Auth & Database states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Order History Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed'>('all');
  const [orderDateFilter, setOrderDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  // Order Success & Tracking Modal State
  const [recentOrderSuccess, setRecentOrderSuccess] = useState<Order | null>(null);
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);

  // Favorites & Menu filter states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [menuFilter, setMenuFilter] = useState<'all' | 'favorites' | Category>('all');

  // Search & Recent search states (stores last 3 searches)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Hero wall image state
  const [heroImage, setHeroImage] = useState<string>('/images/chiangmai-bag.png');
  const [isHeroModalOpen, setIsHeroModalOpen] = useState<boolean>(false);

  // Item customization state (for menu)
  const [selectedBevOptions, setSelectedBevOptions] = useState<Record<string, { temperature: 'hot' | 'cold', toppings: 'none' | 'with' }>>({});

  // Store Settings Modal state
  const [isStoreSettingsOpen, setIsStoreSettingsOpen] = useState(false);

  // In-app Order Status Toast Alert state
  const [orderToast, setOrderToast] = useState<OrderStatusToastNotification | null>(null);
  const previousStatusesRef = useRef<Record<string, string>>({});

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

    // Load saved hero wall image
    const storedHero = localStorage.getItem('fs_hero_image');
    if (storedHero) {
      setHeroImage(storedHero);
    }

    // Load saved recent searches (last 3 items)
    const storedRecent = localStorage.getItem('fs_recent_searches');
    if (storedRecent) {
      try {
        const parsed = JSON.parse(storedRecent);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 3));
        }
      } catch {
        setRecentSearches([]);
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

    // Detect status transitions to trigger in-app toast alerts & audio notification
    filtered.forEach((order) => {
      const prevStatus = previousStatusesRef.current[order.id];
      if (prevStatus && prevStatus !== order.status) {
        if (order.status === 'ready') {
          playOrderReadyChime();
        }
        setOrderToast({
          id: Math.random().toString(36).substring(2, 9),
          orderId: order.id,
          previousStatus: prevStatus,
          newStatus: order.status,
          timestamp: Date.now()
        });
      }
      previousStatusesRef.current[order.id] = order.status;
    });

    setUserOrders(filtered);
  };

  // Auto-dismiss order toast after 6 seconds
  useEffect(() => {
    if (orderToast) {
      const timer = setTimeout(() => {
        setOrderToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [orderToast]);

  // Poll for updates if there are active (non-completed) orders
  useEffect(() => {
    if (!currentUser) return;
    const hasActiveOrders = userOrders.some(o => o.status !== 'completed');
    if (!hasActiveOrders) return;

    const interval = setInterval(() => {
      fetchUserOrders();
    }, 3000);

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

  const handleSaveHeroImage = (newUrl: string) => {
    setHeroImage(newUrl);
    try {
      localStorage.setItem('fs_hero_image', newUrl);
    } catch (e) {
      console.warn('Could not save hero image to localStorage', e);
    }
  };

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      // Remove duplicate if exists (case-insensitive)
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      // Keep at most 3 items, newest at front
      const updated = [trimmed, ...filtered].slice(0, 3);
      try {
        localStorage.setItem('fs_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeRecentSearch = (term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      try {
        localStorage.setItem('fs_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('fs_recent_searches');
    } catch {
      // ignore
    }
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
    const isBeverageItem = product.isBeverage || ['beverages', 'soymilk', 'milk', 'drinks'].includes(product.category);
    const options = isBeverageItem
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

  // Reorder items from a previous order into current cart
  const handleReorder = (order: Order) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      order.items.forEach((item) => {
        const existingProduct = products.find((p) => p.id === item.productId) || {
          id: item.productId,
          nameTh: item.nameTh,
          nameEn: item.nameEn,
          price: item.price,
          category: 'snacks' as Category,
          stock: 99,
          image: '/images/chiangmai-bag.png',
          isBeverage: !!item.options
        };

        const existingIdx = updated.findIndex(
          (ci) => ci.product.id === item.productId && JSON.stringify(ci.options) === JSON.stringify(item.options)
        );

        if (existingIdx !== -1) {
          updated[existingIdx].quantity += item.quantity;
        } else {
          updated.push({
            product: existingProduct,
            quantity: item.quantity,
            vesselDiscount: item.vesselDiscount || false,
            options: item.options
          });
        }
      });
      return updated;
    });

    // Open Cart Drawer so user can immediately review and checkout
    setIsCartOpen(true);
  };

  // Helper to check if an order's createdAt is within chosen filter range
  const isWithinDateRange = (createdAt: string, range: 'all' | 'today' | '7days' | '30days') => {
    if (range === 'all') return true;
    const orderDate = new Date(createdAt);
    if (isNaN(orderDate.getTime())) return true;
    const now = new Date();

    if (range === 'today') {
      return (
        orderDate.getFullYear() === now.getFullYear() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getDate() === now.getDate()
      );
    }

    const diffMs = now.getTime() - orderDate.getTime();
    if (range === '7days') {
      return diffMs >= 0 && diffMs <= 7 * 24 * 60 * 60 * 1000;
    }
    if (range === '30days') {
      return diffMs >= 0 && diffMs <= 30 * 24 * 60 * 60 * 1000;
    }
    return true;
  };

  // Update state when feedback is saved for an order
  const handleFeedbackSaved = (orderId: string, feedback: OrderFeedback) => {
    setUserOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, feedback } : o))
    );
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

  // Render a single product card with favorite heart toggle and visual badges
  const renderProductCard = (p: Product) => (
    <ProductCard
      key={p.id}
      product={p}
      isSimple={isSimple}
      lang={lang}
      isFavorite={favorites.includes(p.id)}
      onToggleFavorite={handleToggleFavorite}
      onAddToCart={handleAddToCart}
      bevOptions={selectedBevOptions[p.id]}
      onOptionChange={handleOptionChange}
    />
  );

  // One-hand navigation thumb reachability handlers
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCategoryMenuFromThumb = () => {
    setActiveTab('menu');
    setTimeout(() => {
      const el = document.getElementById('category-dropdown-container');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFocusSearchFromThumb = () => {
    setActiveTab('menu');
    setTimeout(() => {
      const input = document.getElementById('menu-search-input') as HTMLInputElement;
      input?.focus();
      input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Filter products by search query
  const query = searchQuery.trim().toLowerCase();
  const searchedProducts = products.filter((p) => {
    if (!query) return true;
    const matchNameTh = p.nameTh?.toLowerCase().includes(query);
    const matchNameEn = p.nameEn?.toLowerCase().includes(query);
    const matchDescTh = p.descriptionTh?.toLowerCase().includes(query);
    const matchDescEn = p.descriptionEn?.toLowerCase().includes(query);
    return matchNameTh || matchNameEn || matchDescTh || matchDescEn;
  });

  const MENU_CATEGORIES: { id: Category; labelKey: keyof typeof t; icon: string; color: string; badgeColor: string }[] = [
    { id: 'snacks', labelKey: 'catSnacks', icon: '🥢', color: 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-500/30', badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-500/20' },
    { id: 'soymilk', labelKey: 'catSoymilk', icon: '🥛', color: 'bg-sky-500 text-white border-sky-500 ring-2 ring-sky-500/30', badgeColor: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-500/20' },
    { id: 'milk', labelKey: 'catMilk', icon: '🍶', color: 'bg-indigo-500 text-white border-indigo-500 ring-2 ring-indigo-500/30', badgeColor: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/20' },
    { id: 'drinks', labelKey: 'catDrinks', icon: '🧋', color: 'bg-orange-500 text-white border-orange-500 ring-2 ring-orange-500/30', badgeColor: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-500/20' },
    { id: 'ginger', labelKey: 'catGinger', icon: '🫚', color: 'bg-emerald-500 text-white border-emerald-500 ring-2 ring-emerald-500/30', badgeColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/20' },
    { id: 'toast', labelKey: 'catToast', icon: '🍞', color: 'bg-yellow-500 text-white border-yellow-500 ring-2 ring-yellow-500/30', badgeColor: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-500/20' },
    { id: 'sauces', labelKey: 'catSauces', icon: '🍯', color: 'bg-teal-500 text-white border-teal-500 ring-2 ring-teal-500/30', badgeColor: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-500/20' },
    { id: 'toppings', labelKey: 'catToppings', icon: '✨', color: 'bg-purple-500 text-white border-purple-500 ring-2 ring-purple-500/30', badgeColor: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-500/20' },
    { id: 'bags', labelKey: 'catBags', icon: '🛍️', color: 'bg-rose-500 text-white border-rose-500 ring-2 ring-rose-500/30', badgeColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-500/20' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {/* TOP HEADER BAR (Modern, user-friendly, responsive) */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-4 py-2.5 transition-colors">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Brand Logo & Hours Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              onClick={() => {
                setActiveTab('home');
                setIsMobileNavOpen(false);
              }} 
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer active:scale-95 transition-all group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
                <Coffee className="w-5 h-5 animate-pulse" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <h1 className="font-black text-xs sm:text-sm tracking-tight text-slate-900 dark:text-white uppercase truncate">
                    {lang === 'th' ? "หายยา" : "Haiya"}
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex-shrink-0">
                    {lang === 'th' ? 'วัวลาย ซ.2' : 'Wua Lai'}
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] font-bold text-rose-500 tracking-wider hidden xs:block truncate">
                  {lang === 'th' ? "น้ำเต้าหู้ & ปาท่องโก๋" : "Soy Milk & Pa Thong Ko"}
                </p>
              </div>
            </div>

            {/* Subtle Desktop Open Hours Status Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{lang === 'th' ? 'เปิดบริการ 06:00-22:00' : 'Open: 06:00-22:00'}</span>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs ONLY on large desktop (lg:flex) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>{t.navHome}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{t.navMenu}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bestsellers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'bestsellers' || activeTab === 'bags'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.navBestSellers}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.navMap}</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Search Button (All screens) */}
            <button
              type="button"
              onClick={handleFocusSearchFromThumb}
              title={t.navSearch}
              className="p-2 sm:px-2.5 sm:py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all active:scale-95 cursor-pointer shadow-xs border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden xl:inline text-xs font-bold">{t.navSearch}</span>
            </button>

            {/* Cart Button (All screens) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="px-2.5 py-2 sm:px-3 sm:py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs transition-all active:scale-95 cursor-pointer shadow-sm shadow-rose-500/20 flex items-center gap-1.5 sm:gap-2"
              title={t.cart}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-rose-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                ฿{cart.reduce((sum, item) => sum + (item.product.price - (item.vesselDiscount ? 2 : 0)) * item.quantity, 0)}
              </span>
            </button>

            {/* Desktop-only: Accessibility & Theme & Store Settings Group */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-0.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              {/* Senior Mode Toggle */}
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

              {/* Store Settings Button */}
              <button
                type="button"
                onClick={() => setIsStoreSettingsOpen(true)}
                title={lang === 'th' ? "ตั้งค่าพร้อมเพย์และโซเชียลมีเดีย" : "Store & PromptPay Settings"}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95 cursor-pointer"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Desktop-only: Profile Avatar / Login */}
            <div className="hidden lg:block">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-2xl font-bold text-xs transition-all cursor-pointer border shadow-xs ${
                    activeTab === 'profile'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/25'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border-rose-500/20'
                  }`}
                  title={`${currentUser.displayName} (${currentUser.provider})`}
                >
                  <img
                    src={currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
                    alt={currentUser.displayName}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-white/50"
                  />
                  <span className="max-w-[80px] truncate">{currentUser.displayName.split(' ')[0]}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-2 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-sm flex items-center gap-1.5"
                  title="OAuth 2.0 Login / Demo Admin"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.login}</span>
                </button>
              )}
            </div>

            {/* Mobile & Tablet (< lg): Clean Quick Menu & Settings Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className={`lg:hidden p-2 rounded-2xl border transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs ${
                isMobileNavOpen
                  ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200'
              }`}
              aria-label={t.quickMenu || 'Menu & Settings'}
            >
              {isMobileNavOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
              {currentUser && !isMobileNavOpen && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              )}
            </button>
          </div>

        </div>

        {/* MOBILE & TABLET EXPANDED NAVIGATION & SETTINGS DRAWER (< lg) */}
        {isMobileNavOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-6xl mx-auto space-y-3">
              
              {/* 1. Primary Navigation Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('home');
                    setIsMobileNavOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    activeTab === 'home'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>{t.navHome}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('menu');
                    setIsMobileNavOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    activeTab === 'menu'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Coffee className="w-4 h-4" />
                  <span>{t.navMenu}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('bestsellers');
                    setIsMobileNavOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    activeTab === 'bestsellers' || activeTab === 'bags'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>{t.navBestSellers}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('map');
                    setIsMobileNavOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    activeTab === 'map'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>{t.navMap}</span>
                </button>
              </div>

              {/* 2. User Account & Preferences Card */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                {/* User Profile Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  {currentUser ? (
                    <div 
                      onClick={() => {
                        setActiveTab('profile');
                        setIsMobileNavOpen(false);
                      }}
                      className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
                        alt={currentUser.displayName}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-500/30"
                      />
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white leading-tight">
                          {currentUser.displayName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {currentUser.email || currentUser.provider}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {lang === 'th' ? 'ยังไม่ได้เข้าสู่ระบบ' : 'Guest User'}
                      </span>
                    </div>
                  )}

                  {currentUser ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('profile');
                        setIsMobileNavOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[11px] border border-rose-500/20 cursor-pointer"
                    >
                      {lang === 'th' ? 'ดูโปรไฟล์' : 'Profile'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMobileNavOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{t.login}</span>
                    </button>
                  )}
                </div>

                {/* Preferences Controls Row */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Language Switch */}
                    <LanguageToggle 
                      lang={lang} 
                      onChange={handleLanguageChange} 
                    />

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Senior Mode Toggle */}
                    <SimpleModeToggle 
                      isSimple={isSimple} 
                      onChange={handleSimpleModeChange} 
                      lang={lang} 
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Store & PromptPay Settings Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsStoreSettingsOpen(true);
                        setIsMobileNavOpen(false);
                      }}
                      className="p-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer hover:border-rose-400"
                    >
                      <SettingsIcon className="w-3 h-3 text-rose-500" />
                      <span>{lang === 'th' ? 'ตั้งค่าร้าน' : 'Settings'}</span>
                    </button>

                    {/* Direct phone call button */}
                    <a
                      href="tel:0812345678"
                      className="p-1.5 px-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span className="hidden xs:inline">081-234-5678</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
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
            {/* 1. HERO WALL LANDING PAGE HEADER WITH SALES CATCHPHRASE */}
            <div className="text-center space-y-3 max-w-3xl mx-auto pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black tracking-wide border border-rose-500/20 shadow-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>{t.tagline}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
                {t.heroCatchphrase}
              </h2>

              <p className="text-xs sm:text-sm md:text-base font-bold text-rose-600 dark:text-rose-400 tracking-wide max-w-2xl mx-auto">
                {t.heroSalesSubphrase}
              </p>
            </div>

            {/* 2. CINEMATIC HERO WALL IMAGE CENTERPIECE WITH SALES OVERLAYS & CTA */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 group min-h-[340px] sm:min-h-[420px] md:min-h-[460px] flex flex-col justify-between p-4 sm:p-6 md:p-8">
              {/* Background Hero Image */}
              <img 
                src={heroImage} 
                alt="Chiang Mai Soy Milk & Culture" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/50 pointer-events-none" />

              {/* Top Floating Badges */}
              <div className="relative z-10 flex items-start justify-between gap-2">
                <div className="px-3 py-1.5 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/20 text-white flex items-center gap-2 shadow-lg">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-black tracking-wide">
                    {lang === 'th' ? '🔥 เตาต้มสดเปิดบริการ: เช้า 06:00-11:00 • เย็น 16:00-22:00' : '🔥 Kitchen Open: Morning 06:00-11:00 • Evening 16:00-22:00'}
                  </span>
                </div>

                {/* Hero Wall Image Edit/Upload Trigger */}
                <button
                  type="button"
                  onClick={() => setIsHeroModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold rounded-2xl backdrop-blur-md shadow-lg border border-white/20 transition-all active:scale-95 hover:scale-105 cursor-pointer"
                  title={t.editHeroImage}
                  aria-label={t.editHeroImage}
                >
                  <Camera className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">{t.editHeroImage}</span>
                </button>
              </div>

              {/* Bottom Hero Overlay: Sales Prompt & Primary Conversion Actions */}
              <div className="relative z-10 space-y-4 max-w-2xl mt-auto pt-8">
                {/* Save 2 Baht Vessel Callout Banner */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/90 text-white rounded-xl text-xs font-black shadow-lg backdrop-blur-md">
                  <Coffee className="w-4 h-4 animate-bounce" />
                  <span>{t.bringVesselTitle} — {lang === 'th' ? 'พกกระบอกน้ำมาเอง ลดทันที 2.- ทุกแก้ว!' : 'Bring your own cup, save 2฿ per cup!'}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
                    {lang === 'th' ? 'ปาท่องโก๋สะบัดน้ำมัน & น้ำเต้าหู้ทรงเครื่องร้อนๆ' : 'Crispy Artisanal Donuts & Steaming Hot Soy Milk'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow font-medium">
                    {lang === 'th' 
                      ? 'สูตรโบราณดั้งเดิมเชียงใหม่ วัตถุดิบธรรมชาติแท้ 100% พร้อมเสิร์ฟถึงมือคุณ'
                      : 'Authentic Chiang Mai heritage recipe, 100% natural, freshly prepared to order.'}
                  </p>
                </div>

                {/* Conversion Buttons on Hero */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-500/30 transition-all flex items-center gap-2 active:scale-95 text-xs sm:text-sm cursor-pointer"
                  >
                    <span>{t.heroCtaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('bestsellers')}
                    className="px-5 py-3.5 bg-white/90 hover:bg-white text-slate-900 font-black rounded-2xl shadow-xl backdrop-blur-md transition-all flex items-center gap-2 active:scale-95 text-xs sm:text-sm cursor-pointer"
                  >
                    <span>{t.heroSecondaryCta}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. EDITORIAL SECTION: SOY MILK HEALTH BENEFITS & NUTRITION */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-black self-start">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'th' ? 'สาระน่ารู้ด้านโภชนาการ' : 'Nutritional Editorial'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
                  {t.heroEditorialTitle}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {t.slogan}
                </p>
              </div>

              {/* 3 Soy Milk Health & Nutrition Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-xs text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{lang === 'th' ? 'โปรตีนพืชสมบูรณ์' : 'Complete Protein'}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {t.soymilkBenefitPill1}
                  </p>
                </div>

                <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-xs text-amber-700 dark:text-amber-300">
                    <Heart className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{lang === 'th' ? 'หัวใจ & หลอดเลือด' : 'Cardiovascular'}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {t.soymilkBenefitPill2}
                  </p>
                </div>

                <div className="p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-xs text-rose-700 dark:text-rose-300">
                    <Sparkles className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{lang === 'th' ? '0% แลคโตส ย่อยง่าย' : '0% Lactose Digestion'}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {t.soymilkBenefitPill3}
                  </p>
                </div>
              </div>

              {/* Trust Points Strip */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-around gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{lang === 'th' ? 'ปรุงสดใหม่ทุกออเดอร์' : 'Cooked Fresh to Order'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{lang === 'th' ? 'สแกนพร้อมเพย์สะดวก รวดเร็ว' : 'Fast PromptPay QR'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{lang === 'th' ? 'สาขาถนนวัวลาย ซอย 2 เชียงใหม่' : 'Wua Lai Road Soi 2, Chiang Mai'}</span>
                </div>
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
            {/* Search Input Bar & Recent Searches */}
            <div className="space-y-3">
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="menu-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      addRecentSearch(searchQuery.trim());
                    }
                  }}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-11 pr-24 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 shadow-sm transition-all"
                />
                <div className="absolute right-2.5 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      title={t.clearSearch}
                      aria-label={t.clearSearch}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        addRecentSearch(searchQuery.trim());
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    {lang === 'th' ? 'ค้นหา' : 'Search'}
                  </button>
                </div>
              </div>

              {/* Recent Searches (Stores and displays the last 3 items) */}
              {recentSearches.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {t.recentSearches}:
                  </span>
                  {recentSearches.slice(0, 3).map((term) => (
                    <div
                      key={term}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-medium text-xs hover:border-rose-400 hover:text-rose-500 shadow-sm transition-all group"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery(term);
                          addRecentSearch(term);
                        }}
                        className="cursor-pointer text-xs font-medium"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(term);
                        }}
                        className="text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors ml-0.5 cursor-pointer"
                        title={lang === 'th' ? 'ลบคำค้นหานี้' : 'Remove search term'}
                        aria-label={`Remove ${term}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={clearAllRecentSearches}
                    className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors underline ml-1 cursor-pointer font-medium"
                  >
                    {t.clearSearch}
                  </button>
                </div>
              )}
            </div>

            {/* Active search query status banner */}
            {query && (
              <div className="flex items-center justify-between px-4 py-2.5 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{t.searchResults}: </span>
                  <span className="text-rose-600 dark:text-rose-400 font-extrabold">"{searchQuery}"</span>
                  <span className="text-slate-400 ml-1.5 font-normal">({searchedProducts.length} {t.itemsCount})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
                >
                  {t.clearSearch}
                </button>
              </div>
            )}

            {/* Zero results state if search produces no matches */}
            {query && searchedProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 text-center space-y-4 shadow-sm my-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-lg text-slate-800 dark:text-white">
                    {t.noSearchResults}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t.tryOtherKeywords}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {t.clearSearch}
                </button>
              </div>
            ) : (
              <>
                {/* Category Dropdown Selection (Replacing Horizontal Sliding Menu) */}
                <div id="category-dropdown-container" className="pt-1 pb-1">
                  <CategoryDropdown
                    activeCategory={menuFilter}
                    onSelectCategory={(catId) => setMenuFilter(catId as any)}
                    searchedProducts={searchedProducts}
                    favoritesCount={favorites.length}
                    categories={MENU_CATEGORIES}
                    lang={lang}
                    isSimple={isSimple}
                  />
                </div>

                {/* Product categories list or Favorites view */}
                {menuFilter === 'favorites' ? (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b pb-2 border-rose-500/10">
                      <h3 className={`font-black tracking-tight text-rose-500 flex items-center gap-2 ${isSimple ? 'text-xl' : 'text-base'}`}>
                        <Heart className="w-5 h-5 fill-current animate-pulse text-rose-500" />
                        <span>{t.catFavorites} ({searchedProducts.filter(p => favorites.includes(p.id)).length})</span>
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
                          className="text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          {lang === 'th' ? "ล้างรายการโปรดทั้งหมด" : "Clear all"}
                        </button>
                      )}
                    </div>

                    {searchedProducts.filter(p => favorites.includes(p.id)).length === 0 ? (
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
                          className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          {lang === 'th' ? "ดูเมนูทั้งหมด" : "Browse Full Menu"}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchedProducts.filter(p => favorites.includes(p.id)).map(renderProductCard)}
                      </div>
                    )}
                  </div>
                ) : (
                  MENU_CATEGORIES
                    .filter(catItem => menuFilter === 'all' || menuFilter === catItem.id)
                    .map((catItem) => {
                      const catProducts = searchedProducts.filter(p => p.category === catItem.id);
                      if (catProducts.length === 0) return null;

                      return (
                        <div key={catItem.id} id={`cat-section-${catItem.id}`} className="space-y-4 pt-4">
                          <div className="flex items-center justify-between border-b pb-2 border-slate-200/60 dark:border-slate-800">
                            <h3 className={`font-black tracking-tight flex items-center gap-2 ${isSimple ? 'text-xl' : 'text-base'}`}>
                              <span className="text-lg">{catItem.icon}</span>
                              <span className="text-slate-900 dark:text-white font-extrabold">
                                {t[catItem.labelKey] as string}
                              </span>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${catItem.badgeColor}`}>
                                {catProducts.length} {t.itemsCount}
                              </span>
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {catProducts.map(renderProductCard)}
                          </div>
                        </div>
                      );
                    })
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 3: BEST SELLERS PRODUCT PAGE (Replacing Lanna Bags) */}
        {(activeTab === 'bestsellers' || activeTab === 'bags') && (
          <BestSellersPage
            products={products}
            lang={lang}
            isSimple={isSimple}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            selectedBevOptions={selectedBevOptions}
            onSelectOption={handleOptionChange}
          />
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
                  className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-500/20 transition-all active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{lang === 'th' ? "เข้าสู่ระบบด้วย OAuth 2.0 / Admin Demo" : "Sign In with OAuth 2.0 / Admin Demo"}</span>
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
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                        currentUser.provider === 'google'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : currentUser.provider === 'apple'
                          ? 'bg-slate-500/10 text-slate-800 dark:text-slate-200 border border-slate-500/20'
                          : currentUser.provider === 'line'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : currentUser.provider === 'facebook'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                        <span>OAuth:</span>
                        <span>{currentUser.provider}</span>
                      </span>
                      {currentUser.isAdmin && (
                        <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase border border-emerald-500/30">
                          Admin Demo Access
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

                {/* Loyalty Points System (Calculates and displays points earned from total spending) */}
                <LoyaltyPointsCard currentUser={currentUser} orders={userOrders} lang={lang} />

                {/* Order Spending Chart (Recharts visualization) */}
                <OrderSpendingChart orders={userOrders} lang={lang} />

                {/* Order History with Status & Date Filtering */}
                {(() => {
                  const filteredOrders = userOrders.filter((o) => {
                    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                    const matchesDate = isWithinDateRange(o.createdAt, orderDateFilter);
                    return matchesStatus && matchesDate;
                  });

                  const handleExportOrdersToCsv = () => {
                    if (filteredOrders.length === 0) return;
                    const ok = exportOrdersToCSV(filteredOrders, lang);
                    if (ok) {
                      setCsvSuccessAlert(true);
                      setTimeout(() => setCsvSuccessAlert(false), 5000);
                    }
                  };

                  return (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-rose-500" />
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                            {lang === 'th' ? "ประวัติการสั่งซื้อของคุณ" : "Your Order History"}
                          </h4>
                          <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {filteredOrders.length !== userOrders.length ? `${filteredOrders.length}/${userOrders.length}` : userOrders.length}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {(orderStatusFilter !== 'all' || orderDateFilter !== 'all') && (
                            <button
                              type="button"
                              onClick={() => {
                                setOrderStatusFilter('all');
                                setOrderDateFilter('all');
                              }}
                              className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>{lang === 'th' ? "ล้างตัวกรอง" : "Reset"}</span>
                            </button>
                          )}

                          {/* Export to CSV Button */}
                          <button
                            type="button"
                            onClick={handleExportOrdersToCsv}
                            disabled={filteredOrders.length === 0}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                              filteredOrders.length > 0
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200/50 dark:border-slate-800'
                            }`}
                            title={t.exportCsv || (lang === 'th' ? "ส่งออกเป็น CSV เพื่อบันทึกค่าใช้จ่าย" : "Export to CSV to track spending")}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.exportCsv || (lang === 'th' ? "ส่งออก CSV" : "Export CSV")}</span>
                            {filteredOrders.length > 0 && (
                              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-white/20 text-white">
                                {filteredOrders.length}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Export CSV Success Alert Banner */}
                      {csvSuccessAlert && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in zoom-in-95">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span>{t.exportCsvSuccess || (lang === 'th' ? 'ดาวน์โหลดไฟล์ CSV สำหรับติดตามค่าใช้จ่ายเรียบร้อยแล้ว!' : 'Order history successfully exported to CSV!')}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setCsvSuccessAlert(false)}
                            className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Filter Controls Bar */}
                  {userOrders.length > 0 && (
                    <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      {/* 1. Status Filter Pills */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <Filter className="w-3 h-3 text-rose-500" />
                          <span>{lang === 'th' ? "สถานะคำสั่งซื้อ:" : "Filter by Status:"}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All', count: userOrders.length },
                            { id: 'pending', labelTh: 'รอยืนยัน', labelEn: 'Pending', count: userOrders.filter(o => o.status === 'pending').length },
                            { id: 'preparing', labelTh: 'กำลังปรุง', labelEn: 'Preparing', count: userOrders.filter(o => o.status === 'preparing').length },
                            { id: 'ready', labelTh: 'พร้อมรับ', labelEn: 'Ready', count: userOrders.filter(o => o.status === 'ready').length },
                            { id: 'completed', labelTh: 'เสร็จสิ้น', labelEn: 'Completed', count: userOrders.filter(o => o.status === 'completed').length },
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setOrderStatusFilter(item.id as any)}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                                orderStatusFilter === item.id
                                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300'
                              }`}
                            >
                              <span>{lang === 'th' ? item.labelTh : item.labelEn}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                                orderStatusFilter === item.id
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                              }`}>
                                {item.count}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Date Range Filter Pills */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span>{lang === 'th' ? "ช่วงเวลา:" : "Filter by Date Range:"}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'all', labelTh: 'ทุกช่วงเวลา', labelEn: 'All Time' },
                            { id: 'today', labelTh: 'วันนี้', labelEn: 'Today' },
                            { id: '7days', labelTh: '7 วันล่าสุด', labelEn: 'Past 7 Days' },
                            { id: '30days', labelTh: '30 วันล่าสุด', labelEn: 'Past 30 Days' },
                          ].map((range) => (
                            <button
                              key={range.id}
                              type="button"
                              onClick={() => setOrderDateFilter(range.id as any)}
                              className={`text-[11px] font-bold px-3 py-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
                                orderDateFilter === range.id
                                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300'
                              }`}
                            >
                              <span>{lang === 'th' ? range.labelTh : range.labelEn}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render Orders List or Empty States */}
                  {userOrders.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 italic">
                      {lang === 'th' ? "ไม่มีประวัติการสั่งซื้อ" : "No orders placed yet."}
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                      <Filter className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {lang === 'th' ? "ไม่พบคำสั่งซื้อที่ตรงกับตัวกรองที่เลือก" : "No orders match your selected filters"}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {lang === 'th' ? "ลองปรับเปลี่ยนสถานะหรือช่วงเวลาการสั่งซื้อ" : "Try adjusting the status or date range filter"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderStatusFilter('all');
                          setOrderDateFilter('all');
                        }}
                        className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{lang === 'th' ? "รีเซ็ตตัวกรองทั้งหมด" : "Clear All Filters"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                      {filteredOrders.map((o) => {
                          const orderDateObj = new Date(o.createdAt);
                          const dateDisplay = !isNaN(orderDateObj.getTime())
                            ? orderDateObj.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : o.createdAt;

                          return (
                            <div key={o.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-3.5 shadow-sm">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">#{o.id}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    • {dateDisplay}
                                  </span>
                                </div>
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

                              {/* Special Requests & Allergy Note if present */}
                              {o.specialInstructions && (
                                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2 text-xs">
                                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <span className="font-extrabold text-[11px] text-amber-800 dark:text-amber-300">
                                      {lang === 'th' ? "คำขอพิเศษ / แพ้อาหาร:" : "Special Requests / Allergies:"}
                                    </span>{' '}
                                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                                      {o.specialInstructions}
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Items summary */}
                              <div className="space-y-1.5 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                                {o.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-1.5">
                                      <span>{lang === 'th' ? item.nameTh : item.nameEn}</span>
                                      <span className="text-slate-400 text-[11px]">x{item.quantity}</span>
                                      {item.options && (
                                        <span className="text-[10px] text-rose-500 bg-rose-500/10 px-1.5 py-0.2 rounded font-medium">
                                          {item.options.temperature === 'hot' ? (lang === 'th' ? 'ร้อน' : 'Hot') : (lang === 'th' ? 'เย็น' : 'Cold')}
                                          {item.options.toppings === 'with' ? (lang === 'th' ? '+เครื่อง' : '+Toppings') : ''}
                                        </span>
                                      )}
                                    </div>
                                    <span>฿{item.price * item.quantity}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Order Card Footer: Total and Reorder Button */}
                              <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
                                <div>
                                  <span className="font-bold text-slate-400 text-[11px] block">
                                    {lang === 'th' ? "ยอดรวมทั้งสิ้น" : "Total"}
                                  </span>
                                  <span className="font-black text-rose-500 text-sm">฿{o.total}</span>
                                </div>

                                {/* Reorder Button - Prominently available for completed orders */}
                                {o.status === 'completed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleReorder(o)}
                                    className={`px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black transition-all active:scale-95 shadow-md shadow-rose-500/20 flex items-center gap-1.5 cursor-pointer ${
                                      isSimple ? 'text-sm py-2.5 px-4' : 'text-xs'
                                    }`}
                                    title={lang === 'th' ? "สั่งซ้ำ: ใส่เมนูและตัวเลือกจากออเดอร์นี้ลงในตะกร้า" : "Reorder: add exact items & options to cart"}
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>{lang === 'th' ? "สั่งซ้ำ (Reorder)" : "Reorder"}</span>
                                  </button>
                                )}
                              </div>

                              {/* Post-order feedback component for completed orders (ratings & comments saved to Firestore) */}
                              {o.status === 'completed' && (
                                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                                  <OrderFeedbackCard
                                    order={o}
                                    lang={lang}
                                    isSimple={isSimple}
                                    onFeedbackSaved={handleFeedbackSaved}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
              </>
            )}
          </div>
        )}

      </main>

      {/* FLOATING CART BUTTON (DESKTOP & TABLETS) */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-20 right-6 z-40 hidden md:flex items-center gap-3 bg-rose-500 hover:bg-rose-600 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 animate-fade-in cursor-pointer border border-white/20"
          title={lang === 'th' ? "ดูตะกร้าสินค้า" : "View Cart"}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 animate-bounce" />
            <span className="absolute -top-2 -right-2 bg-white text-rose-500 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-rose-500 shadow">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <span className="text-sm font-black">
            ฿{cart.reduce((sum, item) => sum + (item.product.price - (item.vesselDiscount ? 2 : 0)) * item.quantity, 0)}
          </span>
        </button>
      )}

      {/* MOBILE ONE-HAND NAVIGATION CAPABILITY */}
      <OneHandNavigation
        lang={lang}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        cartTotal={cart.reduce((sum, item) => sum + (item.product.price - (item.vesselDiscount ? 2 : 0)) * item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCategoryMenu={handleOpenCategoryMenuFromThumb}
        onScrollToTop={handleScrollToTop}
        onFocusSearch={handleFocusSearchFromThumb}
        activeCategoryName={
          menuFilter === 'all' 
            ? (lang === 'th' ? 'เมนูทั้งหมด' : 'All Menu')
            : menuFilter === 'favorites'
            ? t.catFavorites
            : (() => {
                const found = MENU_CATEGORIES.find(c => c.id === menuFilter);
                return found ? ((t as unknown as Record<string, string>)[found.labelKey] || found.id) : '';
              })()
        }
        isSimple={isSimple}
      />

      {/* BOTTOM NAVIGATION TAB BAR (Optimized for one-handed thumb reach) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 px-2 py-2 transition-colors duration-300 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
              activeTab === 'home' 
                ? 'text-rose-500 font-extrabold bg-rose-50/50 dark:bg-rose-950/30' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <HomeIcon className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">{t.navHome}</span>
          </button>

          {/* Menu Tab */}
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
              activeTab === 'menu' 
                ? 'text-rose-500 font-extrabold bg-rose-50/50 dark:bg-rose-950/30' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Coffee className={`w-5 h-5 transition-transform ${activeTab === 'menu' ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">{t.navMenu}</span>
          </button>

          {/* Best Sellers Tab */}
          <button
            onClick={() => setActiveTab('bestsellers')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
              activeTab === 'bestsellers' || activeTab === 'bags'
                ? 'text-rose-500 font-extrabold bg-rose-50/50 dark:bg-rose-950/30' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Flame className={`w-5 h-5 transition-transform ${activeTab === 'bestsellers' || activeTab === 'bags' ? 'scale-110 text-amber-500' : ''}`} />
            <span className="text-[10px] tracking-tight">{t.navBestSellers}</span>
          </button>

          {/* Map Tab */}
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
              activeTab === 'map' 
                ? 'text-rose-500 font-extrabold bg-rose-50/50 dark:bg-rose-950/30' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <MapPin className={`w-5 h-5 transition-transform ${activeTab === 'map' ? 'scale-110' : ''}`} />
            <span className="text-[10px] tracking-tight">{t.navMap}</span>
          </button>

          {/* Admin / Profile Tab */}
          {currentUser?.isAdmin ? (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
                activeTab === 'admin' 
                  ? 'text-rose-500 font-extrabold bg-rose-50/50 dark:bg-rose-950/30' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 transition-transform ${activeTab === 'admin' ? 'scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight">{t.navAdmin}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-2xl transition-all active:scale-90 cursor-pointer ${
                activeTab === 'profile' 
                  ? 'text-rose-500 font-extrabold bg-rose-50/50 dark:bg-rose-950/30' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <User className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-110' : ''}`} />
              <span className="text-[10px] tracking-tight">{t.navProfile}</span>
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
        onOrderSuccess={(order) => {
          setRecentOrderSuccess(order);
          setIsOrderSuccessModalOpen(true);
          setIsCartOpen(false);
          fetchUserOrders();
        }}
      />

      {/* HERO IMAGE EDIT & UPLOAD MODAL */}
      <HeroImageModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        currentImage={heroImage}
        onSave={handleSaveHeroImage}
        lang={lang}
      />

      {/* ORDER SUCCESS MODAL */}
      <OrderSuccessModal
        isOpen={isOrderSuccessModalOpen}
        order={recentOrderSuccess}
        onClose={() => setIsOrderSuccessModalOpen(false)}
        onTrackOrder={() => {
          setIsOrderSuccessModalOpen(false);
          setActiveTab('profile');
        }}
        lang={lang}
      />

      {/* IN-APP REALTIME ORDER STATUS TOAST NOTIFICATION */}
      <OrderStatusToast
        notification={orderToast}
        onClose={() => setOrderToast(null)}
        onViewOrder={() => {
          setOrderToast(null);
          setActiveTab('profile');
        }}
        lang={lang}
      />

      {/* STORE SETTINGS MODAL (PromptPay & Social Media Settings) */}
      <StoreSettingsModal
        isOpen={isStoreSettingsOpen}
        onClose={() => setIsStoreSettingsOpen(false)}
        lang={lang}
      />

    </div>
  );
}

export default App;
