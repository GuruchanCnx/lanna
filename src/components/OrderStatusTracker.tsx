import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Clock, Coffee, Bell, CheckCircle2, RefreshCw, 
  Hourglass, Store, Flame, Volume2, VolumeX, Sparkles,
  Lightbulb, ChevronRight, Shuffle
} from 'lucide-react';
import { Language, translations } from '../lib/translations';
import { Order } from '../lib/types';
import { checkStoreStatus } from '../lib/storeSettings';
import { 
  playOrderReadyChime, 
  playOrderProgressChime, 
  isSoundNotificationEnabled, 
  setSoundNotificationEnabled 
} from '../lib/audioNotification';

interface OrderTip {
  id: string;
  matchKeys: string[];
  icon: string;
  badgeTh: string;
  badgeEn: string;
  titleTh: string;
  titleEn: string;
  tipTh: string;
  tipEn: string;
}

const ORDER_TIPS: OrderTip[] = [
  {
    id: 'patongko-crisp',
    matchKeys: ['ปาท่องโก๋', 'patongko', 'doughnut', 'ซาลาเปาทอด', 'สังขยา'],
    icon: '🥢',
    badgeTh: 'ข้อแนะนำการทาน',
    badgeEn: 'Serving Suggestion',
    titleTh: 'ทานคู่สังขยา & นมข้นตอนร้อนๆ',
    titleEn: 'Dip in Pandan Kaya While Hot',
    tipTh: 'ปาท่องโก๋สูตรหายยาทอดด้วยน้ำมันรำข้าว 100% สะบัดน้ำมันจนแห้งสนิท เมื่อจิ้มกับสังขยาใบเตยสดหรือนมข้นหวาน จะได้รสสัมผัสกรอบนอกนุ่มฟูไม่อมน้ำมัน!',
    tipEn: 'Haiya Pa Thong Ko is fried in 100% fresh rice bran oil and centrifugally drained. Dip into fresh pandan kaya or condensed milk for the ultimate crisp outside and pillowy softness.'
  },
  {
    id: 'patongko-health',
    matchKeys: ['ปาท่องโก๋', 'patongko', 'doughnut'],
    icon: '✨',
    badgeTh: 'รู้หรือไม่',
    badgeEn: 'Did You Know?',
    titleTh: 'น้ำมันรำข้าว ไร้ไขมันทรานส์ 0%',
    titleEn: '100% Rice Bran Oil, Zero Trans Fat',
    tipTh: 'ร้านเราเปลี่ยนน้ำมันทอดใหม่ทุกวัน ไม่ใช้น้ำมันซ้ำ และคุมอุณหภูมิที่ 185°C ทำให้ปาท่องโก๋ไม่อมน้ำมัน และมีแคลอรี่น้อยกว่าปาท่องโก๋ทั่วไปถึง 30%',
    tipEn: 'We change frying oil daily with fresh rice bran oil at strict 185°C. This ensures 0% trans fat, zero greasiness, and 30% fewer calories than typical street doughnuts.'
  },
  {
    id: 'soymilk-nutrition',
    matchKeys: ['น้ำเต้าหู้', 'เต้าหู้', 'soymilk', 'soy', 'นมถั่วเหลือง'],
    icon: '🥛',
    badgeTh: 'สุขภาพ & โภชนาการ',
    badgeEn: 'Nutrition Wisdom',
    titleTh: 'ถั่วเหลืองเชียงใหม่ Non-GMO 100%',
    titleEn: '100% Local Non-GMO Soybeans',
    tipTh: 'น้ำเต้าหู้หายยาคั้นสดจากถั่วเหลืองบนดอยเชียงใหม่ ต้มด้วยหม้อทองเหลืองโบราณ อุดมไปด้วยโปรตีนพืช และไอโซฟลาโวน (Isoflavones) ช่วยบำรุงเซลล์ผิวและหัวใจ',
    tipEn: 'Our soy milk is freshly pressed from highland Chiang Mai non-GMO soybeans and boiled in brass cauldrons—packed with plant protein and natural cell-protecting isoflavones.'
  },
  {
    id: 'soymilk-warm-skin',
    matchKeys: ['น้ำเต้าหู้', 'เต้าหู้', 'soymilk', 'soy', 'นมถั่วเหลือง'],
    icon: '🍲',
    badgeTh: 'เคล็ดลับความอร่อย',
    badgeEn: 'Pro Serving Tip',
    titleTh: 'เคล็ดลับฟองเต้าหู้ธรรมชาติ',
    titleEn: 'Silky Natural Soy Skin Layer',
    tipTh: 'หากสั่งกลับบ้านแล้วนำไปอุ่นไฟอ่อน 2-3 นาที จะมีแผ่นฟองเต้าหู้บางๆ ลอยขึ้นมาบนผิวถ้วย หอมมันละมุนลิ้นแบบต้นตำรับชาวจีนโบราณแท้ๆ',
    tipEn: 'Reheat gently at home over low heat for 2-3 minutes to produce a velvety natural layer of yuba (soy skin) on top—a cherished delicacy in traditional soy milk crafting.'
  },
  {
    id: 'ginger-douhua',
    matchKeys: ['ขิง', 'ginger', 'เต้าฮวย', 'douhua', 'บัวลอยน้ำขิง'],
    icon: '🫚',
    badgeTh: 'สมุนไพรธรรมชาติ',
    badgeEn: 'Herbal Wellness',
    titleTh: 'ขิงแก่ 10 เดือน ไล่ลม บำรุงการไหลเวียน',
    titleEn: '10-Month Mature Ginger Tonic',
    tipTh: 'น้ำขิงต้มสดจากขิงแก่คัดพิเศษอายุ 10 เดือนขึ้นไป ให้สารจินเจอรอล (Gingerol) เข้มข้น ช่วยขับลม แก้อาการท้องอืด คลายหนาว และกระตุ้นการไหลเวียนโลหิต',
    tipEn: 'Brewed from 10-month matured ginger roots naturally rich in gingerols—wonderful for easing digestion, relieving bloating, and warming you up.'
  },
  {
    id: 'fresh-milk',
    matchKeys: ['นมสด', 'milk', 'นมร้อน', 'นมเย็น'],
    icon: '🍶',
    badgeTh: 'ฟาร์มสดใหม่',
    badgeEn: 'Farm Fresh Quality',
    titleTh: 'นมโคแท้ 100% จากฟาร์มเชียงใหม่',
    titleEn: 'Pure Dairy From Chiang Mai Farms',
    tipTh: 'นมสดส่งตรงจากสหกรณ์โคนมเชียงใหม่ทุกเช้า ไม่ผสมหางนมผง ไม่แต่งกลิ่น ให้แคลเซียม วิตามินบี 12 และไขมันดีตามธรรมชาติ ดื่มอุ่นๆ ก่อนนอนช่วยให้หลับสบาย',
    tipEn: 'Sourced fresh daily from Chiang Mai dairy cooperatives with zero powdered fillers. Naturally sweet, high in calcium, and perfect warm before bedtime.'
  },
  {
    id: 'charcoal-toast',
    matchKeys: ['ปิ้ง', 'toast', 'ขนมปัง', 'เนย', 'แยม'],
    icon: '🍞',
    badgeTh: 'คู่หูความอร่อย',
    badgeEn: 'Artisan Charcoal Toast',
    titleTh: 'ขนมปังปิ้งเตาถ่านไม้ธรรมชาติ',
    titleEn: 'Natural Charcoal Wood Toasting',
    tipTh: 'ขนมปังแผ่นหนานุ่ม ปิ้งบนตะแกรงเตาถ่านไม้ธรรมชาติให้ขอบนอกกรอบเกรียมมีกลิ่นควันไม้ฟืนอ่อนๆ ทาเนยสดแท้ฉ่ำๆ ทานสลับกับน้ำเต้าหู้ร้อนๆ คือความฟินระดับตำนาน',
    tipEn: 'Thick bread toasted over authentic natural embers for a crisp exterior and woodsmoke fragrance, slathered with pure butter—the ultimate pair with hot soy milk.'
  },
  {
    id: 'lanna-bag-eco',
    matchKeys: ['กระเป๋า', 'bag', 'ฉนวน', 'lanna', 'thermal'],
    icon: '🛍️',
    badgeTh: 'รักษ์โลก',
    badgeEn: 'Lanna Thermal Bag',
    titleTh: 'กระเป๋าล้านนาฉนวน 3 ชั้น เก็บอุณหภูมิ',
    titleEn: '3-Layer Insulation Keeps Temperature',
    tipTh: 'กระเป๋าลายพื้นเมืองเชียงใหม่ บุฟอยล์เก็บความร้อนหรือความเย็นได้ 3-4 ชม. ซักทำความสะอาดง่าย นำกลับมาใช้ซ้ำได้ยาวนาน ช่วยลดขยะพลาสติกเพื่อเชียงใหม่ที่น่าอยู่',
    tipEn: 'Traditional Chiang Mai insulated bags keep drinks steaming hot or icy cold for 3-4 hours. Durable and washable, helping reduce single-use plastic waste.'
  },
  {
    id: 'heritage-wualai',
    matchKeys: [],
    icon: '🏮',
    badgeTh: 'เรื่องเล่าหายยา',
    badgeEn: 'Haiya Heritage Story',
    titleTh: 'เตาต้มน้ำเต้าหู้คู่เมืองเชียงใหม่',
    titleEn: 'Chiang Mai Heritage Tradition',
    tipTh: 'ร้านหายยาวัวลาย ซอย 2 ตื่นมาจุดเตาต้มน้ำเต้าหู้ตั้งแต่ก่อนรุ่งสาง ส่งต่อความใส่ใจและความอบอุ่นให้ชาวเชียงใหม่และนักท่องเที่ยวมาอย่างยาวนาน',
    tipEn: 'Haiya at Wua Lai Soi 2 fires its brass cauldrons before dawn, crafting authentic warm nourishment with love for Chiang Mai locals and travelers.'
  }
];

interface OrderStatusTrackerProps {
  order: Order;
  lang: Language;
  isSimple?: boolean;
  onRefresh?: () => void;
}

type StepKey = 'pending' | 'preparing' | 'ready' | 'completed';

interface StepConfig {
  key: StepKey;
  labelTh: string;
  labelEn: string;
  subTh: string;
  subEn: string;
  icon: React.ElementType;
}

const STEPS: StepConfig[] = [
  {
    key: 'pending',
    labelTh: 'รอยืนยัน',
    labelEn: 'Placed',
    subTh: 'กำลังรอการยืนยันออเดอร์',
    subEn: 'Awaiting confirmation',
    icon: Clock,
  },
  {
    key: 'preparing',
    labelTh: 'กำลังเตรียม',
    labelEn: 'Preparing',
    subTh: 'กำลังปรุงสดใหม่ร้อนๆ',
    subEn: 'Kitchen preparing order',
    icon: Coffee,
  },
  {
    key: 'ready',
    labelTh: 'พร้อมรับสินค้า',
    labelEn: 'Ready',
    subTh: 'พร้อมรับที่ร้านหรือรอจัดส่ง',
    subEn: 'Ready for pickup',
    icon: Bell,
  },
  {
    key: 'completed',
    labelTh: 'จัดส่ง/รับแล้ว',
    labelEn: 'Delivered',
    subTh: 'ออเดอร์เสร็จสิ้นเรียบร้อย',
    subEn: 'Delivered & completed',
    icon: CheckCircle2,
  },
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  order,
  lang,
  isSimple = false,
  onRefresh,
}) => {
  const t = translations[lang];
  const currentStatus: StepKey = order.status || 'pending';
  const [storeStatus, setStoreStatus] = useState(checkStoreStatus());
  const [now, setNow] = useState(Date.now());
  const [soundEnabled, setSoundEnabled] = useState(isSoundNotificationEnabled());
  const [soundAlertPlayed, setSoundAlertPlayed] = useState(false);

  // Track previous status to play audio notification on transition to 'ready'
  const previousStatusRef = useRef<StepKey>(order.status || 'pending');

  // Filter tips matching items in this order, plus heritage tips
  const matchedTips = useMemo(() => {
    const itemTexts = (order.items || []).map((it) => 
      `${it.nameTh || ''} ${it.nameEn || ''}`.toLowerCase()
    ).join(' ');

    const relevant = ORDER_TIPS.filter((tip) => {
      if (tip.matchKeys.length === 0) return true;
      return tip.matchKeys.some((k) => itemTexts.includes(k.toLowerCase()));
    });

    return relevant.length > 0 ? relevant : ORDER_TIPS;
  }, [order.items]);

  // Start with a randomized tip index on mount
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * 9) % (matchedTips.length || 1));

  // Auto rotate tips every 9 seconds while preparing
  useEffect(() => {
    if (currentStatus !== 'preparing') return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % matchedTips.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [currentStatus, matchedTips.length]);

  const handleNextTip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTipIndex((prev) => (prev + 1) % matchedTips.length);
  };

  const activeTip = matchedTips[tipIndex % matchedTips.length] || matchedTips[0];

  // Step indices
  const stepIndices: Record<StepKey, number> = {
    pending: 0,
    preparing: 1,
    ready: 2,
    completed: 3,
  };

  const currentIndex = stepIndices[currentStatus] ?? 0;
  const isFinished = currentStatus === 'completed';
  const isReady = currentStatus === 'ready';

  // Smooth live countdown update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      setStoreStatus(checkStoreStatus());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio API notification on status changes
  useEffect(() => {
    const prev = previousStatusRef.current;
    
    // Play pleasant chime when transitioning to 'ready'
    if (prev !== 'ready' && currentStatus === 'ready') {
      const played = playOrderReadyChime();
      if (played) {
        setSoundAlertPlayed(true);
        setTimeout(() => setSoundAlertPlayed(false), 5000);
      }
    } else if (prev === 'pending' && currentStatus === 'preparing') {
      // Subtle progress transition tone
      playOrderProgressChime();
    }

    previousStatusRef.current = currentStatus;
  }, [currentStatus]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setSoundNotificationEnabled(next);
    if (next) {
      playOrderReadyChime();
    }
  };

  const handleTestChime = () => {
    playOrderReadyChime();
    setSoundAlertPlayed(true);
    setTimeout(() => setSoundAlertPlayed(false), 3000);
  };

  // Format order date
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate average order completion time based on order items
  const totalItemCount = order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1;
  const estimatedAverageSeconds = Math.min(15 * 60, Math.max(6 * 60, 360 + totalItemCount * 45));
  const estimatedAverageMinutes = Math.ceil(estimatedAverageSeconds / 60);

  const elapsedSeconds = Math.max(0, Math.floor((now - orderDate.getTime()) / 1000));
  const remainingSeconds = Math.max(0, estimatedAverageSeconds - elapsedSeconds);

  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingSecs = remainingSeconds % 60;

  // Visual percentage for the preparation countdown
  let prepProgressPercent = 0;
  if (isFinished || isReady) {
    prepProgressPercent = 100;
  } else if (currentStatus === 'preparing') {
    prepProgressPercent = Math.min(98, Math.max(15, Math.round(((estimatedAverageSeconds - remainingSeconds) / estimatedAverageSeconds) * 100)));
  } else {
    // pending: animate between 8% and 22%
    prepProgressPercent = Math.min(25, Math.max(8, Math.round((elapsedSeconds / 180) * 22)));
  }

  // Smoothly animated stepper line width calculation
  // Between pending (0 -> 14%), preparing (33% -> 66% dynamically based on prepProgress), ready (66% -> 100%), completed (100%)
  const getStepperLineWidth = () => {
    if (isFinished) return '100%';
    if (isReady) return '66.6%';
    if (currentStatus === 'preparing') {
      // Smooth dynamic interpolate between step 1 (33.3%) and step 2 (66.6%)
      const dynamicFraction = prepProgressPercent / 100;
      const widthPercent = 33.3 + (dynamicFraction * 33.3);
      return `${Math.min(64, Math.max(35, widthPercent))}%`;
    }
    // pending status
    return '14%';
  };

  return (
    <div className={`p-4 sm:p-5 rounded-3xl border transition-all relative overflow-hidden ${
      isFinished
        ? 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
        : isReady
        ? 'bg-gradient-to-br from-sky-500/10 via-emerald-500/5 to-slate-50 dark:from-sky-950/40 dark:via-emerald-950/20 dark:to-slate-900/60 border-sky-300 dark:border-sky-800 shadow-md ring-2 ring-sky-500/10'
        : 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 shadow-sm'
    }`}>
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          {!isFinished && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          )}
          <span className={`font-black uppercase tracking-wider text-[11px] ${
            isFinished ? 'text-slate-500 dark:text-slate-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {lang === 'th' ? 'สถานะคำสั่งซื้อ' : 'Order Status'}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            • {formattedDate}
          </span>
        </div>

        {/* Current status pill & Sound notification toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Subtle Web Audio Toggle / Test Sound Button */}
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <button
              type="button"
              onClick={handleToggleSound}
              title={soundEnabled ? t.soundEnabled : t.soundDisabled}
              aria-label={t.soundNotification}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                soundEnabled 
                  ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleTestChime}
              title={t.soundTestChime}
              className="px-1.5 py-0.5 text-[9px] font-black text-slate-500 hover:text-rose-500 dark:text-slate-400 transition-colors cursor-pointer hidden sm:inline"
            >
              {lang === 'th' ? 'ทดสอบ' : 'Test'}
            </button>
          </div>

          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide transition-all ${
            currentStatus === 'completed'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : currentStatus === 'ready'
              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 animate-pulse'
              : currentStatus === 'preparing'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}>
            {STEPS[currentIndex] ? (lang === 'th' ? STEPS[currentIndex].labelTh : STEPS[currentIndex].labelEn) : currentStatus}
          </span>

          {onRefresh && !isFinished && (
            <button
              type="button"
              onClick={onRefresh}
              title={lang === 'th' ? 'ตรวจสอบสถานะล่าสุด' : 'Refresh status'}
              className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* READY ALERT BANNER WITH SOUND CHIME INDICATION */}
      {isReady && (
        <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-500 text-white shadow-lg shadow-sky-500/20 animate-in fade-in zoom-in-95 duration-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs flex-shrink-0">
              <Bell className="w-4 h-4 text-white animate-bounce" />
            </div>
            <div>
              <p className="font-black text-xs leading-tight">
                {lang === 'th' ? '🔔 อาหารปรุงเสร็จแล้ว พร้อมรับที่เคาน์เตอร์!' : '🔔 Order is Ready for Pickup!'}
              </p>
              <p className="text-[10px] text-sky-100 font-medium">
                {lang === 'th' ? 'ร้อนๆ สดใหม่ พร้อมเสิร์ฟถึงมือคุณ' : 'Freshly prepared and packed piping hot.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTestChime}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold backdrop-blur-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            title={t.soundTestChime}
          >
            <Volume2 className="w-3 h-3" />
            <span className="hidden sm:inline">{lang === 'th' ? 'เปิดเสียงเตือน' : 'Play Chime'}</span>
          </button>
        </div>
      )}

      {/* STEPPER PROGRESS BAR WITH CSS ANIMATIONS */}
      <div className="relative mt-2 mb-4 px-2">
        {/* Progress Line Track Background */}
        <div className="absolute top-4 left-6 right-6 h-1.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Animated Progress Line Fill */}
        <div 
          className="absolute top-4 left-6 h-1.5 -translate-y-1/2 z-0 rounded-full transition-all duration-1000 ease-out overflow-hidden shadow-xs"
          style={{ width: `calc(${getStepperLineWidth()} - 1.5rem)` }}
        >
          {/* Kinetic gradient background with continuous flow */}
          <div className="w-full h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 animate-progress-flow relative">
            {/* Shimmer sweep animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer pointer-events-none" />
            
            {/* Diagonal candy stripes during active preparation */}
            {!isFinished && (
              <div className="absolute inset-0 animate-progress-stripes opacity-40 pointer-events-none" />
            )}
          </div>

          {/* Traveling spark light indicator running between pending and preparing */}
          {!isFinished && (
            <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white to-transparent animate-traveling-spark pointer-events-none" />
          )}
        </div>

        {/* Step Nodes */}
        <div className="relative z-10 flex justify-between">
          {STEPS.map((step, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = step.icon;

            return (
              <div 
                key={step.key} 
                className="flex flex-col items-center text-center max-w-[4.8rem]"
              >
                {/* Node Icon with CSS animation glow */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm relative ${
                  isCurrent
                    ? 'bg-rose-500 text-white ring-4 ring-rose-500/25 scale-110 shadow-rose-500/30'
                    : isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-700 border-2 border-slate-200 dark:border-slate-800'
                }`}>
                  {/* Subtle pulsing aura for current node */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-rose-500 animate-pulse-ring pointer-events-none" />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 ${isCurrent ? 'animate-pulse' : ''}`} />
                </div>

                {/* Node Label */}
                <div className="mt-2 space-y-0.5">
                  <p className={`font-black tracking-tight leading-tight transition-colors ${
                    isSimple ? 'text-xs' : 'text-[10px]'
                  } ${
                    isCurrent
                      ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                      : isPassed
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400 dark:text-slate-600 font-medium'
                  }`}>
                    {lang === 'th' ? step.labelTh : step.labelEn}
                  </p>

                  {/* Subtitle on active step only */}
                  {isCurrent && (
                    <p className={`text-[9px] text-slate-500 dark:text-slate-400 line-clamp-1 hidden sm:block ${
                      isSimple ? 'text-[11px]' : ''
                    }`}>
                      {lang === 'th' ? step.subTh : step.subEn}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE VISUAL COUNTDOWN TIMER FOR 'PREPARING' STATUS */}
      {currentStatus === 'preparing' && !isFinished && (
        <div className="mt-4 p-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-rose-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-rose-950/30 rounded-2xl border-2 border-amber-400/40 dark:border-amber-500/30 shadow-md space-y-3 relative overflow-hidden">
          {/* Subtle Ambient Pulse Light */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header of Countdown Box */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <Flame className="w-4 h-4 animate-bounce text-amber-500" />
              </div>
              <div>
                <span className="font-black text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                  <span>{lang === 'th' ? 'ครัวกำลังปรุงสดใหม่' : 'Live Kitchen Preparation'}</span>
                  <span className="text-[9px] bg-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                    Live
                  </span>
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {lang === 'th' 
                    ? `เวลาเฉลี่ยโดยประมาณ ~${estimatedAverageMinutes} นาที (${totalItemCount} รายการ)` 
                    : `Estimated from average completion ~${estimatedAverageMinutes} mins (${totalItemCount} items)`}
                </p>
              </div>
            </div>

            {/* Total items badge */}
            <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2.5 py-1 rounded-xl border border-amber-300/40">
              {totalItemCount} {lang === 'th' ? 'รายการ' : 'items'}
            </span>
          </div>

          {/* Digital Timer Clock Display */}
          <div className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-amber-200/60 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="font-mono text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 tracking-wider flex items-center bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-300/50 shadow-sm">
                <span>{remainingMinutes.toString().padStart(2, '0')}</span>
                <span className="animate-pulse mx-0.5 text-amber-500">:</span>
                <span>{remainingSecs.toString().padStart(2, '0')}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider block">
                  {remainingSeconds > 0 
                    ? (lang === 'th' ? 'เวลาที่เหลือก่อนพร้อมรับ' : 'Time Remaining') 
                    : (lang === 'th' ? 'ใกล้พร้อมแล้ว!' : 'Almost Ready!')}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  {remainingSeconds > 0
                    ? (lang === 'th' 
                        ? `รออีกประมาณ ${remainingMinutes} นาที ${remainingSecs} วินาที` 
                        : `~${remainingMinutes} min ${remainingSecs} sec remaining`)
                    : (lang === 'th' 
                        ? 'กำลังจัดแพ็คใส่ภาชนะ พร้อมเสิร์ฟในไม่กี่วินาที...' 
                        : 'Packaging order, serving in moments...')}
                </p>
              </div>
            </div>

            {/* Percentage completed badge */}
            <div className="self-end sm:self-auto flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400">
              <Hourglass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{prepProgressPercent}% {lang === 'th' ? 'ปรุงเสร็จแล้ว' : 'completed'}</span>
            </div>
          </div>

          {/* Smooth Animated Visual Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3.5 bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-amber-200/50 dark:border-amber-900/50 shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-500 transition-all duration-1000 shadow-sm relative overflow-hidden animate-progress-flow"
                style={{ width: `${prepProgressPercent}%` }}
              >
                {/* Flowing animated stripes */}
                <div className="absolute inset-0 animate-progress-stripes opacity-40 pointer-events-none" />
                {/* Continuous Shimmer Light */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-progress-shimmer pointer-events-none" />
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
              <span>{lang === 'th' ? '1. เข้าคิวปรุง' : '1. Queued'}</span>
              <span>{lang === 'th' ? '2. สะบัดน้ำมัน & ต้มสด' : '2. Cooking'}</span>
              <span>{lang === 'th' ? '3. บรรจุ & พร้อมรับ' : '3. Ready'}</span>
            </div>
          </div>

          {/* DID YOU KNOW & SERVING SUGGESTION CARD (Tailored to items in order during 'preparing' status) */}
          {activeTip && (
            <div 
              onClick={handleNextTip}
              className="mt-3 p-3 sm:p-3.5 bg-white/95 dark:bg-slate-900/95 rounded-2xl border border-amber-300/80 dark:border-amber-700/60 shadow-xs hover:border-amber-400 transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Top ambient highlight line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400" />
              
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="p-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-extrabold text-[11px] text-slate-800 dark:text-white flex items-center gap-1">
                    <span>{t.didYouKnowTitle || (lang === 'th' ? '💡 รู้หรือไม่ & ข้อแนะนำการทาน' : '💡 Did You Know & Serving Tips')}</span>
                  </span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                    {activeTip.icon} {lang === 'th' ? activeTip.badgeTh : activeTip.badgeEn}
                  </span>
                </div>

                {/* Next Tip button & counter */}
                <button
                  type="button"
                  onClick={handleNextTip}
                  className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:text-rose-500 py-0.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 transition-all cursor-pointer flex-shrink-0"
                  title={t.nextTip || (lang === 'th' ? 'สลับข้อแนะนำถัดไป' : 'Next tip')}
                >
                  <Shuffle className="w-2.5 h-2.5" />
                  <span>{t.nextTip || (lang === 'th' ? 'ข้อความถัดไป' : 'Next Tip')}</span>
                  <span className="text-[9px] opacity-70">
                    ({((tipIndex % matchedTips.length) + 1)}/{matchedTips.length})
                  </span>
                </button>
              </div>

              {/* Title and tip text */}
              <div className="pl-1 space-y-1">
                <h5 className="font-bold text-xs text-amber-700 dark:text-amber-300 group-hover:text-amber-600 transition-colors">
                  {lang === 'th' ? activeTip.titleTh : activeTip.titleEn}
                </h5>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'th' ? activeTip.tipTh : activeTip.tipEn}
                </p>
              </div>
            </div>
          )}

          {/* Store Hours & Freshness guarantee */}
          <div className="pt-2 border-t border-amber-200/40 dark:border-slate-800 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <Store className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
              <span>
                {storeStatus.isOpen
                  ? (lang === 'th' ? storeStatus.messageTh : storeStatus.messageEn)
                  : (lang === 'th' ? storeStatus.messageTh : storeStatus.messageEn)}
              </span>
            </div>
            <span className="font-extrabold text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>{lang === 'th' ? 'ปรุงสดใหม่ 100%' : '100% Fresh to Order'}</span>
            </span>
          </div>
        </div>
      )}

      {/* DYNAMIC ESTIMATED COUNTDOWN PROGRESS BAR (For pending or ready status) */}
      {currentStatus !== 'preparing' && !isFinished && (
        <div className="mt-4 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-rose-100 dark:border-rose-900/40 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <Hourglass className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>
                {isReady 
                  ? (lang === 'th' ? '✨ อาหารปรุงเสร็จแล้ว พร้อมรับ!' : '✨ Order Ready for Pickup!')
                  : (lang === 'th' ? 'เวลารอคิวโดยประมาณ:' : 'Estimated Queue Time:')}
              </span>
            </div>

            <div className="font-mono font-black text-rose-500 text-xs sm:text-sm">
              {isReady ? (
                <span className="text-emerald-500 font-extrabold uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'พร้อมรับแล้ว' : 'Ready Now'}</span>
                </span>
              ) : storeStatus.isOpen ? (
                <span>
                  ~{estimatedAverageMinutes}{' '}
                  <span className="text-[10px] font-normal text-slate-400">
                    {lang === 'th' ? 'นาที' : 'min'}
                  </span>
                </span>
              ) : (
                <span className="text-amber-500 text-[10px]">
                  {lang === 'th' ? 'รอเปิดร้าน' : 'Queued'}
                </span>
              )}
            </div>
          </div>

          {/* Visual Progress Bar with CSS animation */}
          <div className="space-y-1">
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${
                  isReady 
                    ? 'bg-emerald-500' 
                    : 'bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 animate-progress-flow'
                }`}
                style={{ width: `${prepProgressPercent}%` }}
              >
                {!isFinished && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-progress-shimmer pointer-events-none" />
                )}
              </div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>{lang === 'th' ? 'เริ่มปรุงสด' : 'Kitchen start'}</span>
              <span>{prepProgressPercent}%</span>
              <span>{lang === 'th' ? 'รับสินค้า' : 'Pickup ready'}</span>
            </div>
          </div>

          {/* Store Hours Indicator */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Store className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
              <span>
                {storeStatus.isOpen
                  ? (lang === 'th' ? storeStatus.messageTh : storeStatus.messageEn)
                  : (lang === 'th' ? storeStatus.messageTh : storeStatus.messageEn)}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
              storeStatus.isOpen
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {storeStatus.isOpen ? (lang === 'th' ? 'เปิดบริการ' : 'Open') : (lang === 'th' ? 'นอกเวลาทำการ' : 'Off-hours')}
            </span>
          </div>
        </div>
      )}

      {/* Real-time Guidance Banner */}
      {!isFinished && (
        <div className="mt-3 pt-2.5 border-t border-rose-100 dark:border-rose-900/30 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span className="font-semibold">
              {currentStatus === 'pending' && (
                lang === 'th' 
                  ? 'ร้านค้าได้รับออเดอร์แล้ว กำลังยืนยันคิว' 
                  : 'Order received, pending confirmation'
              )}
              {currentStatus === 'preparing' && (
                lang === 'th' 
                  ? 'น้ำเต้าหู้และปาท่องโก๋กำลังสะบัดน้ำมันปรุงสดร้อนๆ' 
                  : 'Fresh soy milk & crispy patongko being prepared hot'
              )}
              {currentStatus === 'ready' && (
                lang === 'th' 
                  ? 'สินค้าพร้อมแล้ว! มารับที่หน้าร้านได้เลย' 
                  : 'Ready! Pick up at shop counter'
              )}
            </span>
          </div>

          <div className="text-[10px] font-bold text-rose-500 dark:text-rose-400 flex-shrink-0 flex items-center gap-0.5">
            <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
            <span>{lang === 'th' ? 'สดใหม่' : 'Live'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
