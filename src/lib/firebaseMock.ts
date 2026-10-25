import { Product, Order, UserProfile, Category } from './types';

// Initial products as described in the prompt
const INITIAL_PRODUCTS: Product[] = [
  // Chinese Donuts & Bread (ปาท่องโก๋และขนมปัง)
  {
    id: "donut-1",
    nameTh: "ปาท่องโก๋",
    nameEn: "Chinese Donuts (Patongko)",
    price: 15,
    category: "donuts",
    stock: 120,
    image: "/images/patongko-soy.png",
    descriptionTh: "ปาท่องโก๋ทอดใหม่ร้อนๆ กรอบนอกนุ่มใน",
    descriptionEn: "Freshly fried Chinese donuts, crispy on the outside, soft inside"
  },
  {
    id: "donut-2",
    nameTh: "ซอสสังขยาใบเตย",
    nameEn: "Pandan Sauce",
    price: 10,
    category: "donuts",
    stock: 80,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "สังขยาใบเตยเข้มข้น หอมกลิ่นใบเตยแท้",
    descriptionEn: "Rich and aromatic authentic pandan custard sauce"
  },
  {
    id: "donut-3",
    nameTh: "นมข้นหวาน",
    nameEn: "Condensed Milk",
    price: 8,
    category: "donuts",
    stock: 100,
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "นมข้นหวานคุณภาพดี หวานมันกลมกล่อม",
    descriptionEn: "High-quality sweet and creamy condensed milk"
  },
  {
    id: "donut-4",
    nameTh: "ปาท่องโก๋จิ้มสังขยาใบเตย",
    nameEn: "Chinese Donuts with Pandan Sauce",
    price: 25,
    category: "donuts",
    stock: 90,
    image: "/images/patongko-soy.png",
    descriptionTh: "ชุดปาท่องโก๋คู่กับซอสสังขยาใบเตยแสนอร่อย",
    descriptionEn: "Chinese donuts set served with delicious pandan custard sauce"
  },
  {
    id: "donut-5",
    nameTh: "ปาท่องโก๋จิ้มนมข้นหวาน",
    nameEn: "Chinese Donuts with Condensed Milk Sauce",
    price: 22,
    category: "donuts",
    stock: 90,
    image: "/images/patongko-soy.png",
    descriptionTh: "ชุดปาท่องโก๋คู่กับนมข้นหวาน",
    descriptionEn: "Chinese donuts set served with sweet condensed milk"
  },
  {
    id: "donut-6",
    nameTh: "ปาท่องโก๋สอดไส้นมข้นหวาน",
    nameEn: "Chinese Donuts with Condensed Milk (Filled)",
    price: 28,
    category: "donuts",
    stock: 60,
    image: "/images/patongko-soy.png",
    descriptionTh: "ปาท่องโก๋ทอดกรอบสอดไส้นมข้นหวานเยิ้มๆ ด้านใน",
    descriptionEn: "Crispy Chinese donuts filled with sweet condensed milk inside"
  },
  {
    id: "donut-7",
    nameTh: "ปาท่องโก๋สอดไส้สังขยาใบเตย",
    nameEn: "Chinese Donuts with Pandan Sauce (Filled)",
    price: 30,
    category: "donuts",
    stock: 60,
    image: "/images/patongko-soy.png",
    descriptionTh: "ปาท่องโก๋ทอดกรอบสอดไส้สังขยาใบเตยหอมละมุน",
    descriptionEn: "Crispy Chinese donuts filled with fragrant pandan custard"
  },
  {
    id: "donut-8",
    nameTh: "ขนมปังนึ่งราดนมข้นหวาน",
    nameEn: "Bread with Condensed Milk",
    price: 25,
    category: "donuts",
    stock: 50,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "ขนมปังนึ่งร้อนๆ นุ่มฟู ราดนมข้นหวานเยิ้ม",
    descriptionEn: "Steamed soft and fluffy bread drizzled with condensed milk"
  },
  {
    id: "donut-9",
    nameTh: "ขนมปังนึ่งราดสังขยาใบเตย",
    nameEn: "Bread with Pandan Sauce",
    price: 28,
    category: "donuts",
    stock: 50,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "ขนมปังนึ่งเหนียวนุ่ม ราดซอสสังขยาใบเตยหอมหวาน",
    descriptionEn: "Steamed soft bread drizzled with fragrant pandan custard sauce"
  },

  // Beverages (เครื่องดื่ม - บรรจุถุงพลาสติก 350 มล. แบบดั้งเดิม)
  {
    id: "bev-1",
    nameTh: "น้ำเต้าหู้ (ถุงพลาสติก 350 มล.)",
    nameEn: "Soy Milk (350ml Plastic Bag)",
    price: 15,
    category: "beverages",
    stock: 200,
    image: "/images/patongko-soy.png",
    descriptionTh: "น้ำเต้าหู้คั้นสดแท้ 100% บรรจุในถุงพลาสติกมัดหนังยางร้อนๆ ขนาด 350 มล. สามารถนำแก้วมาเองเพื่อลดโลกร้อนและประหยัด 2 บาท",
    descriptionEn: "100% fresh home-brewed soy milk served in a traditional 350ml plastic bag tied with a rubber band. Bring your own cup/vessel to save 2 Baht!",
    isBeverage: true
  },
  {
    id: "bev-2",
    nameTh: "นมสดแท้ (ถุงพลาสติก 350 มล.)",
    nameEn: "Fresh Milk (350ml Plastic Bag)",
    price: 20,
    category: "beverages",
    stock: 150,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "นมสดโคแท้จากฟาร์มท้องถิ่น ร้อนๆ บรรจุในถุงพลาสติกมัดหนังยางขนาด 350 มล. นำแก้วมาเองประหยัด 2 บาท",
    descriptionEn: "100% pure fresh cow milk from local farms served in a traditional 350ml plastic bag tied with a rubber band. Bring your own cup/vessel to save 2 Baht!",
    isBeverage: true
  },
  {
    id: "bev-3",
    nameTh: "น้ำขิงแก่ (ถุงพลาสติก 350 มล.)",
    nameEn: "Ginger Water (350ml Plastic Bag)",
    price: 18,
    category: "beverages",
    stock: 100,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "น้ำขิงต้มสดจากขิงแก่เผ็ดร้อน บรรจุในถุงพลาสติกมัดหนังยางขนาด 350 มล. นำแก้วมาเองประหยัด 2 บาท",
    descriptionEn: "Spicy ginger water brewed from aged ginger, served in a traditional 350ml plastic bag tied with a rubber band. Bring your own cup/vessel to save 2 Baht!",
    isBeverage: true
  },

  // Desserts (ของหวาน)
  {
    id: "des-1",
    nameTh: "เต้าฮวยน้ำขิง",
    nameEn: "Tofu Pudding",
    price: 25,
    category: "desserts",
    stock: 80,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "เต้าฮวยเนื้อเนียนนุ่มละมุนลิ้น เสิร์ฟในน้ำขิงแก่ร้อนรสเผ็ดร้อน",
    descriptionEn: "Silky soft tofu pudding served in hot, spicy-sweet ginger soup."
  },
  {
    id: "des-2",
    nameTh: "วุ้นน้ำบาร์เลย์เมล็ดแมงลัก",
    nameEn: "Jelly with Basil Seeds Barley",
    price: 20,
    category: "desserts",
    stock: 70,
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "วุ้นเย็นชื่นใจ ผสมเมล็ดแมงลักและลูกบาร์เลย์เคี้ยวหนึบ",
    descriptionEn: "Refreshing cold jelly with fiber-rich basil seeds and chewy barley grains."
  },
  {
    id: "des-3",
    nameTh: "บัวลอยน้ำขิงงาดำ",
    nameEn: "Black Sesame Dumplings in Ginger Soup",
    price: 35,
    category: "desserts",
    stock: 60,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "บัวลอยแป้งเหนียวนุ่ม สอดไส้งาดำบดหอมหวาน เสิร์ฟในน้ำขิงร้อน",
    descriptionEn: "Chewy rice dumplings stuffed with sweet black sesame paste, in hot ginger soup."
  },
  {
    id: "des-4",
    nameTh: "งาดำบดร้อน",
    nameEn: "Black Sesame Soup",
    price: 30,
    category: "desserts",
    stock: 50,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "ซุปงาดำบดแท้เข้มข้น หอมงาคั่ว มีสารต้านอนุมูลอิสระสูง",
    descriptionEn: "Rich and creamy roasted black sesame paste soup, highly nutritious and aromatic."
  },
  {
    id: "des-5",
    nameTh: "โอวัลตินภูเขาไฟ",
    nameEn: "Ovaltine Volcano",
    price: 25,
    category: "desserts",
    stock: 90,
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=400",
    descriptionTh: "เครื่องดื่มโอวัลตินเย็น ท็อปด้วยผงโอวัลตินพูนๆ เคี้ยวกรุบกรอบสะใจเด็กๆ",
    descriptionEn: "Chilled sweet Ovaltine topped with a mountain of crunchy chocolate malt powder."
  },
  {
    id: "des-6",
    nameTh: "แปะก๊วยต้มน้ำเชื่อม",
    nameEn: "Ginkgo Nuts in Syrup",
    price: 35,
    category: "desserts",
    stock: 50,
    image: "/images/tao-tung.png",
    descriptionTh: "แปะก๊วยคัดเกรด เม็ดใหญ่หวานมัน ต้มในน้ำเชื่อมใบเตยหอมเย็น",
    descriptionEn: "Premium ginkgo nuts, slightly bitter-sweet and nutty, boiled in fragrant pandan syrup."
  },
  {
    id: "des-7",
    nameTh: "เต้าทึงน้ำลำไย",
    nameEn: "Tao Tung (Assorted Chinese Dessert)",
    price: 40,
    category: "desserts",
    stock: 80,
    image: "/images/tao-tung.png",
    descriptionTh: "รวมมิตรธัญพืชสมุนไพร แปะก๊วย บาร์เลย์ ถั่วแดง วุ้น และรากบัว ในน้ำลำไยหอมหวาน",
    descriptionEn: "Traditional cold dessert with mixed grains, lotus roots, ginkgo, and beans in sweet longan juice."
  },
  {
    id: "des-8",
    nameTh: "ท็อปปิ้งรวมมิตรเต้าทึง",
    nameEn: "Various Toppings for Tao Tung",
    price: 15,
    category: "desserts",
    stock: 100,
    image: "/images/tao-tung.png",
    descriptionTh: "ชุดท็อปปิ้งธัญพืชเพิ่มเติมสำหรับเติมใส่เต้าทึงหรือเต้าฮวยตามใจชอบ",
    descriptionEn: "Extra toppings assortment containing red beans, barley, lotus seeds, and jelly."
  },

  // Bags (Traditional Chiang Mai insulation bags)
  {
    id: "bag-1",
    nameTh: "ถุงผ้าทอลายเชียงใหม่วัวลาย (สีเงินคลาสสิก)",
    nameEn: "Wua Lai Silver Tradition Thermal Bag",
    price: 180,
    category: "bags",
    stock: 45,
    image: "/images/chiangmai-bag.png",
    descriptionTh: "ถุงเก็บความเย็น/ร้อนลายทอเครื่องเงินวัวลายอันเป็นเอกลักษณ์ เบาพิเศษ พกพาสะดวก รักษาอุณหภูมิได้ยอดเยี่ยม",
    descriptionEn: "Thermal bag featuring the unique Wua Lai silver-weaving pattern. Ultra-light, fast carrying, excellent insulation."
  },
  {
    id: "bag-2",
    nameTh: "ถุงผ้าฝ้ายทอมือสีครามธรรมชาติ (ล้านนาสไตล์)",
    nameEn: "Indigo Handwoven Lanna Thermal Bag",
    price: 195,
    category: "bags",
    stock: 30,
    image: "/images/chiangmai-bag.png",
    descriptionTh: "ถุงเก็บอุณหภูมิผ้าฝ้ายแท้ย้อมครามธรรมชาติจากเชียงใหม่ บุฟอยล์เก็บความเย็นด้านในหนา 3 ชั้น เก็บความเย็นได้นานกว่า",
    descriptionEn: "Genuine natural indigo-dyed cotton thermal bag with 3-layer insulation. Keeps drinks cold/hot up to 6 hours."
  },
  {
    id: "bag-3",
    nameTh: "ถุงไม้ไผ่สานล้านนารักษ์โลก (ซับในผ้าฝ้าย)",
    nameEn: "Eco Bamboo-Weave Lanna Thermal Bag",
    price: 220,
    category: "bags",
    stock: 25,
    image: "/images/chiangmai-bag.png",
    descriptionTh: "งานแฮนด์เมดเชียงใหม่ โครงสร้างไม้ไผ่สานละเอียด บุด้วยฉนวนเก็บความร้อน-เย็นถอดซักได้ ดีไซน์มินิมอลเก๋ไก๋",
    descriptionEn: "Handcrafted Chiang Mai bamboo weave with removable high-performance thermal lining. Elegant, eco-friendly, and lightweight."
  }
];

const DEFAULT_USER: UserProfile = {
  uid: "admin-demo-id",
  email: "admin@haiyasoymilk.com",
  displayName: "Admin Chiang Mai",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  isAdmin: true,
  provider: "email"
};

// Initialize LocalStorage Database Simulator
class FirebaseFirestoreSimulator {
  private products: Product[] = [];
  private orders: Order[] = [];
  private currentUser: UserProfile | null = null;
  private isMigrated: boolean = false;
  private migrationLogs: string[] = [];
  private firestoreLogs: { timestamp: string; action: string; code: string }[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedProducts = localStorage.getItem('fs_products');
    let forceRefresh = false;
    if (storedProducts) {
      try {
        const parsed = JSON.parse(storedProducts);
        const hasPlasticBag = parsed.some((p: any) => p.id === 'bev-1' && p.nameEn.includes('Plastic Bag'));
        if (!hasPlasticBag) forceRefresh = true;
      } catch (e) {
        forceRefresh = true;
      }
    }

    if (storedProducts && !forceRefresh) {
      this.products = JSON.parse(storedProducts);
    } else {
      this.products = INITIAL_PRODUCTS;
      this.saveProducts();
    }

    const storedOrders = localStorage.getItem('fs_orders');
    this.orders = storedOrders ? JSON.parse(storedOrders) : [];

    const storedUser = localStorage.getItem('fs_current_user');
    this.currentUser = storedUser ? JSON.parse(storedUser) : null;

    const storedMigrated = localStorage.getItem('fs_is_migrated');
    this.isMigrated = storedMigrated ? JSON.parse(storedMigrated) : false;

    const storedMigLogs = localStorage.getItem('fs_migration_logs');
    this.migrationLogs = storedMigLogs ? JSON.parse(storedMigLogs) : [];

    const storedFsLogs = localStorage.getItem('fs_firestore_logs');
    this.firestoreLogs = storedFsLogs ? JSON.parse(storedFsLogs) : [];
  }

  private saveProducts() {
    localStorage.setItem('fs_products', JSON.stringify(this.products));
  }

  private saveOrders() {
    localStorage.setItem('fs_orders', JSON.stringify(this.orders));
  }

  private saveUser() {
    if (this.currentUser) {
      localStorage.setItem('fs_current_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('fs_current_user');
    }
  }

  private saveMigrationState() {
    localStorage.setItem('fs_is_migrated', JSON.stringify(this.isMigrated));
    localStorage.setItem('fs_migration_logs', JSON.stringify(this.migrationLogs));
  }

  private logFirestoreOp(action: string, code: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.firestoreLogs.unshift({ timestamp, action, code });
    if (this.firestoreLogs.length > 50) this.firestoreLogs.pop();
    localStorage.setItem('fs_firestore_logs', JSON.stringify(this.firestoreLogs));
  }

  // FIRESTORE-LIKE API
  public collection(name: string) {
    const self = this;
    return {
      get: async () => {
        self.logFirestoreOp(`getDocs(collection(db, "${name}"))`, `const querySnapshot = await getDocs(collection(db, "${name}"));`);
        if (name === 'products') return self.products;
        if (name === 'orders') return self.orders;
        return [];
      },
      add: async (data: any) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newItem = { id, ...data };
        self.logFirestoreOp(
          `addDoc(collection(db, "${name}"), data)`,
          `const docRef = await addDoc(collection(db, "${name}"), ${JSON.stringify(data, null, 2)});`
        );
        if (name === 'products') {
          self.products.push(newItem);
          self.saveProducts();
        } else if (name === 'orders') {
          self.orders.unshift(newItem);
          self.saveOrders();
        }
        return newItem;
      },
      doc: (docId: string) => {
        return {
          set: async (data: any) => {
            self.logFirestoreOp(
              `setDoc(doc(db, "${name}", "${docId}"), data)`,
              `await setDoc(doc(db, "${name}", "${docId}"), ${JSON.stringify(data, null, 2)});`
            );
            if (name === 'products') {
              const idx = self.products.findIndex(p => p.id === docId);
              if (idx !== -1) {
                self.products[idx] = { ...self.products[idx], ...data };
              } else {
                self.products.push({ id: docId, ...data } as Product);
              }
              self.saveProducts();
            } else if (name === 'orders') {
              const idx = self.orders.findIndex(o => o.id === docId);
              if (idx !== -1) {
                self.orders[idx] = { ...self.orders[idx], ...data };
              } else {
                self.orders.push({ id: docId, ...data } as Order);
              }
              self.saveOrders();
            }
            return { success: true };
          },
          delete: async () => {
            self.logFirestoreOp(
              `deleteDoc(doc(db, "${name}", "${docId}"))`,
              `await deleteDoc(doc(db, "${name}", "${docId}"));`
            );
            if (name === 'products') {
              self.products = self.products.filter(p => p.id !== docId);
              self.saveProducts();
            } else if (name === 'orders') {
              self.orders = self.orders.filter(o => o.id !== docId);
              self.saveOrders();
            }
            return { success: true };
          }
        };
      }
    };
  }

  // MOCK AUTHENTICATION (02Auth)
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    const isDemoAdmin = email === 'admin@haiyasoymilk.com' || email.includes('admin');
    const user: UserProfile = {
      uid: isDemoAdmin ? "admin-demo-id" : "user_" + Math.random().toString(36).substring(2, 9),
      email: email,
      displayName: isDemoAdmin ? "Admin Chiang Mai" : email.split('@')[0],
      photoURL: isDemoAdmin 
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      isAdmin: isDemoAdmin,
      provider: 'email'
    };
    this.currentUser = user;
    this.saveUser();
    this.logFirestoreOp(`Auth: Login (${email})`, `await signInWithEmailAndPassword(auth, "${email}", "******");`);
    return user;
  }

  public async loginWithGoogle(): Promise<UserProfile> {
    const user: UserProfile = {
      uid: "google_" + Math.random().toString(36).substring(2, 9),
      email: "lanna.traveler@gmail.com",
      displayName: "Lanna Traveler",
      photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      isAdmin: false,
      provider: 'google'
    };
    this.currentUser = user;
    this.saveUser();
    this.logFirestoreOp(`Auth: Google Login`, `await signInWithPopup(auth, new GoogleAuthProvider());`);
    return user;
  }

  public async loginWithApple(): Promise<UserProfile> {
    const user: UserProfile = {
      uid: "apple_" + Math.random().toString(36).substring(2, 9),
      email: "chiangmai.local@apple.com",
      displayName: "Lanna Local",
      photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      isAdmin: false,
      provider: 'apple'
    };
    this.currentUser = user;
    this.saveUser();
    this.logFirestoreOp(`Auth: Apple Login`, `await signInWithPopup(auth, new OAuthProvider('apple.com'));`);
    return user;
  }

  public async quickAdminDemo(): Promise<UserProfile> {
    this.currentUser = DEFAULT_USER;
    this.saveUser();
    this.logFirestoreOp(`Auth: Admin Demo Access`, `// Quick Bypass Auth for demo administration\nconst user = await signInWithEmailAndPassword(auth, "admin@haiyasoymilk.com", "admin123");`);
    return DEFAULT_USER;
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    this.saveUser();
    this.logFirestoreOp(`Auth: Logout`, `await signOut(auth);`);
  }

  public async signUpWithEmail(email: string, pass: string): Promise<UserProfile> {
    const user = await this.loginWithEmail(email, pass);
    this.logFirestoreOp(`Auth: Sign Up (${email})`, `await createUserWithEmailAndPassword(auth, "${email}", "******");`);
    return user;
  }

  public async resetPassword(email: string): Promise<boolean> {
    this.logFirestoreOp(`Auth: Reset Password (${email})`, `await sendPasswordResetEmail(auth, "${email}");`);
    return true;
  }

  // SUPABASE TO FIREBASE FIRESTORE MIGRATION TOOL SIMULATOR
  public isDatabaseMigrated(): boolean {
    return this.isMigrated;
  }

  public getMigrationLogs(): string[] {
    return this.migrationLogs;
  }

  public getFirestoreLogs() {
    return this.firestoreLogs;
  }

  public clearFirestoreLogs() {
    this.firestoreLogs = [];
    localStorage.removeItem('fs_firestore_logs');
  }

  public async runMigration(onLog: (log: string) => void): Promise<void> {
    this.migrationLogs = [];
    this.isMigrated = false;
    this.saveMigrationState();

    const addLog = (msg: string) => {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const formatted = `[${timestamp}] ${msg}`;
      this.migrationLogs.push(formatted);
      onLog(formatted);
    };

    addLog("🚀 Starting migration from Supabase PostgreSQL to Firebase Firestore (NoSQL)...");
    await new Promise(r => setTimeout(r, 600));

    addLog("🔌 Connecting to Supabase API & verifying table structures...");
    await new Promise(r => setTimeout(r, 500));
    addLog("✅ Supabase Tables found: 'products' (20 rows), 'orders' (14 rows), 'profiles' (8 rows)");

    addLog("🔌 Connecting to Firebase Firestore instance...");
    await new Promise(r => setTimeout(r, 500));
    addLog("✅ Firebase connection established. Project ID: 'haiya-soy-milk-firestore'");

    // Step 1: Migrate Products Table to Products Collection
    addLog("📦 Step 1/3: Migrating Table 'products' -> Collection 'products'...");
    await new Promise(r => setTimeout(r, 800));
    INITIAL_PRODUCTS.forEach(p => {
      addLog(`   ↪ Translating relational row [id: ${p.id}] to nested JSON Document...`);
    });
    this.products = [...INITIAL_PRODUCTS];
    this.saveProducts();
    addLog("✅ Step 1/3 Complete: 20 products migrated successfully with nested metadata.");

    // Step 2: Migrate Orders Table to Orders Collection
    addLog("📦 Step 2/3: Migrating Table 'orders' -> Collection 'orders'...");
    await new Promise(r => setTimeout(r, 800));
    addLog("   ↪ Resolving relational foreign key 'user_id' into Firestore nested user references...");
    addLog("   ↪ Converting SQL timestamp columns to Firestore Timestamp fields...");
    
    // Create some initial mock orders
    this.orders = [
      {
        id: "order-101",
        userId: "user-99",
        userEmail: "somchai.chiangmai@gmail.com",
        items: [
          {
            productId: "bev-1",
            nameTh: "น้ำเต้าหู้ (ร้อน, ใส่เครื่อง)",
            nameEn: "Soy Milk (Hot, With Toppings)",
            price: 15,
            quantity: 2,
            vesselDiscount: true,
            options: { temperature: 'hot', toppings: 'with' }
          },
          {
            productId: "donut-4",
            nameTh: "ปาท่องโก๋จิ้มสังขยาใบเตย",
            nameEn: "Chinese Donuts with Pandan Sauce",
            price: 25,
            quantity: 1,
            vesselDiscount: false
          }
        ],
        subtotal: 55,
        discount: 4, // 2 cups discount
        total: 51,
        paymentMethod: "promptpay",
        status: "ready",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "order-102",
        userId: "user-88",
        userEmail: "grandma.pim@yahoo.com",
        items: [
          {
            productId: "des-1",
            nameTh: "เต้าฮวยน้ำขิง",
            nameEn: "Tofu Pudding",
            price: 25,
            quantity: 1,
            vesselDiscount: false
          },
          {
            productId: "bag-1",
            nameTh: "ถุงผ้าทอลายเชียงใหม่วัวลาย (สีเงินคลาสสิก)",
            nameEn: "Wua Lai Silver Tradition Thermal Bag",
            price: 180,
            quantity: 1,
            vesselDiscount: false
          }
        ],
        subtotal: 205,
        discount: 0,
        total: 205,
        paymentMethod: "cash",
        status: "completed",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
    this.saveOrders();
    addLog("✅ Step 2/3 Complete: Relational order mappings flattened and migrated to Firestore 'orders' collection.");

    // Step 3: Set up Security Rules and Indexes
    addLog("🔧 Step 3/3: Deploying Firebase Firestore Security Rules & Composite Indexes...");
    await new Promise(r => setTimeout(r, 600));
    addLog("   ↪ Creating index 'orders: userId Asc, createdAt Desc'...");
    addLog("   ↪ Creating index 'products: category Asc, price Asc'...");
    addLog("   ↪ Setting Firestore Security Rules: 'allow read: if true; allow write: if request.auth != null && request.auth.token.admin == true;'");

    addLog("🎉 Verification phase: Comparing checksum count of Supabase vs Firebase Firestore...");
    await new Promise(r => setTimeout(r, 500));
    addLog("📊 Checksum MATCHED. Data Integrity: 100% Correct. Latency: 42ms.");

    this.isMigrated = true;
    this.saveMigrationState();
    addLog("🏆 DATABASE MIGRATION SUCCESSFUL! The application is now fully running on Firebase Firestore.");
  }
}

export const db = new FirebaseFirestoreSimulator();
export default db;
