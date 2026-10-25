import React from 'react';
import { 
  Clock, Coffee, Bell, CheckCircle2, ChevronRight, Sparkles, RefreshCw
} from 'lucide-react';
import { Language } from '../lib/translations';
import { Order } from '../lib/types';

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
  
  // Calculate current active step index (0 to 3)
  const stepIndices: Record<StepKey, number> = {
    pending: 0,
    preparing: 1,
    ready: 2,
    completed: 3,
  };

  const currentIndex = stepIndices[currentStatus] ?? 0;
  const isFinished = currentStatus === 'completed';

  // Format order date nicely
  const formattedDate = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
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
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}>
            {STEPS[currentIndex] ? (lang === 'th' ? STEPS[currentIndex].labelTh : STEPS[currentIndex].labelEn) : currentStatus}
          </span>

          {onRefresh && !isFinished && (
            <button
              onClick={onRefresh}
              title={lang === 'th' ? 'ตรวจสอบสถานะล่าสุด' : 'Refresh status'}
              className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative mt-2 mb-1 px-1">
        {/* Progress Line Track */}
        <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
        
        {/* Active Progress Fill */}
        <div 
          className="absolute top-4 left-6 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100 * 0.85}%` }}
        />

        {/* Steps Grid */}
        <div className="relative z-10 grid grid-cols-4 gap-1 text-center">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isUpcoming = idx > currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center">
                {/* Node Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPassed
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 scale-95'
                    : isCurrent
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-4 ring-rose-500/20 scale-110'
                    : 'bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700'
                }`}>
                  <Icon className={`w-4 h-4 ${isCurrent && !isFinished ? 'animate-bounce' : ''}`} />
                </div>

                {/* Step Text */}
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

      {/* Real-time Guidance Banner */}
      {!isFinished && (
        <div className="mt-3.5 pt-2.5 border-t border-rose-100 dark:border-rose-900/30 flex items-center justify-between text-[11px]">
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
                  ? 'น้ำเต้าหู้และขนมกำลังปรุงสดใหม่' 
                  : 'Your fresh drinks & snacks are being prepared'
              )}
              {currentStatus === 'ready' && (
                lang === 'th' 
                  ? 'สินค้าพร้อมแล้ว! มารับที่ร้านวัวลาย ซอย 2 ได้เลย' 
                  : 'Ready! Pick up at Wua Lai Soi 2 or awaiting courier'
              )}
            </span>
          </div>

          <div className="text-[10px] font-bold text-rose-500 dark:text-rose-400 flex-shrink-0 flex items-center gap-0.5">
            <span>{lang === 'th' ? 'สดใหม่' : 'Live'}</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
};
