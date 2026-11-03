import React from 'react';
import { 
  Bell, Coffee, CheckCircle2, ChevronRight, X, Sparkles, AlertCircle 
} from 'lucide-react';
import { Language } from '../lib/translations';

export interface OrderStatusToastNotification {
  id: string;
  orderId: string;
  previousStatus: string;
  newStatus: 'pending' | 'preparing' | 'ready' | 'completed';
  timestamp: number;
}

interface OrderStatusToastProps {
  notification: OrderStatusToastNotification | null;
  onClose: () => void;
  onViewOrder: () => void;
  lang: Language;
}

export const OrderStatusToast: React.FC<OrderStatusToastProps> = ({
  notification,
  onClose,
  onViewOrder,
  lang,
}) => {
  if (!notification) return null;

  const isPreparing = notification.newStatus === 'preparing';
  const isReady = notification.newStatus === 'ready';
  const isCompleted = notification.newStatus === 'completed';

  const titleTh = isReady 
    ? '🔔 ออเดอร์ของคุณพร้อมรับแล้ว!' 
    : isPreparing 
    ? '🍳 กำลังปรุงสดใหม่ร้อนๆ ในครัว' 
    : isCompleted 
    ? '✨ ออเดอร์เสร็จสิ้นเรียบร้อย' 
    : '📦 อัปเดตสถานะคำสั่งซื้อ';

  const titleEn = isReady 
    ? '🔔 Your order is ready for pickup!' 
    : isPreparing 
    ? '🍳 Kitchen is now preparing your food' 
    : isCompleted 
    ? '✨ Order completed' 
    : '📦 Order Status Updated';

  const descTh = isReady 
    ? `ออเดอร์ #${notification.orderId} ปรุงเสร็จแล้ว มารับที่หน้าร้านได้เลย` 
    : isPreparing 
    ? `ออเดอร์ #${notification.orderId} เริ่มทอดปาท่องโก๋และต้มน้ำเต้าหู้แล้ว` 
    : isCompleted 
    ? `ขอบคุณที่อุดหนุนจิ๊กโก๋ สะบัดน้ำมัน` 
    : `สถานะคำสั่งซื้อ #${notification.orderId} มีการเปลี่ยนแปลง`;

  const descEn = isReady 
    ? `Order #${notification.orderId} is freshly prepared & ready for pickup` 
    : isPreparing 
    ? `Order #${notification.orderId} is being prepared in the kitchen` 
    : isCompleted 
    ? `Thank you for dining with us!` 
    : `Order #${notification.orderId} status changed`;

  return (
    <div className="fixed top-5 right-4 z-50 max-w-sm w-full animate-bounce-short shadow-2xl">
      <div className={`p-4 rounded-3xl border backdrop-blur-xl shadow-xl flex items-start gap-3 transition-all ${
        isReady 
          ? 'bg-sky-500/95 text-white border-sky-400 shadow-sky-500/20' 
          : isPreparing 
          ? 'bg-rose-500/95 text-white border-rose-400 shadow-rose-500/20' 
          : 'bg-emerald-500/95 text-white border-emerald-400 shadow-emerald-500/20'
      }`}>
        {/* Status Icon */}
        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
          {isReady ? (
            <Bell className="w-5 h-5 text-white animate-bounce" />
          ) : isPreparing ? (
            <Coffee className="w-5 h-5 text-white animate-pulse" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
              Live Alert
            </span>
            <span className="text-[10px] font-mono opacity-80">#{notification.orderId}</span>
          </div>

          <h4 className="font-black text-sm text-white mt-1 leading-tight">
            {lang === 'th' ? titleTh : titleEn}
          </h4>

          <p className="text-[11px] text-white/90 mt-0.5 leading-snug line-clamp-2">
            {lang === 'th' ? descTh : descEn}
          </p>

          {/* Action button */}
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={onViewOrder}
              className="px-3 py-1 bg-white text-slate-900 rounded-xl font-black text-[11px] hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <span>{lang === 'th' ? 'ดูสถานะออเดอร์' : 'View Order Tracker'}</span>
              <ChevronRight className="w-3 h-3 text-slate-900" />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-xl bg-black/10 hover:bg-black/20 text-white/80 hover:text-white transition-colors cursor-pointer flex-shrink-0"
          aria-label="Close Notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
