import React from 'react';
import { CheckCircle2, Clock, ArrowRight, X, Sparkles, ShoppingBag, MessageSquare } from 'lucide-react';
import { Order } from '../lib/types';
import { Language } from '../lib/translations';

interface OrderSuccessModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onTrackOrder: () => void;
  lang: Language;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  order,
  onClose,
  onTrackOrder,
  lang,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 transition-all animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header & Close Icon */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-7 h-7 animate-bounce text-emerald-500" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'th' ? 'สั่งซื้อสำเร็จเรียบร้อย' : 'Order Placed Successfully'}</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            {lang === 'th' ? 'ขอบคุณสำหรับคำสั่งซื้อ!' : 'Thank you for your order!'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'th'
              ? 'ทางร้านได้รับคำสั่งซื้อของคุณแล้ว และกำลังเริ่มจัดเตรียม'
              : "We've received your order and the kitchen is getting it ready."}
          </p>
        </div>

        {/* Order Details Summary Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="font-mono text-[11px] text-slate-500">
              #{order.id}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {order.paymentMethod === 'promptpay' ? 'PromptPay' : (lang === 'th' ? 'ชำระเงินสด' : 'Cash')}
            </span>
          </div>

          {/* Items breakdown */}
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-200">
                <span className="truncate pr-2">
                  {lang === 'th' ? item.nameTh : item.nameEn} <span className="font-bold text-slate-400">x{item.quantity}</span>
                </span>
                <span className="font-bold flex-shrink-0">฿{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Special Requests Note */}
          {order.specialInstructions && (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 text-[11px]">
              <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {lang === 'th' ? 'คำขอพิเศษ / แพ้อาหาร:' : 'Special Requests / Allergies:'}
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-300">
                  {order.specialInstructions}
                </span>
              </div>
            </div>
          )}

          {/* Subtotal & Total */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between items-center text-xs">
            {order.discount > 0 && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                {lang === 'th' ? `ส่วนลดภาชนะ (-฿${order.discount})` : `Vessel Discount (-฿${order.discount})`}
              </span>
            )}
            <div className="ml-auto text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-2">
                {lang === 'th' ? 'ยอดสุทธิ' : 'Total'}
              </span>
              <span className="text-lg font-black text-rose-500">
                ฿{order.total}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onTrackOrder}
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>{lang === 'th' ? 'ติดตามสถานะออเดอร์ (Track your order)' : 'Track your order'}</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl text-xs transition-all active:scale-95 cursor-pointer"
          >
            {lang === 'th' ? 'สั่งซื้อเมนูอื่นเพิ่มเติม' : 'Continue Shopping'}
          </button>
        </div>
      </div>
    </div>
  );
};
