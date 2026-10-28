import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Plus, Minus, Check, ArrowRight, ShieldCheck, 
  Clock, ArrowUpRight, Upload, Sparkles, Coffee, AlertCircle, RefreshCw, CheckCircle,
  MessageSquare
} from 'lucide-react';
import { translations, Language } from '../lib/translations';
import { CartItem, Order, UserProfile } from '../lib/types';
import { db } from '../lib/firebaseMock';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, options: any, delta: number) => void;
  onClearCart: () => void;
  lang: Language;
  currentUser: UserProfile | null;
  onLoginRequest: () => void;
  isSimple: boolean;
  onOrderSuccess?: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
  lang,
  currentUser,
  onLoginRequest,
  isSimple,
  onOrderSuccess
}) => {
  const t = translations[lang];
  const [bringVessel, setBringVessel] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'cash'>('promptpay');
  const [step, setStep] = useState<'cart' | 'checkout' | 'tracking'>('cart');
  const [receipt, setFormReceipt] = useState<string>('');
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [countdown, setCountdown] = useState(180); // 3 minutes for PromptPay
  const [trackingStatus, setTrackingStatus] = useState<'pending' | 'preparing' | 'ready' | 'completed'>('pending');

  // Calculate totals - count all beverages (soymilk, milk, drinks, beverages)
  const beverageCount = cart.reduce((sum, item) => {
    return item.product.isBeverage || ['beverages', 'soymilk', 'milk', 'drinks'].includes(item.product.category) 
      ? sum + item.quantity 
      : sum;
  }, 0);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const vesselDiscount = bringVessel ? beverageCount * 2 : 0;
  const total = Math.max(0, subtotal - vesselDiscount);

  // PromptPay countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && step === 'checkout' && paymentMethod === 'promptpay' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, step, paymentMethod, countdown]);

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      onLoginRequest();
      return;
    }

    if (paymentMethod === 'promptpay' && !receipt) {
      return;
    }

    // Create Order Object
    const orderData: Omit<Order, 'id'> = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      items: cart.map(item => ({
        productId: item.product.id,
        nameTh: item.product.nameTh,
        nameEn: item.product.nameEn,
        price: item.product.price,
        quantity: item.quantity,
        vesselDiscount: bringVessel && (item.product.isBeverage || ['beverages', 'soymilk', 'milk', 'drinks'].includes(item.product.category)),
        options: item.options
      })),
      subtotal,
      discount: vesselDiscount,
      total,
      paymentMethod,
      paymentSlip: receipt || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
      specialInstructions: specialInstructions.trim() || undefined
    };

    try {
      const newOrder = await db.collection('orders').add(orderData) as Order;
      setActiveOrder(newOrder);
      setTrackingStatus('pending');
      setStep('tracking');
      onOrderSuccess?.(newOrder);
      
      // Simulate Order Status Updates
      simulateOrderStatusFlow(newOrder.id);
    } catch (err) {
      console.error(err);
    }
  };

  const simulateOrderStatusFlow = (orderId: string) => {
    // Stage 1: Preparing (after 6 seconds)
    setTimeout(async () => {
      setTrackingStatus('preparing');
      await db.collection('orders').doc(orderId).set({ status: 'preparing' });
    }, 6000);

    // Stage 2: Ready (after 15 seconds)
    setTimeout(async () => {
      setTrackingStatus('ready');
      await db.collection('orders').doc(orderId).set({ status: 'ready' });
    }, 15000);

    // Stage 3: Completed (after 25 seconds)
    setTimeout(async () => {
      setTrackingStatus('completed');
      await db.collection('orders').doc(orderId).set({ status: 'completed' });
    }, 25000);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptUploading(true);
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormReceipt(reader.result as string);
        setReceiptUploading(false);
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  const handleReset = () => {
    onClearCart();
    setStep('cart');
    setBringVessel(false);
    setSpecialInstructions('');
    setFormReceipt('');
    setActiveOrder(null);
    setCountdown(180);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-100 dark:border-slate-800 transition-all duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <h3 className="font-black text-lg text-slate-800 dark:text-white">
              {step === 'cart' && t.cart}
              {step === 'checkout' && t.checkout}
              {step === 'tracking' && t.orderStatus}
            </h3>
            {cart.length > 0 && step === 'cart' && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={step === 'tracking' ? handleReset : onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CART STEP */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 text-slate-300 dark:text-slate-700 rounded-full inline-block">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    {t.emptyCart}
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex gap-3 items-center ${
                          isSimple ? 'border-2 border-slate-200 dark:border-slate-700' : ''
                        }`}
                      >
                        <img src={item.product.image} alt={item.product.nameEn} className="w-12 h-12 rounded-xl object-cover bg-white" />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-extrabold text-slate-800 dark:text-white truncate ${isSimple ? 'text-base' : 'text-xs'}`}>
                            {lang === 'th' ? item.product.nameTh : item.product.nameEn}
                          </h4>
                          
                          {/* Options description */}
                          {item.options && (
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                              {item.options.temperature === 'hot' ? t.hot : t.cold}
                              {item.options.toppings === 'with' ? ` • ${t.withToppings}` : ''}
                            </div>
                          )}

                          <div className={`font-black text-rose-500 mt-1 ${isSimple ? 'text-sm' : 'text-xs'}`}>
                            ฿{item.product.price}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.options, -1)}
                            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isSimple ? 'p-2.5' : ''}`}
                          >
                            <Minus className="w-3 h-3 text-slate-500" />
                          </button>
                          <span className={`font-black text-slate-800 dark:text-white min-w-[16px] text-center ${isSimple ? 'text-base' : 'text-xs'}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.options, 1)}
                            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isSimple ? 'p-2.5' : ''}`}
                          >
                            <Plus className="w-3 h-3 text-slate-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vessel Discount Section */}
                  {beverageCount > 0 && (
                    <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                          <Coffee className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                            <span>{t.bringVesselTitle}</span>
                            <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                              {t.save2baht}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                            {t.bringVesselDesc}
                          </p>
                        </div>
                      </div>

                      <label className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-xl cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={bringVessel}
                          onChange={(e) => setBringVessel(e.target.checked)}
                          className="w-4.5 h-4.5 text-rose-500 border-slate-300 rounded focus:ring-rose-500 focus:ring-2 accent-rose-500"
                        />
                        <span className={`font-bold text-slate-700 dark:text-slate-300 leading-tight ${isSimple ? 'text-sm' : 'text-xs'}`}>
                          {t.bringOwnVesselToggle}
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Special Requests / Allergy Information Input Area */}
                  <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <label 
                          htmlFor="special-instructions-input"
                          className="font-extrabold text-xs text-slate-800 dark:text-white flex items-center gap-1.5"
                        >
                          <span>{t.specialInstructionsLabel}</span>
                        </label>
                      </div>
                      {specialInstructions && (
                        <button
                          type="button"
                          onClick={() => setSpecialInstructions('')}
                          className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          {lang === 'th' ? 'ล้างข้อความ' : 'Clear'}
                        </button>
                      )}
                    </div>

                    <textarea
                      id="special-instructions-input"
                      rows={2}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder={t.specialInstructionsPlaceholder}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                    />

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {[
                        t.specialInstructionsChipLessSweet,
                        t.specialInstructionsChipNoSugar,
                        t.specialInstructionsChipSeparateIce,
                        t.specialInstructionsChipNutAllergy
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            if (!specialInstructions.includes(chip)) {
                              setSpecialInstructions(prev => prev ? `${prev}, ${chip}` : chip);
                            }
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all active:scale-95 cursor-pointer ${
                            specialInstructions.includes(chip)
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                          }`}
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
                    <span>Subtotal</span>
                    <span>฿{subtotal}</span>
                  </div>
                  {bringVessel && beverageCount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-500 font-bold">
                      <span>{t.vesselDiscountApplied} ({beverageCount} {lang === 'th' ? "แก้ว" : "vessels"})</span>
                      <span>-฿{vesselDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-800/80 pt-2">
                    <span className={`font-black text-slate-800 dark:text-white ${isSimple ? 'text-lg' : 'text-sm'}`}>{t.cartTotal}</span>
                    <span className={`font-black text-rose-500 ${isSimple ? 'text-2xl' : 'text-xl'}`}>฿{total}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className={`w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-rose-500/10 ${
                    isSimple ? 'text-lg py-4' : 'text-sm'
                  }`}
                >
                  <span>{t.checkout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* CHECKOUT STEP */}
        {step === 'checkout' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.paymentTitle}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('promptpay')}
                    className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'promptpay'
                        ? 'border-rose-500 bg-rose-500/5 text-rose-500'
                        : 'border-slate-150 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>{t.promptPayLabel}</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-rose-500 bg-rose-500/5 text-rose-500'
                        : 'border-slate-150 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{t.cashLabel}</span>
                  </button>
                </div>
              </div>

              {/* PromptPay QR Code Details */}
              {paymentMethod === 'promptpay' && (
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">PromptPay QR</span>
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                    </span>
                  </div>

                  {/* Dynamic PromptPay QR Representation */}
                  <div className="relative w-48 h-48 bg-white p-3 rounded-2xl border border-slate-150 shadow-md mx-auto flex flex-col items-center justify-center">
                    {/* PromptPay Header */}
                    <div className="w-full bg-blue-900 text-white py-1 rounded-t-lg text-[9px] font-black uppercase tracking-wider mb-2">
                      PromptPay
                    </div>
                    {/* Mock QR Code Pattern */}
                    <div className="relative w-32 h-32 bg-slate-900 p-1.5 rounded-lg flex items-center justify-center">
                      <div className="w-full h-full bg-white flex flex-wrap p-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1/4 h-1/4 ${
                              (i % 3 === 0 || i % 5 === 1 || i === 0 || i === 3 || i === 12 || i === 15) 
                                ? 'bg-slate-950' 
                                : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-900 text-white text-[8px] font-extrabold px-1 py-0.5 rounded border border-white">
                        ฿{total}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                    {t.promptPayInstructions}
                  </p>

                  {/* Slip Upload */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t.uploadReceipt}</span>
                    </label>

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                      />
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-rose-500 transition-all">
                        {receiptUploading ? (
                          <>
                            <RefreshCw className="w-4 h-4 text-rose-500 animate-spin" />
                            <span>{lang === 'th' ? "กำลังประมวลผล..." : "Uploading..."}</span>
                          </>
                        ) : receipt ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-500">{lang === 'th' ? "อัปโหลดสลิปแล้ว" : "Receipt Uploaded!"}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-rose-500" />
                            <span>{lang === 'th' ? "เลือกไฟล์สลิป" : "Choose Slip Image"}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {receipt && (
                      <div className="relative w-20 h-20 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden mx-auto mt-2">
                        <img src={receipt} alt="Payment Slip" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cash Instructions */}
              {paymentMethod === 'cash' && (
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4">
                  <div className="inline-flex p-3 bg-rose-500/10 text-rose-500 rounded-full">
                    <ShoppingBag className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                    {lang === 'th' ? "รับสินค้าและชำระเงินที่ร้าน" : "Pay Cash at Pick Up"}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                    {lang === 'th' 
                      ? "กรุณามารับสินค้าตามที่อยู่ร้านวัวลาย ซอย 2 และชำระเงินสดจำนวน ฿" + total + " เมื่อรับสินค้าเรียบร้อย"
                      : "Please pick up your items at Wua Lai Road Soi 2 and pay ฿" + total + " cash at the counter."}
                  </p>
                </div>
              )}

              {/* Special Instructions Summary in Checkout */}
              {specialInstructions.trim() && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs">
                  <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-extrabold text-slate-800 dark:text-white block text-[11px]">
                      {t.specialInstructionsNote}:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] break-words mt-0.5">
                      "{specialInstructions.trim()}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex justify-between items-end">
                <span className="font-bold text-xs text-slate-500 dark:text-slate-400">{t.cartTotal}</span>
                <span className="font-black text-rose-500 text-xl">฿{total}</span>
              </div>

              {!currentUser ? (
                <button
                  onClick={onLoginRequest}
                  className="w-full py-3.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
                >
                  <span>{lang === 'th' ? "กรุณาเข้าสู่ระบบก่อนสั่งซื้อ" : "Please Login to Place Order"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep('cart')}
                    className="flex-1 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xs transition-all active:scale-95"
                  >
                    {lang === 'th' ? "ย้อนกลับ" : "Back"}
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={paymentMethod === 'promptpay' && !receipt}
                    className="flex-[2] py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-lg shadow-rose-500/10 disabled:shadow-none"
                  >
                    <span>{t.placeOrder}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ORDER TRACKING STEP */}
        {step === 'tracking' && activeOrder && (
          <div className="flex-1 flex flex-col p-5 justify-between">
            <div className="space-y-6 text-center py-6">
              <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-500 rounded-full animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-black text-xl text-slate-800 dark:text-white tracking-tight">
                  {t.paymentSuccess}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Order ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">#{activeOrder.id}</span>
                </p>
              </div>

              {/* Visual Status Tracker */}
              <div className="relative max-w-xs mx-auto pt-4">
                <div className="absolute left-6 top-10 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800 z-0">
                  <div 
                    className="w-full bg-emerald-500 transition-all duration-1000" 
                    style={{ 
                      height: 
                        trackingStatus === 'pending' ? '0%' : 
                        trackingStatus === 'preparing' ? '33%' : 
                        trackingStatus === 'ready' ? '66%' : '100%' 
                    }} 
                  />
                </div>

                <div className="space-y-6 relative z-10 text-left pl-1">
                  {/* Status 1: Pending */}
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      trackingStatus === 'pending' || trackingStatus === 'preparing' || trackingStatus === 'ready' || trackingStatus === 'completed'
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      1
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-800 dark:text-white">{t.orderPending}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">We are verifying your transaction.</div>
                    </div>
                  </div>

                  {/* Status 2: Preparing */}
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      trackingStatus === 'preparing' || trackingStatus === 'ready' || trackingStatus === 'completed'
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      2
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-800 dark:text-white">{t.orderPreparing}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Our kitchen is preparing your orders fresh.</div>
                    </div>
                  </div>

                  {/* Status 3: Ready */}
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      trackingStatus === 'ready' || trackingStatus === 'completed'
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      3
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-800 dark:text-white">{t.orderReady}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Ready for pickup at Wua Lai Rd Soi 2!</div>
                    </div>
                  </div>

                  {/* Status 4: Completed */}
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      trackingStatus === 'completed'
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      4
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-800 dark:text-white">{t.orderCompleted}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Enjoy your delicious traditional treats!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <span>{lang === 'th' ? "เสร็จสิ้น / สั่งซื้อเพิ่ม" : "Done / Order Again"}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
