import React, { useState } from 'react';
import { MapPin, Navigation, Copy, Check, ExternalLink } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface MapComponentProps {
  lang: Language;
}

export const MapComponent: React.FC<MapComponentProps> = ({ lang }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const lat = 18.779833;
  const lon = 98.984472;
  const addressText = t.pickupAddress;

  // OSM Embed URL with marker
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.003}%2C${lat - 0.002}%2C${lon + 0.003}%2C${lat + 0.002}&layer=mapnik&marker=${lat}%2C${lon}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">
            {t.pickupAddressTitle}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {addressText}
          </p>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
            {lat.toFixed(6)}° N, {lon.toFixed(6)}° E
          </div>
        </div>
      </div>

      {/* OSM Map Iframe */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800 mb-4 bg-slate-100 dark:bg-slate-950">
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
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopyAddress}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-sm font-medium active:scale-95"
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
  );
};
