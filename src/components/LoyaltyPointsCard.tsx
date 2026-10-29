import React, { useState } from 'react';
import { Award, Sparkles, Gift, Crown, Copy, Check, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { UserProfile, Order } from '../lib/types';
import { Language, translations } from '../lib/translations';

interface LoyaltyPointsCardProps {
  currentUser: UserProfile;
  orders: Order[];
  lang: Language;
}

export const LoyaltyPointsCard: React.FC<LoyaltyPointsCardProps> = ({
  currentUser,
  orders,
  lang,
}) => {
  const t = translations[lang];
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Total spending from completed/placed orders
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  // 1 point for every ฿10 spent + 25 bonus welcome points for account holder
  const earnedFromSpending = Math.floor(totalSpent / 10);
  const welcomeBonus = 25;
  const totalPoints = earnedFromSpending + welcomeBonus;

  // Determine membership tier
  let tierName = t.loyaltyTierBronze;
  let tierColor = 'from-amber-600 to-amber-700';
  let tierBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
  let nextGoal = 50;
  let nextRewardName = lang === 'th' ? 'คูปองปาท่องโก๋กรอบ 2 ตัว ฟรี!' : 'Free 2-pc Crispy Patongko Voucher';

  if (totalPoints >= 150) {
    tierName = t.loyaltyTierGold;
    tierColor = 'from-yellow-500 via-amber-400 to-amber-600';
    tierBadge = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
    nextGoal = 300;
    nextRewardName = lang === 'th' ? 'ถุงเก็บความเย็นล้านนาแท้ 1 ใบ' : 'Authentic Lanna Cooler Bag';
  } else if (totalPoints >= 50) {
    tierName = t.loyaltyTierSilver;
    tierColor = 'from-slate-400 via-slate-300 to-slate-500';
    tierBadge = 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    nextGoal = 150;
    nextRewardName = lang === 'th' ? 'ส่วนลดเครื่องดื่ม ฿20 ทุกเมนู' : '฿20 Off Any Beverage';
  }

  // Calculate progress to next milestone
  const currentTierBase = totalPoints >= 150 ? 150 : totalPoints >= 50 ? 50 : 0;
  const progressPercent = Math.min(
    100,
    Math.round(((totalPoints - currentTierBase) / (nextGoal - currentTierBase)) * 100)
  );

  const pointsToNext = Math.max(0, nextGoal - totalPoints);

  // Available redeemable perks
  const perks = [
    {
      id: 'perk-1',
      code: 'PATONGKO-FREE',
      pointsRequired: 50,
      titleTh: 'ฟรี ปาท่องโก๋สะบัดน้ำมัน 2 ตัว',
      titleEn: 'Free 2 pcs Crispy Patongko',
      descTh: 'เสิร์ฟร้อนๆ กรอบนอกนุ่มใน',
      descEn: 'Freshly fried hot & crispy',
    },
    {
      id: 'perk-2',
      code: 'SOYMILK-VIP20',
      pointsRequired: 100,
      titleTh: 'ส่วนลด ฿20 เครื่องดื่มน้ำเต้าหู้/นมสด',
      titleEn: '฿20 Off Any Soy Milk or Milk Drink',
      descTh: 'ใช้ได้กับทุกเมนูเครื่องดื่ม',
      descEn: 'Applicable on any beverage order',
    },
    {
      id: 'perk-3',
      code: 'LANNA-BAG-GIFT',
      pointsRequired: 200,
      titleTh: 'แลกรับถุงผ้าล้านนาเก็บความเย็น',
      titleEn: 'Free Lanna Thermal Cooler Bag',
      descTh: 'ลายผ้าทอล้านนาเชียงใหม่แท้',
      descEn: 'Authentic Chiang Mai woven fabric bag',
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-5 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner">
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>{t.loyaltyTitle}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.loyaltySubtitle}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${tierBadge} flex items-center gap-1`}>
          <Crown className="w-3 h-3" />
          <span>{tierName}</span>
        </span>
      </div>

      {/* Main Points Display Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-rose-600 p-5 text-white shadow-lg shadow-rose-500/15">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-medium text-amber-100 uppercase tracking-wider flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
              <span>{lang === 'th' ? 'แต้มสะสมปัจจุบันของคุณ' : 'Your Current Points'}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black tracking-tight">{totalPoints}</span>
              <span className="text-sm font-bold text-amber-100">{t.loyaltyPointsUnit}</span>
            </div>
            <div className="text-[11px] text-white/80 mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.loyaltyRule}</span>
              <span className="text-white/60">({orders.length} {lang === 'th' ? 'ออเดอร์' : 'orders'})</span>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-right">
            <span className="text-[10px] uppercase font-bold text-amber-100 block">
              {lang === 'th' ? 'ยอดใช้จ่ายสะสม' : 'Total Spending'}
            </span>
            <span className="text-base font-black text-white">฿{totalSpent.toLocaleString()}</span>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="relative z-10 mt-4 pt-3 border-t border-white/20 space-y-1.5">
          <div className="flex justify-between items-center text-[11px] text-white/90">
            <span className="font-semibold flex items-center gap-1">
              <Gift className="w-3 h-3 text-amber-200" />
              <span>{nextRewardName}</span>
            </span>
            <span className="font-bold">
              {pointsToNext > 0 
                ? (lang === 'th' ? `ขาดอีก ${pointsToNext} แต้ม` : `${pointsToNext} pts left`)
                : (lang === 'th' ? 'ปลดล็อกแล้ว!' : 'Unlocked!')}
            </span>
          </div>
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-200 to-white rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rewards Catalog & Voucher Codes */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
          <Gift className="w-3.5 h-3.5 text-rose-500" />
          <span>{lang === 'th' ? 'สิทธิพิเศษแลกแต้มสะสม' : 'Redeemable Rewards & Perks'}</span>
        </h4>

        <div className="space-y-2">
          {perks.map((perk) => {
            const isUnlocked = totalPoints >= perk.pointsRequired;
            const isCopied = copiedCode === perk.code;

            return (
              <div 
                key={perk.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/20 hover:border-amber-500/40'
                    : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isUnlocked 
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Gift className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <span className="truncate">{lang === 'th' ? perk.titleTh : perk.titleEn}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 flex-shrink-0">
                        {perk.pointsRequired} pts
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lang === 'th' ? perk.descTh : perk.descEn}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => handleCopyCode(perk.code)}
                      className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>{lang === 'th' ? 'คัดลอกแล้ว' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{lang === 'th' ? 'รับโค้ด' : 'Get Code'}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {lang === 'th' ? `ขาดอีก ${perk.pointsRequired - totalPoints} แต้ม` : `${perk.pointsRequired - totalPoints} pts left`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
