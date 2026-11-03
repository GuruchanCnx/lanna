export interface ShopLocationSettings {
  branchNameTh: string;
  branchNameEn: string;
  addressTh: string;
  addressEn: string;
  lat: number;
  lon: number;
  phone: string;
  morningHours: string; // e.g. "06:00 - 11:00"
  eveningHours: string; // e.g. "16:00 - 22:00"
  googleMapsUrl?: string;
}

export interface PromptPaySettings {
  accountNumber: string; // Phone or Tax ID (e.g. "089-123-4567")
  accountName: string;   // e.g. "จิ๊กโก๋ สะบัดน้ำมัน สาขาช้างเผือก"
  bankName: string;      // e.g. "ธนาคารกสิกรไทย (Kasikornbank)"
  qrImageUrl?: string;
  promptPayNote?: string;
}

export interface SocialMediaSettings {
  facebookUrl: string;
  facebookName: string;
  instagramUrl: string;
  instagramHandle: string;
  lineId: string;
  lineUrl: string;
  tiktokUrl: string;
  tiktokHandle: string;
  phoneNumber: string;
}

export interface StoreSettings {
  location: ShopLocationSettings;
  promptpay: PromptPaySettings;
  social: SocialMediaSettings;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  location: {
    branchNameTh: "สาขาถนนวัวลาย ซอย 2 (เชียงใหม่)",
    branchNameEn: "Wua Lai Road Soi 2 Branch (Chiang Mai)",
    addressTh: "15/4 ถนนวัวลาย ซอย 2 ตำบลหายยา อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50100",
    addressEn: "15/4 Wua Lai Road Soi 2, Tambon Hai Ya, Amphoe Mueang, Chiang Mai 50100",
    lat: 18.779833,
    lon: 98.984472,
    phone: "089-556-7890",
    morningHours: "06:00 - 11:00",
    eveningHours: "16:00 - 22:00",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=18.779833,98.984472"
  },
  promptpay: {
    accountNumber: "089-556-7890",
    accountName: "จิ๊กโก๋ สะบัดน้ำมัน (Jikko Sabat Namman)",
    bankName: "ธนาคารกสิกรไทย (Kasikornbank)",
    promptPayNote: "สแกน QR Code แล้วระบบจะตรวจสอบและส่งเข้าครัวปรุงสดทันที"
  },
  social: {
    facebookUrl: "https://facebook.com/jikkosabatnamman",
    facebookName: "จิ๊กโก๋ สะบัดน้ำมัน เชียงใหม่",
    instagramUrl: "https://instagram.com/jikkosabatnamman",
    instagramHandle: "@jikkosabatnamman",
    lineId: "@jikkosabat",
    lineUrl: "https://line.me/ti/p/@jikkosabat",
    tiktokUrl: "https://tiktok.com/@jikkosabatnamman",
    tiktokHandle: "@jikkosabatnamman",
    phoneNumber: "089-556-7890"
  }
};

export const LOCATION_PRESETS: { labelTh: string; labelEn: string; data: Partial<ShopLocationSettings> }[] = [
  {
    labelTh: "สาขาถนนวัวลาย ซอย 2 (จุดรับสินค้าหลัก)",
    labelEn: "Wua Lai Road Soi 2 (Main Pickup Location)",
    data: {
      branchNameTh: "น้ำเต้าหู้วัวลาย ซอย 2 (หายยา เชียงใหม่)",
      branchNameEn: "Wua Lai Soi 2 Soy Milk Shop (Haiya, Chiang Mai)",
      addressTh: "15/4 ถนนวัวลาย ซอย 2 ตำบลหายยา อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50100",
      addressEn: "15/4 Wua Lai Road Soi 2, Tambon Hai Ya, Amphoe Mueang, Chiang Mai 50100",
      lat: 18.779833,
      lon: 98.984472,
    }
  }
];

const STORAGE_KEY = 'fs_store_settings';

export function getStoreSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      location: { ...DEFAULT_STORE_SETTINGS.location, ...(parsed.location || {}) },
      promptpay: { ...DEFAULT_STORE_SETTINGS.promptpay, ...(parsed.promptpay || {}) },
      social: { ...DEFAULT_STORE_SETTINGS.social, ...(parsed.social || {}) }
    };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Trigger custom event so any active component can re-sync without full reload
    window.dispatchEvent(new Event('store-settings-updated'));
  } catch (err) {
    console.warn('Failed to save store settings to localStorage', err);
  }
}

export function resetStoreSettings(): StoreSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('store-settings-updated'));
  } catch {
    // ignore
  }
  return DEFAULT_STORE_SETTINGS;
}

/**
 * Checks if the store is currently open based on current local time
 * Operating sessions:
 * Morning: 06:00 - 11:00
 * Evening: 16:00 - 22:00
 */
export function checkStoreStatus(): {
  isOpen: boolean;
  session: 'morning' | 'evening' | 'closed';
  messageTh: string;
  messageEn: string;
  nextOpenTh: string;
  nextOpenEn: string;
} {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const morningStart = 6 * 60;   // 06:00 = 360 min
  const morningEnd = 11 * 60;    // 11:00 = 660 min
  const eveningStart = 16 * 60;  // 16:00 = 960 min
  const eveningEnd = 22 * 60;    // 22:00 = 1320 min

  if (currentMinutes >= morningStart && currentMinutes < morningEnd) {
    return {
      isOpen: true,
      session: 'morning',
      messageTh: 'ร้านเปิดบริการรอบเช้า (06:00 - 11:00 น.)',
      messageEn: 'Open Now: Morning Session (06:00 - 11:00)',
      nextOpenTh: 'ปิดรอบเช้า 11:00 น. และเปิดอีกครั้ง 16:00 น.',
      nextOpenEn: 'Morning session closes at 11:00, reopens at 16:00'
    };
  }

  if (currentMinutes >= eveningStart && currentMinutes < eveningEnd) {
    return {
      isOpen: true,
      session: 'evening',
      messageTh: 'ร้านเปิดบริการรอบเย็น (16:00 - 22:00 น.)',
      messageEn: 'Open Now: Evening Session (16:00 - 22:00)',
      nextOpenTh: 'เปิดบริการถึง 22:00 น.',
      nextOpenEn: 'Open until 22:00 tonight'
    };
  }

  // If before morning session
  if (currentMinutes < morningStart) {
    return {
      isOpen: false,
      session: 'closed',
      messageTh: 'ขณะนี้นอกเวลาทำการ (เปิดบริการรอบเช้า 06:00 น.)',
      messageEn: 'Currently closed (Opens at 06:00 AM)',
      nextOpenTh: 'เปิดรอบเช้า 06:00 - 11:00 น.',
      nextOpenEn: 'Opens today at 06:00 AM'
    };
  }

  // Between morning and evening (11:00 - 16:00)
  if (currentMinutes >= morningEnd && currentMinutes < eveningStart) {
    return {
      isOpen: false,
      session: 'closed',
      messageTh: 'พักเบรคระหว่างรอบ (เปิดบริการรอบเย็น 16:00 น.)',
      messageEn: 'Between Sessions (Reopens at 16:00 PM)',
      nextOpenTh: 'เปิดรอบเย็น 16:00 - 22:00 น.',
      nextOpenEn: 'Reopens today at 16:00 PM'
    };
  }

  // After evening (22:00+)
  return {
    isOpen: false,
    session: 'closed',
    messageTh: 'ร้านปิดบริการแล้ว (พบกันใหม่พรุ่งนี้ 06:00 น.)',
    messageEn: 'Closed for the night (Opens tomorrow at 06:00 AM)',
    nextOpenTh: 'เปิดพรุ่งนี้เช้า 06:00 น.',
    nextOpenEn: 'Reopens tomorrow at 06:00 AM'
  };
}
