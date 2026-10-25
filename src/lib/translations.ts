export type Language = 'th' | 'en';

export interface TranslationDict {
  appName: string;
  slogan: string;
  tagline: string;
  bagFeatureTitle: string;
  bagFeatureDesc: string;
  bringVesselTitle: string;
  bringVesselDesc: string;
  pickupAddressTitle: string;
  pickupAddress: string;
  openInGoogleMaps: string;
  copiedAddress: string;
  copyAddress: string;
  
  // Navigation
  navHome: string;
  navMenu: string;
  navBags: string;
  navAdmin: string;
  navMap: string;
  navProfile: string;
  
  // Theme & Modes
  lightMode: string;
  darkMode: string;
  seniorMode: string;
  normalMode: string;
  languageLabel: string;
  
  // Categories
  catDonuts: string;
  catBeverages: string;
  catDesserts: string;
  catBags: string;
  catFavorites: string;
  favorites: string;
  noFavoritesTitle: string;
  noFavoritesDesc: string;
  orderDelivered: string;
  activeOrderBadge: string;
  
  // Auth
  login: string;
  logout: string;
  signUp: string;
  email: string;
  password: string;
  forgotPassword: string;
  resetPassword: string;
  loginWithGoogle: string;
  loginWithApple: string;
  adminDemoAccess: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  welcomeBack: string;
  enterEmail: string;
  enterPassword: string;
  successLogin: string;
  successLogout: string;
  successReset: string;
  
  // Cart & Checkout
  cart: string;
  emptyCart: string;
  cartTotal: string;
  vesselDiscountApplied: string;
  bringOwnVesselToggle: string;
  checkout: string;
  paymentTitle: string;
  promptPayLabel: string;
  cashLabel: string;
  placeOrder: string;
  scanPromptPay: string;
  promptPayInstructions: string;
  uploadReceipt: string;
  submitPayment: string;
  paymentSuccess: string;
  orderStatus: string;
  orderPending: string;
  orderPreparing: string;
  orderReady: string;
  orderCompleted: string;
  itemsCount: string;
  baht: string;
  save2baht: string;
  vesselsCount: string;
  
  // Sharing
  shareTitle: string;
  sharePrompt: string;
  shareSuccess: string;
  
  // Admin
  adminPanel: string;
  dbMigrationTitle: string;
  dbMigrationDesc: string;
  supabaseToFirestore: string;
  migrateButton: string;
  migrationLogs: string;
  migrationStatus: string;
  migrationSuccess: string;
  migrationIdle: string;
  migrationRunning: string;
  inventoryTitle: string;
  addProduct: string;
  editProduct: string;
  deleteProduct: string;
  productNameTh: string;
  productNameEn: string;
  productPrice: string;
  productCategory: string;
  productStock: string;
  productImage: string;
  save: string;
  cancel: string;
  uploadImage: string;
  imagePresetLabel: string;
  imagePresetDesc: string;
  
  // Extra UI text for seniors
  tapToOrder: string;
  easySteps: string;
  step1: string;
  step1Desc: string;
  step2: string;
  step2Desc: string;
  step3: string;
  step3Desc: string;
  callShop: string;
  hot: string;
  cold: string;
  withToppings: string;
  noToppings: string;
  addToCart: string;
  addedToCart: string;
}

export const translations: Record<Language, TranslationDict> = {
  th: {
    appName: "น้ำเต้าหู้หายยา & ถุงเก็บความเย็นล้านนา",
    slogan: "สืบสานตำนานเชียงใหม่ ถุงเก็บความร้อน-เย็นที่เบากว่า พกพาง่ายกว่า และเก็บอุณหภูมิได้ดีเยี่ยม",
    tagline: "ของอร่อยหายยา คู่ถุงผ้าเชียงใหม่รักษ์โลก",
    bagFeatureTitle: "ถุงเก็บความเย็น/ร้อนล้านนา (เชียงใหม่)",
    bagFeatureDesc: "ออกแบบตามภูมิปัญญาชาวเชียงใหม่ น้ำหนักเบาพิเศษ พกพาสะดวก ช่วยรักษาอุณหภูมิเครื่องดื่มร้อนหรือเย็นได้นานกว่า 6 ชั่วโมง ผลิตจากผ้าทอพื้นเมืองวัวลาย",
    bringVesselTitle: "ลดทันที 2 บาท! เมื่อนำแก้วมาเอง",
    bringVesselDesc: "ร่วมรักษ์โลกกับเรา เพียงนำแก้วหรือกระบอกน้ำมาเอง (ขนาด 350 มล.) สำหรับใส่เครื่องดื่ม รับส่วนลดทันที 2 บาทต่อแก้ว",
    pickupAddressTitle: "จุดรับสินค้า (ร้านน้ำเต้าหู้หายยา)",
    pickupAddress: "15/4 ซอย 2 ถนนวัวลาย ตำบลหายยา อำเภอเมือง เชียงใหม่ 50100",
    openInGoogleMaps: "เปิดใน Google Maps",
    copiedAddress: "คัดลอกที่อยู่แล้ว!",
    copyAddress: "คัดลอกที่อยู่",
    
    // Navigation
    navHome: "หน้าแรก",
    navMenu: "เมนูอร่อย",
    navBags: "ถุงล้านนา",
    navAdmin: "ผู้ดูแลระบบ",
    navMap: "แผนที่ร้าน",
    navProfile: "โปรไฟล์",
    
    // Theme & Modes
    lightMode: "โหมดสว่าง",
    darkMode: "โหมดมืด",
    seniorMode: "โหมดเข้าใจง่าย (สำหรับผู้สูงวัยและเด็ก)",
    normalMode: "โหมดปกติ",
    languageLabel: "English",
    
    // Categories
    catDonuts: "ปาท่องโก๋และขนมปัง",
    catBeverages: "เครื่องดื่มอุ่นๆ/เย็น",
    catDesserts: "ของหวานแสนอร่อย",
    catBags: "ถุงเก็บความเย็นเชียงใหม่",
    catFavorites: "รายการโปรด",
    favorites: "รายการโปรด",
    noFavoritesTitle: "ยังไม่มีรายการโปรด",
    noFavoritesDesc: "กดไอคอนหัวใจ ❤️ บนเมนูเพื่อบันทึกสินค้าที่คุณชื่นชอบไว้ที่นี่",
    orderDelivered: "รับสินค้าสำเร็จ",
    activeOrderBadge: "กำลังดำเนินการ",
    
    // Auth
    login: "เข้าสู่ระบบ",
    logout: "ออกจากระบบ",
    signUp: "สมัครสมาชิก",
    email: "อีเมล",
    password: "รหัสผ่าน",
    forgotPassword: "ลืมรหัสผ่าน?",
    resetPassword: "กู้คืนรหัสผ่าน",
    loginWithGoogle: "เข้าสู่ระบบด้วย Google",
    loginWithApple: "เข้าสู่ระบบด้วย Apple",
    adminDemoAccess: "ทางเข้าด่วนสำหรับผู้ดูแลระบบ (Demo)",
    dontHaveAccount: "ยังไม่มีบัญชี? สมัครสมาชิก",
    alreadyHaveAccount: "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ",
    welcomeBack: "ยินดีต้อนรับกลับมา",
    enterEmail: "กรอกอีเมลของคุณ",
    enterPassword: "กรอกรหัสผ่านของคุณ",
    successLogin: "เข้าสู่ระบบสำเร็จ!",
    successLogout: "ออกจากระบบแล้ว",
    successReset: "ส่งลิงก์กู้คืนรหัสผ่านไปยังอีเมลของคุณแล้ว",
    
    // Cart & Checkout
    cart: "ตะกร้าสินค้า",
    emptyCart: "ตะกร้าของคุณยังว่างเปล่า เลือกเมนูอร่อยๆ ได้เลย!",
    cartTotal: "ยอดรวมทั้งหมด",
    vesselDiscountApplied: "ส่วนลดนำแก้วมาเอง",
    bringOwnVesselToggle: "ฉันนำแก้วมาเอง (ลด 2 บาทต่อแก้ว 350 มล.)",
    checkout: "ชำระเงิน",
    paymentTitle: "วิธีการชำระเงิน",
    promptPayLabel: "พร้อมเพย์ QR Code (แนะนํา)",
    cashLabel: "เงินสด (รับที่ร้าน)",
    placeOrder: "สั่งซื้อสินค้า",
    scanPromptPay: "สแกน QR Code เพื่อชำระเงิน",
    promptPayInstructions: "บันทึกรูปภาพ QR Code นี้ แล้วเปิดแอปธนาคารของคุณเพื่อสแกนจ่ายเงิน",
    uploadReceipt: "อัปโหลดสลิปการโอนเงิน",
    submitPayment: "ยืนยันการชำระเงิน",
    paymentSuccess: "ชำระเงินสำเร็จ! เรากำลังเตรียมออเดอร์ให้คุณ",
    orderStatus: "สถานะการสั่งซื้อ",
    orderPending: "รอการตรวจสอบสลิป",
    orderPreparing: "กำลังปรุงร้อนๆ",
    orderReady: "พร้อมรับสินค้าแล้ว",
    orderCompleted: "รับสินค้าเรียบร้อย",
    itemsCount: "รายการ",
    baht: "บาท",
    save2baht: "ลด 2 บ.",
    vesselsCount: "จำนวนแก้วที่นำมาเอง",
    
    // Sharing
    shareTitle: "แชร์ความอร่อย",
    sharePrompt: "แชร์ร้านน้ำเต้าหู้หายยาและถุงเก็บความเย็นล้านนาให้เพื่อนๆ",
    shareSuccess: "คัดลอกลิงก์สำหรับแชร์แล้ว!",
    
    // Admin
    adminPanel: "แผงควบคุมผู้ดูแลระบบ",
    dbMigrationTitle: "ระบบย้ายฐานข้อมูล (Supabase -> Firebase Firestore)",
    dbMigrationDesc: "เครื่องมือย้ายข้อมูลและจำลองการซิงค์แบบเรียลไทม์จาก Supabase PostgreSQL ไปยัง Firebase Firestore โครงสร้าง NoSQL",
    supabaseToFirestore: "ย้ายข้อมูล Supabase ไปยัง Firestore",
    migrateButton: "เริ่มกระบวนการย้ายข้อมูล",
    migrationLogs: "บันทึกการทำงาน (Migration Logs)",
    migrationStatus: "สถานะการย้ายข้อมูล",
    migrationSuccess: "ย้ายข้อมูลสำเร็จ 100%! ตารางทั้งหมดถูกแปลงเป็น Firestore Document Collections แล้ว",
    migrationIdle: "พร้อมสำหรับการย้ายข้อมูล",
    migrationRunning: "กำลังดึงข้อมูลจาก Supabase และแปลงเป็น Firestore Schema...",
    inventoryTitle: "จัดการคลังสินค้าและเมนู",
    addProduct: "เพิ่มสินค้าใหม่",
    editProduct: "แก้ไขสินค้า",
    deleteProduct: "ลบสินค้า",
    productNameTh: "ชื่อภาษาไทย",
    productNameEn: "ชื่อภาษาอังกฤษ",
    productPrice: "ราคา (บาท)",
    productCategory: "หมวดหมู่",
    productStock: "จำนวนในคลัง",
    productImage: "รูปภาพสินค้า",
    save: "บันทึก",
    cancel: "ยกเลิก",
    uploadImage: "อัปโหลดรูปภาพ",
    imagePresetLabel: "หรือเลือกรูปภาพที่มีอยู่",
    imagePresetDesc: "เลือกจากภาพถ่ายคุณภาพสูงที่เราเตรียมไว้ให้เพื่อความรวดเร็ว",
    
    // Extra UI text for seniors
    tapToOrder: "กดปุ่มเพื่อสั่งซื้อได้ง่ายๆ",
    easySteps: "สั่งง่ายๆ เพียง 3 ขั้นตอน",
    step1: "1. เลือกของอร่อย",
    step1Desc: "กดเลือกน้ำเต้าหู้ ปาท่องโก๋ หรือถุงล้านนาที่ต้องการ",
    step2: "2. เลือกแก้วของตัวเอง (ถ้ามี)",
    step2Desc: "ติ๊กถูกเพื่อรับส่วนลด 2 บาททันทีเมื่อนำแก้วมาเอง",
    step3: "3. จ่ายเงินและรับของ",
    step3Desc: "สแกนพร้อมเพย์แสนสะดวก แล้วมารับของร้อนๆ ที่ร้านวัวลาย ซอย 2",
    callShop: "โทรติดต่อร้าน: 081-234-5678",
    hot: "ร้อน",
    cold: "เย็น",
    withToppings: "ใส่เครื่อง",
    noToppings: "ไม่ใส่เครื่อง",
    addToCart: "ใส่ตะกร้า",
    addedToCart: "ใส่ตะกร้าแล้ว!"
  },
  en: {
    appName: "Haiya Soy Milk & Lanna Thermal Bags",
    slogan: "Chiang Mai traditional insulation bags - lighter, faster, keeping drinks icy cold or piping hot.",
    tagline: "Delicious Haiya Soy Milk paired with eco-friendly Chiang Mai bags",
    bagFeatureTitle: "Lanna Traditional Thermal Bags",
    bagFeatureDesc: "Designed inspired by Chiang Mai heritage. Ultra-lightweight, easy to carry, keeping beverages cold or hot for over 6 hours. Crafted from authentic Wua Lai local handwoven textiles.",
    bringVesselTitle: "Save 2 Baht! Bring Your Own Vessel",
    bringVesselDesc: "Join our green initiative! Bring your own cup or bottle (350ml capacity) for drinks and get a 2 Baht discount instantly on each drink.",
    pickupAddressTitle: "Pickup Point (Haiya Soy Milk)",
    pickupAddress: "15/4 Soi 2, Wua Lai Road, Tambon Hai Ya, Amphoe Mueang, Chiang Mai 50100",
    openInGoogleMaps: "Open in Google Maps",
    copiedAddress: "Address copied to clipboard!",
    copyAddress: "Copy Address",
    
    // Navigation
    navHome: "Home",
    navMenu: "Menu",
    navBags: "Lanna Bags",
    navAdmin: "Admin Panel",
    navMap: "Shop Map",
    navProfile: "Profile",
    
    // Theme & Modes
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    seniorMode: "Simple Mode (For Seniors & Kids)",
    normalMode: "Normal Mode",
    languageLabel: "ไทย",
    
    // Categories
    catDonuts: "Chinese Donuts & Bread",
    catBeverages: "Beverages",
    catDesserts: "Desserts",
    catBags: "Chiang Mai Thermal Bags",
    catFavorites: "Favorites",
    favorites: "Favorites",
    noFavoritesTitle: "No favorites yet",
    noFavoritesDesc: "Tap the heart icon ❤️ on any menu item to save your favorite dishes here.",
    orderDelivered: "Completed",
    activeOrderBadge: "In Progress",
    
    // Auth
    login: "Login",
    logout: "Logout",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    loginWithGoogle: "Login with Google",
    loginWithApple: "Login with Apple",
    adminDemoAccess: "Quick Admin Demo Access",
    dontHaveAccount: "Don't have an account? Sign Up",
    alreadyHaveAccount: "Already have an account? Login",
    welcomeBack: "Welcome Back",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    successLogin: "Logged in successfully!",
    successLogout: "Logged out successfully",
    successReset: "Password reset link sent to your email",
    
    // Cart & Checkout
    cart: "Cart",
    emptyCart: "Your cart is empty. Add some delicious treats!",
    cartTotal: "Grand Total",
    vesselDiscountApplied: "Own Cup Discount",
    bringOwnVesselToggle: "I'll bring my own vessel (Save 2 Baht per 350ml drink)",
    checkout: "Checkout",
    paymentTitle: "Payment Method",
    promptPayLabel: "PromptPay QR Code (Recommended)",
    cashLabel: "Cash (Pay at Shop)",
    placeOrder: "Place Order",
    scanPromptPay: "Scan QR Code to Pay",
    promptPayInstructions: "Save this QR Code image and open your banking app to scan and pay.",
    uploadReceipt: "Upload Payment Slip",
    submitPayment: "Confirm Payment",
    paymentSuccess: "Payment successful! We are preparing your order.",
    orderStatus: "Order Status",
    orderPending: "Awaiting slip verification",
    orderPreparing: "Preparing fresh & hot",
    orderReady: "Ready for pickup",
    orderCompleted: "Order completed",
    itemsCount: "items",
    baht: "Baht",
    save2baht: "Save ฿2",
    vesselsCount: "Vessels brought",
    
    // Sharing
    shareTitle: "Share Deliciousness",
    sharePrompt: "Share Haiya Soy Milk & Lanna Thermal Bags with your friends",
    shareSuccess: "Share link copied to clipboard!",
    
    // Admin
    adminPanel: "Admin Dashboard",
    dbMigrationTitle: "Database Migration (Supabase -> Firebase Firestore)",
    dbMigrationDesc: "A migration tool that replicates and syncs Supabase relational tables into Firebase Firestore document collections in real-time.",
    supabaseToFirestore: "Migrate Supabase to Firestore",
    migrateButton: "Start Migration Process",
    migrationLogs: "Migration Logs",
    migrationStatus: "Migration Status",
    migrationSuccess: "Migration 100% Complete! All tables converted to Firestore Document Collections.",
    migrationIdle: "Ready for migration",
    migrationRunning: "Fetching tables from Supabase and converting to Firestore Schema...",
    inventoryTitle: "Inventory & Menu Management",
    addProduct: "Add New Product",
    editProduct: "Edit Product",
    deleteProduct: "Delete Product",
    productNameTh: "Name (Thai)",
    productNameEn: "Name (English)",
    productPrice: "Price (Baht)",
    productCategory: "Category",
    productStock: "Stock Quantity",
    productImage: "Product Image",
    save: "Save",
    cancel: "Cancel",
    uploadImage: "Upload Image",
    imagePresetLabel: "Or select an existing image",
    imagePresetDesc: "Select from our prepared high-quality presets for faster setup",
    
    // Extra UI text for seniors
    tapToOrder: "Tap buttons to order easily!",
    easySteps: "Easy Order in 3 Steps",
    step1: "1. Choose Delicious Food",
    step1Desc: "Tap to select soy milk, patongko, or traditional bags.",
    step2: "2. Bring Your Cup (Optional)",
    step2Desc: "Check the box to get 2 Baht discount for bringing your own cup.",
    step3: "3. Pay & Collect",
    step3Desc: "Scan PromptPay QR, then pick up warm food at Wua Lai Road Soi 2.",
    callShop: "Call Shop: 081-234-5678",
    hot: "Hot",
    cold: "Cold",
    withToppings: "With Toppings",
    noToppings: "Plain",
    addToCart: "Add to Cart",
    addedToCart: "Added!"
  }
};
