import React, { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, Edit3, Sparkles } from 'lucide-react';
import { Language } from '../lib/translations';
import { Order, OrderFeedback } from '../lib/types';
import { db } from '../lib/firebaseMock';

interface OrderFeedbackCardProps {
  order: Order;
  lang: Language;
  isSimple: boolean;
  onFeedbackSaved?: (orderId: string, feedback: OrderFeedback) => void;
}

export const OrderFeedbackCard: React.FC<OrderFeedbackCardProps> = ({
  order,
  lang,
  isSimple,
  onFeedbackSaved
}) => {
  const existingFeedback = order.feedback;
  const [isEditing, setIsEditing] = useState<boolean>(!existingFeedback);
  const [rating, setRating] = useState<number>(existingFeedback?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingFeedback?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSavedNotification, setShowSavedNotification] = useState<boolean>(false);

  // Satisfaction text mapping
  const getRatingSentiment = (score: number) => {
    switch (score) {
      case 5:
        return lang === 'th' ? 'ยอดเยี่ยมมาก! อร่อยประทับใจ' : 'Outstanding! Truly delicious';
      case 4:
        return lang === 'th' ? 'อร่อยถูกใจ มีคุณภาพ' : 'Very Good & High Quality';
      case 3:
        return lang === 'th' ? 'รสชาติดี มาตรฐาน' : 'Good Standard Quality';
      case 2:
        return lang === 'th' ? 'พอใช้ได้ ควรปรับปรุง' : 'Fair, could be improved';
      case 1:
        return lang === 'th' ? 'ไม่ประทับใจ' : 'Needs improvement';
      default:
        return '';
    }
  };

  const quickChips = lang === 'th' ? [
    'น้ำเต้าหู้หอมเข้มข้น',
    'ปาท่องโก๋กรอบนอกนุ่มใน',
    'หวานน้อยกำลังดี ดีต่อสุขภาพ',
    'บรรจุภัณฑ์สะอาดเรียบร้อย',
    'บริการรวดเร็ว ยิ้มแย้ม'
  ] : [
    'Rich & Fragrant Soy Milk',
    'Crispy Outside Soft Inside',
    'Perfect Healthy Sweetness',
    'Clean & Neat Packaging',
    'Fast & Friendly Service'
  ];

  const handleChipClick = (chip: string) => {
    if (!comment.includes(chip)) {
      setComment(prev => prev ? `${prev}, ${chip}` : chip);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;

    setIsSubmitting(true);
    const feedbackData: OrderFeedback = {
      rating,
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    try {
      // Save directly into the Firestore order document
      await db.collection('orders').doc(order.id).set({
        feedback: feedbackData
      });

      onFeedbackSaved?.(order.id, feedbackData);
      setIsEditing(false);
      setShowSavedNotification(true);
      setTimeout(() => setShowSavedNotification(false), 3000);
    } catch (err) {
      console.error('Failed to save order feedback', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If feedback exists and not currently editing, show review summary card
  if (existingFeedback && !isEditing) {
    return (
      <div className="p-3.5 bg-gradient-to-r from-amber-500/5 via-rose-500/5 to-transparent rounded-2xl border border-amber-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= existingFeedback.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 ml-1">
              {existingFeedback.rating}.0
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              • {getRatingSentiment(existingFeedback.rating)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 p-1 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{lang === 'th' ? 'แก้ไขรีวิว' : 'Edit Review'}</span>
          </button>
        </div>

        {existingFeedback.comment && (
          <p className="text-xs text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 italic">
            "{existingFeedback.comment}"
          </p>
        )}

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            {lang === 'th' ? 'บันทึกในระบบ Firestore แล้ว' : 'Saved to Firestore Order Document'}
          </span>
          <span>
            {new Date(existingFeedback.createdAt).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    );
  }

  // Interactive feedback entry form
  const activeRating = hoverRating || rating;

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-3.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-dashed border-amber-500/30 space-y-3 transition-all ${
        isSimple ? 'text-sm' : 'text-xs'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-extrabold text-slate-800 dark:text-white text-xs">
          <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'th' ? 'รีวิวความพึงพอใจออเดอร์นี้' : 'Order Experience Feedback'}</span>
        </div>

        {existingFeedback && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </button>
        )}
      </div>

      {/* Interactive Stars Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 text-slate-300 dark:text-slate-700 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              title={`${star} ${lang === 'th' ? 'ดาว' : 'Stars'}`}
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  star <= activeRating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            </button>
          ))}
        </div>

        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
          {getRatingSentiment(activeRating)}
        </span>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex flex-wrap gap-1.5">
        {quickChips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all active:scale-95 cursor-pointer ${
              comment.includes(chip)
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400'
            }`}
          >
            + {chip}
          </button>
        ))}
      </div>

      {/* Comment Input */}
      <div>
        <textarea
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={lang === 'th' ? 'บอกเล่าความรู้สึก รสชาติน้ำเต้าหู้ หรือข้อเสนอแนะเพิ่มเติม...' : 'Share your thoughts on the soymilk taste or feedback...'}
          className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none transition-all"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          {lang === 'th' ? 'บันทึกลงในเอกสารคำสั่งซื้อ Firestore' : 'Saves to Firestore Order Document'}
        </span>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl text-xs font-black transition-all shadow-sm shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>{lang === 'th' ? 'กำลังบันทึก...' : 'Saving...'}</span>
          ) : (
            <>
              <Send className="w-3 h-3" />
              <span>{lang === 'th' ? 'บันทึกรีวิว' : 'Submit Review'}</span>
            </>
          )}
        </button>
      </div>

      {showSavedNotification && (
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{lang === 'th' ? 'ขอบคุณสำหรับรีวิว! บันทึกข้อมูลสำเร็จเรียบร้อย' : 'Thank you for your feedback! Saved to Firestore.'}</span>
        </div>
      )}
    </form>
  );
};
