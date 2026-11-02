import React, { useState } from 'react';
import { 
  X, MapPin, Navigation, Save, RotateCcw, Check, Sparkles, Building2, Phone, Clock
} from 'lucide-react';
import { Language } from '../lib/translations';
import { 
  ShopLocationSettings, LOCATION_PRESETS, getStoreSettings, saveStoreSettings, resetStoreSettings 
} from '../lib/storeSettings';

interface MapEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSaved: (location: ShopLocationSettings) => void;
}

export const MapEditModal: React.FC<MapEditModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSaved
}) => {
  const currentSettings = getStoreSettings();
  const [formData, setFormData] = useState<ShopLocationSettings>({ ...currentSettings.location });
  const [successSaved, setSuccessSaved] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (presetData: Partial<ShopLocationSettings>) => {
    setFormData(prev => ({
      ...prev,
      ...presetData
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const allSettings = getStoreSettings();
    const updated = {
      ...allSettings,
      location: { ...formData }
    };
    saveStoreSettings(updated);
    onSaved(formData);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    const res = resetStoreSettings();
    setFormData({ ...res.location });
    onSaved(res.location);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      onClose();
    }, 1200);
  };

  // Preview embed url for edited coords
  const previewEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${formData.lon - 0.003}%2C${formData.lat - 0.002}%2C${formData.lon + 0.003}%2C${formData.lat + 0.002}&layer=mapnik&marker=${formData.lat}%2C${formData.lon}`;

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
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>{lang === 'th' ? 'แก้ไขพิกัด ที่อยู่ และแผนที่ร้าน' : 'Edit Coordinates, Address & Map'}</span>
                <Sparkles className="w-4 h-4 text-rose-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'th' 
                  ? 'ปรับแต่งตำแหน่งพิกัด GPS ที่อยู่ร้าน และเวลาเปิด-ปิด' 
                  : 'Customize shop GPS coordinates, address, and operating hours'}
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

        {/* Success Alert */}
        {successSaved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{lang === 'th' ? 'บันทึกตำแหน่งร้านเรียบร้อยแล้ว!' : 'Shop location updated successfully!'}</span>
          </div>
        )}

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            {lang === 'th' ? 'เลือกตำแหน่งสาขาเชียงใหม่สำเร็จรูป (Quick Presets)' : 'Chiang Mai Branch Presets'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LOCATION_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.data)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500 dark:hover:border-rose-500 text-left bg-slate-50 dark:bg-slate-950 transition-all text-xs active:scale-95 cursor-pointer group"
              >
                <div className="font-extrabold text-slate-800 dark:text-white group-hover:text-rose-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>{lang === 'th' ? preset.labelTh : preset.labelEn}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {preset.data.lat?.toFixed(6)}° N, {preset.data.lon?.toFixed(6)}° E
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Latitude */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                {lang === 'th' ? 'ละติจูด (Latitude)' : 'Latitude (°N)'}
              </label>
              <input
                type="number"
                step="0.000001"
                required
                value={formData.lat}
                onChange={(e) => setFormData(prev => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>

            {/* Longitude */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                {lang === 'th' ? 'ลองจิจูด (Longitude)' : 'Longitude (°E)'}
              </label>
              <input
                type="number"
                step="0.000001"
                required
                value={formData.lon}
                onChange={(e) => setFormData(prev => ({ ...prev, lon: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>
          </div>

          {/* Branch Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                {lang === 'th' ? 'ชื่อสาขา / ร้าน (ภาษาไทย)' : 'Branch Name (Thai)'}
              </label>
              <input
                type="text"
                required
                value={formData.branchNameTh}
                onChange={(e) => setFormData(prev => ({ ...prev, branchNameTh: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                {lang === 'th' ? 'ชื่อสาขา / ร้าน (English)' : 'Branch Name (English)'}
              </label>
              <input
                type="text"
                required
                value={formData.branchNameEn}
                onChange={(e) => setFormData(prev => ({ ...prev, branchNameEn: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>
          </div>

          {/* Address Text */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
              {lang === 'th' ? 'ที่อยู่หน้าร้าน (ภาษาไทย)' : 'Full Address (Thai)'}
            </label>
            <textarea
              rows={2}
              required
              value={formData.addressTh}
              onChange={(e) => setFormData(prev => ({ ...prev, addressTh: e.target.value }))}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
              {lang === 'th' ? 'ที่อยู่หน้าร้าน (English)' : 'Full Address (English)'}
            </label>
            <textarea
              rows={2}
              required
              value={formData.addressEn}
              onChange={(e) => setFormData(prev => ({ ...prev, addressEn: e.target.value }))}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none"
            />
          </div>

          {/* Phone and Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Phone className="w-3 h-3 text-rose-500" />
                <span>{lang === 'th' ? 'เบอร์โทรศัพท์ร้าน' : 'Store Phone'}</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>{lang === 'th' ? 'รอบเช้า' : 'Morning Hours'}</span>
              </label>
              <input
                type="text"
                value={formData.morningHours}
                onChange={(e) => setFormData(prev => ({ ...prev, morningHours: e.target.value }))}
                placeholder="06:00 - 11:00"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-rose-500" />
                <span>{lang === 'th' ? 'รอบเย็น' : 'Evening Hours'}</span>
              </label>
              <input
                type="text"
                value={formData.eveningHours}
                onChange={(e) => setFormData(prev => ({ ...prev, eveningHours: e.target.value }))}
                placeholder="16:00 - 22:00"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Live Map Preview */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500">
              {lang === 'th' ? 'ตัวอย่างแผนที่แบบเรียลไทม์ (Live Map Preview)' : 'Live Map Preview'}
            </span>
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
              <iframe
                title="Location Preview"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={previewEmbedUrl}
                className="filter grayscale dark:invert-[0.9] dark:hue-rotate-180 contrast-[1.1]"
              />
            </div>
          </div>

          {/* Actions */}
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
              <span>{lang === 'th' ? 'บันทึกพิกัดและที่อยู่ร้าน' : 'Save Location Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
