import React, { useState, useEffect } from 'react';
import { 
  Clock, Coffee, Bell, CheckCircle2, ChevronRight, Sparkles, RefreshCw, 
  Hourglass, AlertCircle, Store, Flame
} from 'lucide-react';
import { Language } from '../lib/translations';
import { Order } from '../lib/types';
import { checkStoreStatus } from '../lib/storeSettings';

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
  const currentStatus: StepKey = order.status || 'pending';
  const [storeStatus, setStoreStatus] = useState(checkStoreStatus());
  const [now, setNow] = useState(Date.now());

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

  // Format order date
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate average order completion time based on order items
  // Base kitchen prep time is 6 minutes (360s). Each item adds ~45s. Clamped between 6 and 15 minutes.
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
    prepProgressPercent = Math.min(98, Math.max(12, Math.round(((estimatedAverageSeconds - remainingSeconds) / estimatedAverageSeconds) * 100)));
  } else {
    // pending
    prepProgressPercent = Math.min(25, Math.max(8, Math.round((elapsedSeconds / 180) * 20)));
  }

  return (
    <div className={`p-4 rounded-3xl border transition-all ${
      isFinished
        ? 'bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
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

        {/* Current status pill */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
            currentStatus === 'completed'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : currentStatus === 'ready'
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 animate-pulse'
              : currentStatus === 'preparing'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}>
            {STEPS[currentIndex] ? (lang === 'th' ? STEPS[currentIndex].labelTh : STEPS[currentIndex].labelEn) : currentStatus}
          </span>

          {onRefresh && !isFinished && (
            <button
              onClick={onRefresh}
              title={lang === 'th' ? 'ตรวจสอบสถานะล่าสุด' : 'Refresh status'}
              className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative mt-2 mb-3 px-1">
        {/* Progress Line Track */}
        <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
        
        {/* Progress Line Fill */}
        <div 
          className="absolute top-4 left-6 h-1 bg-gradient-to-r from-rose-500 to-amber-500 -translate-y-1/2 z-0 transition-all duration-700 ease-out"
          style={{ 
            width: currentIndex === 0 ? '0%' : currentIndex === 1 ? '33%' : currentIndex === 2 ? '66%' : 'calc(100% - 3rem)' 
          }}
        />

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
                {/* Node Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                  isCurrent
                    ? 'bg-rose-500 text-white ring-4 ring-rose-500/20 scale-110 animate-pulse'
                    : isPassed
                    ? 'bg-rose-500 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-700 border-2 border-slate-200 dark:border-slate-800'
                }`}>
                  <Icon className="w-4 h-4" />
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

          {/* Visual Countdown Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-amber-200/50 dark:border-amber-900/50 shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-500 transition-all duration-1000 shadow-sm relative overflow-hidden"
                style={{ width: `${prepProgressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
              <span>{lang === 'th' ? '1. เข้าคิวปรุง' : '1. Queued'}</span>
              <span>{lang === 'th' ? '2. สะบัดน้ำมัน & ต้มสด' : '2. Cooking'}</span>
              <span>{lang === 'th' ? '3. บรรจุ & พร้อมรับ' : '3. Ready'}</span>
            </div>
          </div>

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
                <span className="text-emerald-500 font-extrabold uppercase">
                  {lang === 'th' ? 'พร้อมรับแล้ว' : 'Ready Now'}
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

          {/* Visual Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  isReady 
                    ? 'bg-emerald-500' 
                    : 'bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600'
                }`}
                style={{ width: `${prepProgressPercent}%` }}
              />
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
