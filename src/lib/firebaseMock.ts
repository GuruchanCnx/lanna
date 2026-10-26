import { Product, Order, UserProfile, Category } from './types';

// Initial products from photograph: จิ๊กโก๋ สะบัดน้ำมัน (สาขาช้างเผือก)
const INITIAL_PRODUCTS: Product[] = [
  // 1. ของทานเล่น / Snacks (ตัวละ 5 บาท, ชุดละ 30 บาท)
  {
    id: "snack-1",
    nameTh: "ปาท่องโก๋",
    nameEn: "Chinese Doughnut (Pa Thong Ko)",
    price: 5,
    category: "snacks",
    stock: 200,
    image: "/src/assets/images/patongko_crispy_1792924696894.jpg",
    descriptionTh: "ปาท่องโก๋ทอดกรอบสีทองตัวต่อตัว กรอบนอกนุ่มใน ไม่อมน้ำมัน (ตัวละ 5 บาท)",
    descriptionEn: "Traditional freshly fried Chinese doughnut / cruller, crispy outside and tender inside (5 THB / piece)"
  },
  {
    id: "snack-2",
    nameTh: "ขนมปังสังขยา",
    nameEn: "Custard Bread Set",
    price: 30,
    category: "snacks",
    stock: 80,
    image: "/src/assets/images/patongko_crispy_1792924696894.jpg",
    descriptionTh: "ขนมปังนึ่งร้อนๆ นุ่มฟู เสิร์ฟพร้อมสังขยาใบเตยหอมละมุนสูตรโบราณ (ชุดละ 30 บาท)",
    descriptionEn: "Steamed soft fluffy bread served with authentic aromatic Thai pandan custard dip (30 THB / set)"
  },

  // 2. ซอส / Sauces (10 - 20 บาท)
  {
    id: "sauce-1",
    nameTh: "นมข้นหวาน",
    nameEn: "Condensed Milk Dip",
    price: 10,
    category: "sauces",
    stock: 150,
    image: "/src/assets/images/patongko_crispy_1792924696894.jpg",
    descriptionTh: "นมข้นหวานคุณภาพดี หวานมันกลมกล่อม สำหรับจิ้มปาท่องโก๋หรือขนมปัง (10 บาท)",
    descriptionEn: "Rich sweetened condensed milk dipping sauce for Pa Thong Ko and toast (10 THB)"
  },
  {
    id: "sauce-2",
    nameTh: "สังขยา",
    nameEn: "Thai Custard Dip",
    price: 10,
    category: "sauces",
    stock: 120,
    image: "/src/assets/images/patongko_crispy_1792924696894.jpg",
    descriptionTh: "สังขยาใบเตยแท้เข้มข้น หอมกลิ่นใบเตยสด หวานกำลังดี (10 บาท)",
    descriptionEn: "Authentic Thai pandan custard dipping sauce, smooth and fragrant (10 THB)"
  },
  {
    id: "sauce-3",
    nameTh: "ช็อกโกแลต",
    nameEn: "Chocolate Sauce",
    price: 20,
    category: "sauces",
    stock: 90,
    image: "/src/assets/images/patongko_crispy_1792924696894.jpg",
    descriptionTh: "ซอสช็อกโกแลตเข้มข้น หอมมันกลมกล่อม (20 บาท)",
    descriptionEn: "Decadent rich chocolate dipping sauce (20 THB)"
  },
  {
    id: "sauce-4",
    nameTh: "สตรอเบอรี่",
    nameEn: "Strawberry Sauce",
    price: 20,
    category: "sauces",
    stock: 90,
    image: "/src/assets/images/patongko_crispy_1792924696894.jpg",
    descriptionTh: "ซอสสตรอเบอรี่ผลไม้ เปรี้ยวอมหวาน ชื่นใจ (20 บาท)",
    descriptionEn: "Sweet and tangy strawberry fruit dipping sauce (20 THB)"
  },

  // 3. น้ำเต้าหู้ / Soymilk (10 - 25 บาท)
  {
    id: "soymilk-1",
    nameTh: "น้ำเต้าหู้ธรรมดา",
    nameEn: "Plain Soymilk",
    price: 10,
    category: "soymilk",
    stock: 250,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้คั้นสดแท้ 100% หอมถั่วเหลืองธรรมชาติ รสกลมกล่อม (ร้อน 10 / เย็น 10)",
    descriptionEn: "Freshly pressed 100% pure homemade soymilk, natural and healthy (Hot 10 / Iced 10)",
    isBeverage: true
  },
  {
    id: "soymilk-2",
    nameTh: "เต้าหู้ทรงเครื่อง",
    nameEn: "Soymilk with Grains",
    price: 15,
    category: "soymilk",
    stock: 180,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ใส่เครื่องธัญพืชรวมมิตร ทั้งลูกเดือย สาคู วุ้น แมงลัก (ร้อน 15 / เย็น 15)",
    descriptionEn: "Fresh soymilk loaded with assorted grains, barley, sago & basil seeds (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-3",
    nameTh: "เต้าหู้นมสด",
    nameEn: "Soymilk with Fresh Milk",
    price: 15,
    category: "soymilk",
    stock: 150,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมนมสดแท้ หอมมันกลมกล่อม อร่อยละมุน (ร้อน 15 / เย็น 15)",
    descriptionEn: "Nutritious soymilk combined with fresh farm cow milk (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-4",
    nameTh: "เต้าหู้งาดำ",
    nameEn: "Black Sesame Soymilk",
    price: 15,
    category: "soymilk",
    stock: 140,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมงาดำคั่วบดละเอียด หอมกรุ่น อุดมด้วยสารต้านอนุมูลอิสระ (ร้อน 15 / เย็น 15)",
    descriptionEn: "Soymilk infused with aromatic freshly roasted black sesame (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-5",
    nameTh: "เต้าหู้ไมโล",
    nameEn: "Milo Soymilk",
    price: 15,
    category: "soymilk",
    stock: 120,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมไมโล รสช็อกโกแลตมอลต์ หวานมัน (ร้อน 15 / เย็น 15)",
    descriptionEn: "Soymilk blended with delicious chocolate malt Milo (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-6",
    nameTh: "เต้าหู้โอวัลติน",
    nameEn: "Ovaltine Soymilk",
    price: 15,
    category: "soymilk",
    stock: 120,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมโอวัลติน หอมกลิ่นมอลต์ หวานมันกลมกล่อม (ร้อน 15 / เย็น 15)",
    descriptionEn: "Soymilk blended with sweet malt Ovaltine (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-7",
    nameTh: "เต้าหู้ชาเขียว",
    nameEn: "Green Tea Soymilk",
    price: 15,
    category: "soymilk",
    stock: 120,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมชาเขียว หอมกลิ่นใบชาธรรมชาติ (ร้อน 15 / เย็น 15)",
    descriptionEn: "Soymilk mixed with refreshing authentic green tea (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-8",
    nameTh: "เต้าหู้ชาเย็น",
    nameEn: "Thai Tea Soymilk",
    price: 15,
    category: "soymilk",
    stock: 130,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมชาไทยสีส้มเอกลักษณ์ หอมเข้มข้น (ร้อน 15 / เย็น 15)",
    descriptionEn: "Soymilk infused with rich, fragrant Thai tea (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-9",
    nameTh: "เต้าหู้กาแฟ",
    nameEn: "Coffee Soymilk",
    price: 15,
    category: "soymilk",
    stock: 110,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมกาแฟคั่วหอมกรุ่น รสเข้มข้นกำลังดี (ร้อน 15 / เย็น 15)",
    descriptionEn: "Fresh soymilk blended with aromatic roasted coffee (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-10",
    nameTh: "เต้าหู้เผือก",
    nameEn: "Taro Soymilk",
    price: 15,
    category: "soymilk",
    stock: 100,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมเผือกหอม หวานมันนุ่มละมุน (ร้อน 15 / เย็น 15)",
    descriptionEn: "Soymilk blended with sweet, creamy aromatic taro (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-11",
    nameTh: "เต้าหู้โกโก้",
    nameEn: "Cocoa Soymilk",
    price: 15,
    category: "soymilk",
    stock: 120,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมโกโก้แท้เข้มข้น หวานมันกลมกล่อม (ร้อน 15 / เย็น 15)",
    descriptionEn: "Soymilk infused with rich dark cocoa powder (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-12",
    nameTh: "เต้าหู้ใส่น้ำขิง",
    nameEn: "Soymilk with Ginger",
    price: 15,
    category: "soymilk",
    stock: 100,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ผสมน้ำขิงแก่แท้ รสชาติเผ็ดร้อน ชุ่มคอ สบายท้อง (ร้อน 15 / เย็น 15)",
    descriptionEn: "Warm soymilk combined with spicy aged ginger tea (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-13",
    nameTh: "เต้าหู้ใส่เต้าฮวย",
    nameEn: "Soymilk with Tofu Pudding",
    price: 15,
    category: "soymilk",
    stock: 110,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ใส่เต้าฮวยเนื้อเนียนนุ่ม ละลายในปาก (ร้อน 15 / เย็น 15)",
    descriptionEn: "Fresh soymilk served with silky soft tofu pudding (Hot 15 / Iced 15)",
    isBeverage: true
  },
  {
    id: "soymilk-14",
    nameTh: "เต้าหู้บัวลอย",
    nameEn: "Soymilk with Sweet Taro Balls",
    price: 25,
    category: "soymilk",
    stock: 90,
    image: "/src/assets/images/soymilk_glass_1792924697614.jpg",
    descriptionTh: "น้ำเต้าหู้ใส่บัวลอยเผือกแป้งเหนียวนุ่ม หนึบหนับ เคี้ยวเพลิน (ร้อน 25 / เย็น 25)",
    descriptionEn: "Soymilk served with handcrafted chewy sweet taro balls (Hot 25 / Iced 25)",
    isBeverage: true
  },

  // 4. นมสด / Fresh Milk (20 - 30 บาท)
  {
    id: "milk-1",
    nameTh: "นมสดต้ม",
    nameEn: "Boiled Fresh Milk",
    price: 20,
    category: "milk",
    stock: 180,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "นมโคสดแท้ 100% ต้มร้อนๆ หอมกลิ่นนมธรรมชาติ ไม่ผสมน้ำ (ร้อน 20 / เย็น 20)",
    descriptionEn: "100% pure fresh cow milk boiled fresh daily, rich and wholesome (Hot 20 / Iced 20)",
    isBeverage: true
  },
  {
    id: "milk-2",
    nameTh: "นมสดธรรมดา",
    nameEn: "Plain Fresh Milk",
    price: 20,
    category: "milk",
    stock: 160,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "นมสดแท้หวานมัน รสกลมกล่อมชื่นใจ (ร้อน 20 / เย็น 20)",
    descriptionEn: "Classic sweet and rich fresh milk (Hot 20 / Iced 20)",
    isBeverage: true
  },
  {
    id: "milk-3",
    nameTh: "นมสดทรงเครื่อง",
    nameEn: "Fresh Milk with Grains",
    price: 25,
    category: "milk",
    stock: 120,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "นมสดแท้ใส่เครื่องธัญพืชรวมมิตร ทั้งลูกเดือย วุ้น สาคู แมงลัก (ร้อน 25 / เย็น 25)",
    descriptionEn: "Fresh milk topped with barley, sago, jelly & basil seeds (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-4",
    nameTh: "นมสดงาดำ",
    nameEn: "Black Sesame Fresh Milk",
    price: 25,
    category: "milk",
    stock: 100,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "นมสดผสมงาดำคั่วบด รสชาติหอมมันสุขภาพดี (ร้อน 25 / เย็น 25)",
    descriptionEn: "Fresh milk infused with finely ground roasted black sesame (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-5",
    nameTh: "นมสดไมโล",
    nameEn: "Milo Fresh Milk",
    price: 25,
    category: "milk",
    stock: 130,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "นมสดแท้ชงไมโลช็อกโกแลตมอลต์ หวานมันเข้มข้น (ร้อน 25 / เย็น 25)",
    descriptionEn: "Fresh milk with chocolate malt Milo powder (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-6",
    nameTh: "นมสดโอวัลติน",
    nameEn: "Ovaltine Fresh Milk",
    price: 25,
    category: "milk",
    stock: 130,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "นมสดแท้ผสมผงโอวัลติน หอมกลิ่นมอลต์ (ร้อน 25 / เย็น 25)",
    descriptionEn: "Fresh milk blended with classic sweet Ovaltine malt (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-7",
    nameTh: "นมสดชาเขียว",
    nameEn: "Green Tea Fresh Milk",
    price: 25,
    category: "milk",
    stock: 120,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "ชาเขียวนมสดแท้ หอมกลิ่นใบชา นุ่มละมุน (ร้อน 25 / เย็น 25)",
    descriptionEn: "Green tea latte made with 100% fresh cow milk (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-8",
    nameTh: "นมสดชาเย็น",
    nameEn: "Thai Tea Fresh Milk",
    price: 25,
    category: "milk",
    stock: 150,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "ชาไทยนมสดแท้ หอมใบชาไทยเข้มข้น หวานมัน (ร้อน 25 / เย็น 25)",
    descriptionEn: "Traditional aromatic Thai tea brewed with 100% fresh milk (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-9",
    nameTh: "นมสดกาแฟ",
    nameEn: "Coffee Fresh Milk",
    price: 25,
    category: "milk",
    stock: 110,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "กาแฟนมนมสดแท้สไตล์ลาเต้ หอมเข้มข้น (ร้อน 25 / เย็น 25)",
    descriptionEn: "Fresh milk coffee latte, rich and invigorating (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-10",
    nameTh: "นมสดเผือก",
    nameEn: "Taro Fresh Milk",
    price: 25,
    category: "milk",
    stock: 100,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "นมสดผสมเผือกหอม รสชาติหวานมันละมุนลิ้น (ร้อน 25 / เย็น 25)",
    descriptionEn: "Creamy fresh milk infused with fragrant sweet taro (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-11",
    nameTh: "นมสดโกโก้",
    nameEn: "Cocoa Fresh Milk",
    price: 25,
    category: "milk",
    stock: 120,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "นมสดผสมผงโกโก้ดัตช์แท้ เข้มข้น หวานมันสะใจ (ร้อน 25 / เย็น 25)",
    descriptionEn: "Rich dark cocoa blended with wholesome fresh milk (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-12",
    nameTh: "เต้าฮวยนมสด",
    nameEn: "Fresh Milk with Tofu Pudding",
    price: 25,
    category: "milk",
    stock: 110,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "เต้าฮวยถั่วเหลืองเนื้อเนียนละมุน ในนมสดแท้หวานหอม (ร้อน 25 / เย็น 25)",
    descriptionEn: "Silky soft tofu pudding swimming in cold or warm fresh milk (Hot 25 / Iced 25)",
    isBeverage: true
  },
  {
    id: "milk-13",
    nameTh: "เฉาก๊วยนมสด",
    nameEn: "Fresh Milk with Chinese Herb Jelly",
    price: 25,
    category: "milk",
    stock: 140,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "เฉาก๊วยแท้เนื้อหนึบหนับ เสิร์ฟในนมสดแท้หวานเย็นชื่นใจ (ร้อน 25 / เย็น 30)",
    descriptionEn: "Chewy grass jelly cubes in fresh milk with brown sugar (Hot 25 / Iced 30)",
    isBeverage: true
  },

  // 5. เครื่องดื่มร้อน/เย็น / Hot/Cold Drinks (20 - 30 บาท)
  {
    id: "drink-1",
    nameTh: "ชาไทย",
    nameEn: "Thai Tea",
    price: 20,
    category: "drinks",
    stock: 180,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "ชาไทยสูตรโบราณช้างเผือก หอมเข้มข้น ชงสดใหม่ (ร้อน 20 / เย็น 25)",
    descriptionEn: "Authentic Thai tea brewed fresh with condensed milk (Hot 20 / Iced 25)",
    isBeverage: true
  },
  {
    id: "drink-2",
    nameTh: "ชาเขียว",
    nameEn: "Green Tea",
    price: 20,
    category: "drinks",
    stock: 150,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "ชาเขียวไทยหอมกรุ่น หวานมันกลมกล่อม (ร้อน 20 / เย็น 25)",
    descriptionEn: "Thai green tea latte, fragrant and sweet (Hot 20 / Iced 25)",
    isBeverage: true
  },
  {
    id: "drink-3",
    nameTh: "ไมโล",
    nameEn: "Milo",
    price: 20,
    category: "drinks",
    stock: 150,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "ไมโลรสช็อกโกแลตมอลต์ยอดนิยม หวานมันเข้มข้น (ร้อน 20 / เย็น 25)",
    descriptionEn: "Classic chocolate malt Milo drink (Hot 20 / Iced 25)",
    isBeverage: true
  },
  {
    id: "drink-4",
    nameTh: "โอวัลติน",
    nameEn: "Ovaltine",
    price: 20,
    category: "drinks",
    stock: 150,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "โอวัลตินรสเข้มข้น หวานมันกลมกล่อม (ร้อน 20 / เย็น 25)",
    descriptionEn: "Traditional Ovaltine malt beverage (Hot 20 / Iced 25)",
    isBeverage: true
  },
  {
    id: "drink-5",
    nameTh: "โกโก้",
    nameEn: "Cocoa",
    price: 20,
    category: "drinks",
    stock: 140,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "โกโก้แท้รสเข้มข้น หอมมันสะใจ (ร้อน 20 / เย็น 25)",
    descriptionEn: "Dark rich chocolate cocoa drink (Hot 20 / Iced 25)",
    isBeverage: true
  },
  {
    id: "drink-6",
    nameTh: "กาแฟ",
    nameEn: "Coffee",
    price: 25,
    category: "drinks",
    stock: 140,
    image: "/src/assets/images/freshmilk_cup_1792924697554.jpg",
    descriptionTh: "กาแฟโบราณคั่วเข้มข้น หอมกรุ่น ปลุกพลัง (ร้อน 25 / เย็น 30)",
    descriptionEn: "Traditional Thai roasted dark coffee (Hot 25 / Iced 30)",
    isBeverage: true
  },

  // 6. น้ำขิง / Ginger Drinks (10 - 25 บาท)
  {
    id: "ginger-1",
    nameTh: "น้ำขิง",
    nameEn: "Ginger Tea",
    price: 10,
    category: "ginger",
    stock: 150,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "น้ำขิงแก่ต้มสดแท้ รสชาติเผ็ดร้อน ชุ่มคอ สบายท้อง (10 บาท)",
    descriptionEn: "Pure spicy hot ginger tea brewed from aged ginger roots (10 THB)",
    isBeverage: true
  },
  {
    id: "ginger-2",
    nameTh: "น้ำขิงทรงเครื่อง",
    nameEn: "Ginger Tea with Assorted Garnishes",
    price: 15,
    category: "ginger",
    stock: 120,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "น้ำขิงแก่เผ็ดร้อน ใส่ธัญพืช ลูกเดือย สาคู วุ้น (15 บาท)",
    descriptionEn: "Spicy ginger tea loaded with barley, sago, and grains (15 THB)",
    isBeverage: true
  },
  {
    id: "ginger-3",
    nameTh: "เต้าฮวยน้ำขิง",
    nameEn: "Tofu Pudding in Ginger Syrup",
    price: 15,
    category: "ginger",
    stock: 140,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "เต้าฮวยถั่วเหลืองเนื้อเนียนนุ่มละมุน เสิร์ฟในน้ำขิงแก่รสเผ็ดร้อน (15 บาท)",
    descriptionEn: "Silky soft tofu pudding (Douhua) in hot spicy ginger syrup (15 THB)"
  },
  {
    id: "ginger-4",
    nameTh: "เต้าฮวยน้ำขิงทรงเครื่อง",
    nameEn: "Tofu Pudding in Ginger Syrup with Grains",
    price: 20,
    category: "ginger",
    stock: 110,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "เต้าฮวยน้ำขิงพร้อมเครื่องธัญพืชแน่นๆ ทั้งลูกเดือย สาคู วุ้น เมล็ดแมงลัก (20 บาท)",
    descriptionEn: "Silky tofu pudding in ginger syrup loaded with assorted healthy grains (20 THB)"
  },
  {
    id: "ginger-5",
    nameTh: "บัวลอยน้ำขิง",
    nameEn: "Sweet Taro Balls in Ginger Syrup",
    price: 25,
    category: "ginger",
    stock: 100,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "บัวลอยเผือกแป้งเหนียวนุ่มหนึบหนับ เสิร์ฟในน้ำขิงแก่ร้อนๆ (25 บาท)",
    descriptionEn: "Chewy sweet taro balls served in aromatic hot ginger syrup (25 THB)"
  },

  // 7. ปังปิ้ง / Toast (20 - 25 บาท)
  {
    id: "toast-1",
    nameTh: "เนยนมน้ำตาล",
    nameEn: "Butter Milk & Sugar Toast",
    price: 20,
    category: "toast",
    stock: 120,
    image: "/src/assets/images/toast_sweet_thai_1792924698365.jpg",
    descriptionTh: "ขนมปังปิ้งเตาถ่านกรอบนอกนุ่มใน ทาเนยชุ่มฉ่ำ ราดนมข้นหวานและน้ำตาลทราย (20 บาท)",
    descriptionEn: "Classic crispy grilled bread brushed with rich butter, sweet condensed milk & sugar (20 THB)"
  },
  {
    id: "toast-2",
    nameTh: "เนยนมโอวัลติน",
    nameEn: "Butter Milk Ovaltine Toast",
    price: 25,
    category: "toast",
    stock: 100,
    image: "/src/assets/images/toast_sweet_thai_1792924698365.jpg",
    descriptionTh: "ขนมปังปิ้งทาเนย ราดนมข้นและโรยผงโอวัลตินพูนๆ กรุบกรอบ (25 บาท)",
    descriptionEn: "Buttered toast drizzled with condensed milk & generous Ovaltine powder (25 THB)"
  },
  {
    id: "toast-3",
    nameTh: "เนยนมไมโล",
    nameEn: "Butter Milk Milo Toast",
    price: 25,
    category: "toast",
    stock: 100,
    image: "/src/assets/images/toast_sweet_thai_1792924698365.jpg",
    descriptionTh: "ขนมปังปิ้งทาเนย ราดนมข้นและโรยผงไมโลมอลต์หอมหวาน (25 บาท)",
    descriptionEn: "Buttered toast topped with sweet condensed milk & Milo malt powder (25 THB)"
  },
  {
    id: "toast-4",
    nameTh: "เนยนมโกโก้",
    nameEn: "Butter Milk Cocoa Toast",
    price: 25,
    category: "toast",
    stock: 90,
    image: "/src/assets/images/toast_sweet_thai_1792924698365.jpg",
    descriptionTh: "ขนมปังปิ้งทาเนย ราดนมข้นและผงโกโก้เข้มข้น หอมมัน (25 บาท)",
    descriptionEn: "Buttered toast with condensed milk and rich dark cocoa powder (25 THB)"
  },
  {
    id: "toast-5",
    nameTh: "เนยนมสตรอเบอรี่",
    nameEn: "Butter Milk Strawberry Toast",
    price: 25,
    category: "toast",
    stock: 90,
    image: "/src/assets/images/toast_sweet_thai_1792924698365.jpg",
    descriptionTh: "ขนมปังปิ้งทาเนย ราดแยมสตรอเบอรี่ฉ่ำๆ เปรี้ยวอมหวาน (25 บาท)",
    descriptionEn: "Crispy buttered toast with sweet-tangy strawberry jam spread (25 THB)"
  },
  {
    id: "toast-6",
    nameTh: "เนยนมบลูเบอรี่",
    nameEn: "Butter Milk Blueberry Toast",
    price: 25,
    category: "toast",
    stock: 90,
    image: "/src/assets/images/toast_sweet_thai_1792924698365.jpg",
    descriptionTh: "ขนมปังปิ้งทาเนย ราดแยมบลูเบอรี่เข้มข้น หอมผลไม้เบอร์รี่ (25 บาท)",
    descriptionEn: "Crispy buttered toast drizzled with rich blueberry spread (25 THB)"
  },
  {
    id: "toast-7",
    nameTh: "เนยนมช็อกโกแลต",
    nameEn: "Butter Milk Chocolate Toast",
    price: 25,
    category: "toast",
    stock: 90,
    image: "/src/assets/images/toast_sweet_thai_1792924698365.jpg",
    descriptionTh: "ขนมปังปิ้งทาเนย ราดซอสช็อกโกแลตเข้มข้นเยิ้มๆ (25 บาท)",
    descriptionEn: "Crispy buttered toast covered with decadent chocolate fudge (25 THB)"
  },

  // 8. ท็อปปิ้ง / Toppings (+ เครื่องเพิ่ม 5 บาท / Add extra toppings +5 THB)
  {
    id: "topping-1",
    nameTh: "แมงลัก",
    nameEn: "Basil Seeds",
    price: 5,
    category: "toppings",
    stock: 200,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "เมล็ดแมงลักแช่น้ำ พองตัวนุ่มกรุบ มีกากใยสูง ดีต่อระบบขับถ่าย (+5 บาท)",
    descriptionEn: "Plump basil seeds, rich in fiber and refreshing (+5 THB)"
  },
  {
    id: "topping-2",
    nameTh: "สาคู",
    nameEn: "Sago",
    price: 5,
    category: "toppings",
    stock: 200,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "เม็ดสาคูต้มสุกใส เม็ดนุ่มหนึบหนับ เคี้ยวเพลิน (+5 บาท)",
    descriptionEn: "Tender and chewy translucent sago pearls (+5 THB)"
  },
  {
    id: "topping-3",
    nameTh: "ข้าวบาร์เลย์",
    nameEn: "Barley",
    price: 5,
    category: "toppings",
    stock: 180,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "ข้าวบาร์เลย์ต้มสุก เม็ดนุ่มมัน มีคุณค่าทางโภชนาการสูง (+5 บาท)",
    descriptionEn: "Cooked wholesome pearl barley grains (+5 THB)"
  },
  {
    id: "topping-4",
    nameTh: "วุ้น",
    nameEn: "Jelly",
    price: 5,
    category: "toppings",
    stock: 180,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "วุ้นใสเคี้ยวกรุบกรอบ เพิ่มรสสัมผัสชื่นใจ (+5 บาท)",
    descriptionEn: "Clear crisp agar jelly cubes (+5 THB)"
  },
  {
    id: "topping-5",
    nameTh: "หน้าเต้าหู้",
    nameEn: "Soybean Curd",
    price: 5,
    category: "toppings",
    stock: 150,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "ฟองเต้าหู้สด แผ่นบางนุ่ม หอมมันโปรตีนสูง (+5 บาท)",
    descriptionEn: "Fresh delicate soybean curd skin sheet (+5 THB)"
  },
  {
    id: "topping-6",
    nameTh: "ไข่มุก",
    nameEn: "Tapioca Pearls (Boba)",
    price: 5,
    category: "toppings",
    stock: 180,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "ไข่มุกสีดำเหนียวนุ่ม หนึบหนับ เคี้ยวเพลิน (+5 บาท)",
    descriptionEn: "Chewy sweet black tapioca boba pearls (+5 THB)"
  },
  {
    id: "topping-7",
    nameTh: "เต้าฮวย",
    nameEn: "Tofu Pudding",
    price: 5,
    category: "toppings",
    stock: 160,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "เต้าฮวยถั่วเหลืองเนื้อเนียนละมุนลิ้น ละลายในปาก (+5 บาท)",
    descriptionEn: "Silky soft soybean tofu pudding scoop (+5 THB)"
  },
  {
    id: "topping-8",
    nameTh: "เฉาก๊วย",
    nameEn: "Chinese Herb Jelly",
    price: 5,
    category: "toppings",
    stock: 170,
    image: "/src/assets/images/ginger_tea_tofu_1792924697834.jpg",
    descriptionTh: "เฉาก๊วยแท้เนื้อเด้งหนึบ หอมสมุนไพรจีน ช่วยคลายร้อน (+5 บาท)",
    descriptionEn: "Cooling chewy authentic grass jelly cubes (+5 THB)"
  },

  // 9. ถุงผ้าล้านนา / Lanna Bags (Chiang Mai Traditional Thermal Bags)
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
    const menuVersion = localStorage.getItem('fs_menu_photograph_version');
    let forceRefresh = false;

    // Force refresh to photograph menu version
    if (!menuVersion || menuVersion !== 'changphueak_full_menu_v2' || !storedProducts) {
      forceRefresh = true;
      try {
        localStorage.setItem('fs_menu_photograph_version', 'changphueak_full_menu_v2');
      } catch {
        // ignore
      }
    } else {
      try {
        const parsed = JSON.parse(storedProducts);
        const hasSnack = parsed.some((p: any) => p.id === 'snack-1');
        if (!hasSnack) forceRefresh = true;
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

    try {
      const storedMigLogs = localStorage.getItem('fs_migration_logs');
      this.migrationLogs = storedMigLogs ? JSON.parse(storedMigLogs).slice(-15) : [];
    } catch {
      this.migrationLogs = [];
    }

    try {
      const storedFsLogs = localStorage.getItem('fs_firestore_logs');
      this.firestoreLogs = storedFsLogs ? JSON.parse(storedFsLogs).slice(0, 20) : [];
    } catch {
      this.firestoreLogs = [];
      try {
        localStorage.removeItem('fs_firestore_logs');
      } catch {
        // ignore
      }
    }
  }

  private sanitizeDataForLog(data: any): any {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(d => this.sanitizeDataForLog(d));
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === 'string' && v.startsWith('data:image/')) {
        res[k] = `data:image/... (${Math.round(v.length / 1024)} KB image truncated)`;
      } else if (typeof v === 'string' && v.length > 200) {
        res[k] = `${v.substring(0, 200)}... [truncated]`;
      } else if (typeof v === 'object' && v !== null) {
        res[k] = this.sanitizeDataForLog(v);
      } else {
        res[k] = v;
      }
    }
    return res;
  }

  private safeStorageSet(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[Storage] Quota exceeded for key: ${key}. Freeing non-essential logs.`);
      try {
        localStorage.removeItem('fs_firestore_logs');
        localStorage.removeItem('fs_migration_logs');
        localStorage.setItem(key, value);
      } catch {
        console.warn(`[Storage] Still exceeded quota for key: ${key}. Changes kept in-memory.`);
      }
    }
  }

  private saveProducts() {
    this.safeStorageSet('fs_products', JSON.stringify(this.products));
  }

  private saveOrders() {
    this.safeStorageSet('fs_orders', JSON.stringify(this.orders));
  }

  private saveUser() {
    if (this.currentUser) {
      this.safeStorageSet('fs_current_user', JSON.stringify(this.currentUser));
    } else {
      try {
        localStorage.removeItem('fs_current_user');
      } catch {
        // ignore
      }
    }
  }

  private saveMigrationState() {
    this.safeStorageSet('fs_is_migrated', JSON.stringify(this.isMigrated));
    this.safeStorageSet('fs_migration_logs', JSON.stringify(this.migrationLogs.slice(-15)));
  }

  private logFirestoreOp(action: string, code: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.firestoreLogs.unshift({ timestamp, action, code });
    if (this.firestoreLogs.length > 20) this.firestoreLogs.pop();
    try {
      const persistedLogs = this.firestoreLogs.slice(0, 8);
      localStorage.setItem('fs_firestore_logs', JSON.stringify(persistedLogs));
    } catch {
      try {
        localStorage.removeItem('fs_firestore_logs');
      } catch {
        // ignore
      }
    }
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
        const cleanForLog = self.sanitizeDataForLog(data);
        self.logFirestoreOp(
          `addDoc(collection(db, "${name}"), data)`,
          `const docRef = await addDoc(collection(db, "${name}"), ${JSON.stringify(cleanForLog, null, 2)});`
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
            const cleanForLog = self.sanitizeDataForLog(data);
            self.logFirestoreOp(
              `setDoc(doc(db, "${name}", "${docId}"), data)`,
              `await setDoc(doc(db, "${name}", "${docId}"), ${JSON.stringify(cleanForLog, null, 2)});`
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
