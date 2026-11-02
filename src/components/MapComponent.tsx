import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Copy, Check, ExternalLink, Edit3, Clock, Phone, Sparkles } from 'lucide-react';
import { translations, Language } from '../lib/translations';
import { getStoreSettings, ShopLocationSettings } from '../lib/storeSettings';
import { MapEditModal } from './MapEditModal';

interface MapComponentProps {
  lang: Language;
}

export const MapComponent: React.FC<MapComponentProps> = ({ lang }) => {
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [location, setLocation] = useState<ShopLocationSettings>(getStoreSettings().location);
  const t = translations[lang];

  useEffect(() => {
    const sync = () => {
      setLocation(getStoreSettings().location);
    };
    window.addEventListener('store-settings-updated', sync);
    return () => window.removeEventListener('store-settings-updated', sync);
  }, []);

  const lat = location.lat;
  const lon = location.lon;
  const addressText = lang === 'th' ? location.addressTh : location.addressEn;
  const branchName = lang === 'th' ? location.branchNameTh : location.branchNameEn;

  // OSM Embed URL with marker
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.003}%2C${lat - 0.002}%2C${lon + 0.003}%2C${lat + 0.002}&layer=mapnik&marker=${lat}%2C${lon}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300 space-y-4">
        {/* Header & Edit Button */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl flex-shrink-0 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  {lang === 'th' ? 'พิกัดหน้าร้าน' : 'Pickup Location'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {lat.toFixed(6)}° N, {lon.toFixed(6)}° E
                </span>
              </div>
              <h3 className="font-black text-lg sm:text-xl text-slate-800 dark:text-white leading-tight mt-1">
                {branchName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {addressText}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow-sm border border-slate-200 dark:border-slate-700/60 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-rose-500" />
            <span>{lang === 'th' ? 'แก้ไขพิกัด & แผนที่' : 'Edit Coordinates & Map'}</span>
          </button>
        </div>

        {/* Operating Hours & Phone Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>
              {lang === 'th' ? 'เวลาเปิดบริการ:' : 'Hours:'} รอบเช้า {location.morningHours} น. • รอบเย็น {location.eveningHours} น.
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold">
            <Phone className="w-3.5 h-3.5 text-rose-500" />
            <a href={`tel:${location.phone}`} className="hover:text-rose-500 transition-colors">
              {location.phone}
            </a>
          </div>
        </div>

        {/* OSM Map Iframe */}
        <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
          <iframe
            title="Chiang Mai Pickup Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={osmEmbedUrl}
            className="filter grayscale dark:invert-[0.9] dark:hue-rotate-180 contrast-[1.1] transition-all duration-300"
          />
          <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 shadow-sm font-medium">
            © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="hover:underline">OpenStreetMap</a>
          </div>

          <div className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 backdrop-blur-md">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'th' ? 'ปักหมุดสดใหม่' : 'Live Pin'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleCopyAddress}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-sm font-medium active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500">{t.copiedAddress}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.copyAddress}</span>
              </>
            )}
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 transition-all text-sm font-medium active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>{t.openInGoogleMaps}</span>
          </a>
        </div>
      </div>

      {/* Map Editing Modal */}
      <MapEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lang={lang}
        onSaved={(newLocation) => setLocation(newLocation)}
      />
    </>
  );
};
