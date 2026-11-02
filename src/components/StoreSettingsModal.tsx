import React, { useState } from 'react';
import { 
  X, QrCode, Share2, Save, RotateCcw, Check, Sparkles, Phone, 
  Facebook, Instagram, MessageCircle, ExternalLink, ShieldCheck, Upload
} from 'lucide-react';
import { Language } from '../lib/translations';
import { 
  StoreSettings, getStoreSettings, saveStoreSettings, resetStoreSettings 
} from '../lib/storeSettings';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'promptpay' | 'social'>('promptpay');
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings());
  const [successSaved, setSuccessSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settings);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    const res = resetStoreSettings();
    setSettings(res);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 transition-all max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>{lang === 'th' ? 'ตั้งค่าพร้อมเพย์และโซเชียลมีเดีย' : 'PromptPay & Social Media Settings'}</span>
                <Sparkles className="w-4 h-4 text-rose-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'th' 
                  ? 'ปรับแต่งหมายเลขบัญชีรับเงิน QR Code และช่องทางติดต่อโซเชียล' 
                  : 'Customize payment details, PromptPay QR, and official social media'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <button
            type="button"
            onClick={() => setActiveSubTab('promptpay')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
              activeSubTab === 'promptpay'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span>{lang === 'th' ? 'การตั้งค่า PromptPay QR' : 'PromptPay QR Settings'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('social')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
              activeSubTab === 'social'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Share2 className="w-4 h-4 text-rose-500" />
            <span>{lang === 'th' ? 'ช่องทางโซเชียลมีเดีย' : 'Social Media Links'}</span>
          </button>
        </div>

        {/* Success Alert */}
        {successSaved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{lang === 'th' ? 'บันทึกการตั้งค่าร้านค้าเรียบร้อยแล้ว!' : 'Settings updated successfully!'}</span>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {activeSubTab === 'promptpay' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-rose-500/5 dark:bg-rose-950/20 rounded-2xl border border-rose-500/10 flex items-center gap-3">
                <div className="p-2.5 bg-rose-500 text-white rounded-xl">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-extrabold text-slate-800 dark:text-white">
                    {lang === 'th' ? 'ระบบชำระเงินสแกนจ่ายไทยแลนด์' : 'Thailand PromptPay System'}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'th' 
                      ? 'ข้อมูลนี้จะแสดงในหน้าชำระเงินของตะกร้าสินค้าสำหรับลูกค้าทุกคน' 
                      : 'These payment details will be displayed to all customers at checkout'}
                  </div>
                </div>
              </div>

              {/* PromptPay Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                  {lang === 'th' ? 'หมายเลขพร้อมเพย์ (เบอร์โทรศัพท์ หรือ เลขประจำตัวผู้เสียภาษี)' : 'PromptPay Account / Phone / Tax ID'}
                </label>
                <input
                  type="text"
                  required
                  value={settings.promptpay.accountNumber}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    promptpay: { ...prev.promptpay, accountNumber: e.target.value }
                  }))}
                  placeholder="089-556-7890"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Account Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                  {lang === 'th' ? 'ชื่อบัญชีผู้รับเงิน (Account Name)' : 'Account Recipient Name'}
                </label>
                <input
                  type="text"
                  required
                  value={settings.promptpay.accountName}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    promptpay: { ...prev.promptpay, accountName: e.target.value }
                  }))}
                  placeholder="จิ๊กโก๋ สะบัดน้ำมัน สาขาช้างเผือก"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Bank Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                  {lang === 'th' ? 'ธนาคารผู้ให้บริการ (Bank Name)' : 'Bank Name'}
                </label>
                <input
                  type="text"
                  required
                  value={settings.promptpay.bankName}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    promptpay: { ...prev.promptpay, bankName: e.target.value }
                  }))}
                  placeholder="ธนาคารกสิกรไทย (Kasikornbank)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* PromptPay Note */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                  {lang === 'th' ? 'คำแนะนำการชำระเงินสำหรับลูกค้า' : 'Instructions for Customers'}
                </label>
                <textarea
                  rows={2}
                  value={settings.promptpay.promptPayNote || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    promptpay: { ...prev.promptpay, promptPayNote: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none resize-none"
                />
              </div>
            </div>
          )}

          {activeSubTab === 'social' && (
            <div className="space-y-4 animate-fade-in">
              {/* Facebook */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  <span>Facebook Page URL</span>
                </label>
                <input
                  type="url"
                  value={settings.social.facebookUrl}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social: { ...prev.social, facebookUrl: e.target.value }
                  }))}
                  placeholder="https://facebook.com/jikkosabatnamman"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>Instagram Profile URL & Handle</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    value={settings.social.instagramUrl}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, instagramUrl: e.target.value }
                    }))}
                    placeholder="https://instagram.com/jikkosabatnamman"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
                  />
                  <input
                    type="text"
                    value={settings.social.instagramHandle}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, instagramHandle: e.target.value }
                    }))}
                    placeholder="@jikkosabatnamman"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* LINE Official */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>LINE Official Account ID & Link</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={settings.social.lineId}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, lineId: e.target.value }
                    }))}
                    placeholder="@jikkosabat"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
                  />
                  <input
                    type="url"
                    value={settings.social.lineUrl}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      social: { ...prev.social, lineUrl: e.target.value }
                    }))}
                    placeholder="https://line.me/ti/p/@jikkosabat"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* TikTok */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-slate-800 dark:text-white" />
                  <span>TikTok Profile URL</span>
                </label>
                <input
                  type="url"
                  value={settings.social.tiktokUrl}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social: { ...prev.social, tiktokUrl: e.target.value }
                  }))}
                  placeholder="https://tiktok.com/@jikkosabatnamman"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-500" />
                  <span>{lang === 'th' ? 'เบอร์โทรศัพท์สายด่วนหน้าร้าน' : 'Customer Hotline Number'}</span>
                </label>
                <input
                  type="text"
                  value={settings.social.phoneNumber}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social: { ...prev.social, phoneNumber: e.target.value }
                  }))}
                  placeholder="089-556-7890"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'th' ? 'คืนค่าเริ่มต้น' : 'Reset Default'}</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-xs transition-all active:scale-95 shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'th' ? 'บันทึกการตั้งค่าร้านค้า' : 'Save Store Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
