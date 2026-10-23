import React, { useState, useEffect } from 'react';
import { 
  Database, RefreshCw, Layers, Terminal, LayoutGrid, Plus, Edit2, Trash2, 
  Save, X, ShieldAlert, CheckCircle, Play, AlertCircle, Trash, Code, Check 
} from 'lucide-react';
import { translations, Language } from '../lib/translations';
import { db } from '../lib/firebaseMock';
import { Product, Category, UserProfile } from '../lib/types';
import { ImageUploader } from '../components/ImageUploader';
import { RichTextEditor } from '../components/RichTextEditor';

interface AdminProps {
  lang: Language;
  currentUser: UserProfile | null;
  onLoginRequest: () => void;
  onRefreshProducts: () => void;
}

export const Admin: React.FC<AdminProps> = ({ lang, currentUser, onLoginRequest, onRefreshProducts }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'inventory' | 'migration'>('inventory');
  
  // Inventory State
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Form State
  const [formNameTh, setFormNameTh] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formCategory, setFormCategory] = useState<Category>('donuts');
  const [formImage, setFormImage] = useState('');
  const [formDescTh, setFormDescTh] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Migration State
  const [migrated, setMigrated] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [firestoreLogs, setFirestoreLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    setMigrated(db.isDatabaseMigrated());
    setMigrationLogs(db.getMigrationLogs());
    setFirestoreLogs(db.getFirestoreLogs());
    
    // Set up polling for firestore logs to keep it live
    const interval = setInterval(() => {
      setFirestoreLogs(db.getFirestoreLogs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    const data = await db.collection('products').get() as Product[];
    setProducts(data);
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormNameTh(product.nameTh);
    setFormNameEn(product.nameEn);
    setFormPrice(product.price);
    setFormStock(product.stock);
    setFormCategory(product.category);
    setFormImage(product.image);
    setFormDescTh(product.descriptionTh || '');
    setFormDescEn(product.descriptionEn || '');
    setIsAdding(false);
    
    // Smooth scroll form into view on mobile
    const formEl = document.getElementById('product-form-container');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setFormNameTh('');
    setFormNameEn('');
    setFormPrice(0);
    setFormStock(0);
    setFormCategory('donuts');
    setFormImage('');
    setFormDescTh('');
    setFormDescEn('');
  };

  const handleSave = async (id: string) => {
    if (!formNameTh || !formNameEn || formPrice <= 0) {
      alert(lang === 'th' ? "กรุณากรอกข้อมูลให้ครบถ้วน" : "Please fill in all required fields");
      return;
    }

    const updatedData = {
      nameTh: formNameTh,
      nameEn: formNameEn,
      price: Number(formPrice),
      stock: Number(formStock),
      category: formCategory,
      image: formImage,
      descriptionTh: formDescTh,
      descriptionEn: formDescEn
    };

    await db.collection('products').doc(id).set(updatedData);
    setEditingId(null);
    resetForm();
    showToast(lang === 'th' ? "แก้ไขสินค้าสำเร็จ!" : "Product updated successfully!");
    fetchProducts();
    onRefreshProducts();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameTh || !formNameEn || formPrice <= 0) {
      alert(lang === 'th' ? "กรุณากรอกข้อมูลให้ครบถ้วน" : "Please fill in all required fields");
      return;
    }

    const newProduct = {
      nameTh: formNameTh,
      nameEn: formNameEn,
      price: Number(formPrice),
      stock: Number(formStock),
      category: formCategory,
      image: formImage || "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400",
      descriptionTh: formDescTh || "เพิ่มโดยผู้ดูแลระบบ",
      descriptionEn: formDescEn || "Added by administrator"
    };

    await db.collection('products').add(newProduct);
    setIsAdding(false);
    resetForm();
    showToast(lang === 'th' ? "เพิ่มสินค้าสำเร็จ!" : "Product added successfully!");
    fetchProducts();
    onRefreshProducts();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      handleSave(editingId);
    } else {
      handleAddProduct(e);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await db.collection('products').doc(deletingId).delete();
    setDeletingId(null);
    showToast(lang === 'th' ? "ลบสินค้าเรียบร้อยแล้ว!" : "Product deleted successfully!");
    fetchProducts();
    onRefreshProducts();
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStartMigration = async () => {
    setMigrating(true);
    setMigrationLogs([]);
    await db.runMigration((log) => {
      setMigrationLogs((prev) => [...prev, log]);
    });
    setMigrating(false);
    setMigrated(true);
  };

  const handleClearLogs = () => {
    db.clearFirestoreLogs();
    setFirestoreLogs([]);
  };

  // Auth Gate
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="inline-flex p-4 bg-rose-500/10 text-rose-500 rounded-full mb-4 animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          {lang === 'th' ? "เฉพาะผู้ดูแลระบบเท่านั้น" : "Admin Access Only"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
          {lang === 'th' 
            ? "กรุณาเข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ เพื่อเข้าถึงคลังสินค้าและเครื่องมือย้ายฐานข้อมูล" 
            : "Please sign in using the Admin Demo Quick Access to view and manage inventory or databases."}
        </p>
        <button
          onClick={onLoginRequest}
          className="mt-6 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/10 transition-all active:scale-95 text-sm"
        >
          {lang === 'th' ? "เข้าสู่ระบบด่วน" : "Go to Login"}
        </button>
      </div>
    );
  }

  const filteredProducts = products.filter(p => {
    const matchSearch = p.nameTh.toLowerCase().includes(search.toLowerCase()) || 
                        p.nameEn.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-white font-bold px-4 py-3 rounded-2xl shadow-xl border border-emerald-400 flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-rose-500/10 text-rose-500 rounded-2xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              {t.adminPanel}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Firebase Firestore: Active (Simulated)
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'inventory'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{t.inventoryTitle}</span>
          </button>
          <button
            onClick={() => setActiveTab('migration')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'migration'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.supabaseToFirestore}</span>
          </button>
        </div>
      </div>

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left/Middle Column: List of Products */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder={lang === 'th' ? "ค้นหาเมนู..." : "Search menu..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none"
                >
                  <option value="all">{lang === 'th' ? "ทุกหมวดหมู่" : "All Categories"}</option>
                  <option value="donuts">{t.catDonuts}</option>
                  <option value="beverages">{t.catBeverages}</option>
                  <option value="desserts">{t.catDesserts}</option>
                  <option value="bags">{t.catBags}</option>
                </select>
              </div>

              {/* Product Grid List */}
              <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id} 
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                      editingId === p.id 
                        ? 'border-rose-500 bg-rose-500/5' 
                        : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950'
                    }`}
                  >
                    <img src={p.image} alt={p.nameEn} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-white" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-xs text-slate-800 dark:text-white truncate">
                        {lang === 'th' ? p.nameTh : p.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                        {p.category.toUpperCase()} • ฿{p.price} • {p.stock} {lang === 'th' ? "ชิ้นในคลัง" : "in stock"}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {editingId === p.id ? (
                        <div className="flex items-center gap-1 bg-rose-500/10 text-rose-500 text-[10px] font-black px-2 py-1 rounded-lg">
                          Editing...
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all active:scale-90"
                            title={t.editProduct}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(p.id)}
                            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all active:scale-90"
                            title={t.deleteProduct}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Edit / Add Form */}
          <div className="space-y-4" id="product-form-container">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-500" />
                <span>{editingId ? t.editProduct : t.addProduct}</span>
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t.productNameTh}</label>
                  <input
                    type="text"
                    required
                    value={formNameTh}
                    onChange={(e) => setFormNameTh(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t.productNameEn}</label>
                  <input
                    type="text"
                    required
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t.productPrice}</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t.productStock}</label>
                    <input
                      type="number"
                      required
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t.productCategory}</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none"
                  >
                    <option value="donuts">{t.catDonuts}</option>
                    <option value="beverages">{t.catBeverages}</option>
                    <option value="desserts">{t.catDesserts}</option>
                    <option value="bags">{t.catBags}</option>
                  </select>
                </div>

                {/* RICH TEXT DESCRIPTION EDITORS WITH IMAGE UPLOADING */}
                <div className="space-y-3">
                  <RichTextEditor
                    lang={lang}
                    label={lang === 'th' ? "คำอธิบายสินค้า (ภาษาไทย)" : "Description (Thai)"}
                    value={formDescTh}
                    onChange={(val) => setFormDescTh(val)}
                  />
                  <RichTextEditor
                    lang={lang}
                    label={lang === 'th' ? "คำอธิบายสินค้า (ภาษาอังกฤษ)" : "Description (English)"}
                    value={formDescEn}
                    onChange={(val) => setFormDescEn(val)}
                  />
                </div>

                {/* VISUAL IMAGE UPLOADER */}
                <ImageUploader 
                  lang={lang} 
                  currentValue={formImage} 
                  onChange={(url) => setFormImage(url)} 
                />

                <div className="flex gap-2 pt-2">
                  {editingId ? (
                    <>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                      >
                        {t.save}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all active:scale-95"
                      >
                        {t.cancel}
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.addProduct}</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DATABASE MIGRATION TAB */}
      {activeTab === 'migration' && (
        <div className="space-y-6">
          {/* Visual SQL to NoSQL Schema Comparison */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-300">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-500" />
              <span>{t.dbMigrationTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {t.dbMigrationDesc}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center">
              {/* Supabase SQL Panel */}
              <div className="lg:col-span-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="font-black text-xs text-slate-700 dark:text-slate-300">Supabase (PostgreSQL)</span>
                </div>
                
                <div className="space-y-3 font-mono text-[10px]">
                  {/* Table Products */}
                  <div className="bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-rose-500 font-extrabold mb-1">TABLE: products</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      • id: uuid [PK]<br />
                      • name_th: varchar<br />
                      • name_en: varchar<br />
                      • price: numeric<br />
                      • category: varchar<br />
                      • stock: integer<br />
                      • image_url: text
                    </div>
                  </div>

                  {/* Table Orders */}
                  <div className="bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-rose-500 font-extrabold mb-1">TABLE: orders</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      • id: uuid [PK]<br />
                      • user_id: uuid [FK -&gt; profiles]<br />
                      • subtotal: numeric<br />
                      • discount: numeric<br />
                      • total: numeric<br />
                      • status: varchar<br />
                      • created_at: timestamp
                    </div>
                  </div>
                </div>
              </div>

              {/* Migration Arrow */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center gap-2 py-4">
                <div className={`w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 ${migrating ? 'animate-spin' : ''}`}>
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">MIGRATE</div>
                <div className="hidden lg:block w-full h-0.5 bg-gradient-to-r from-emerald-500 to-rose-500 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                </div>
              </div>

              {/* Firebase NoSQL Panel */}
              <div className="lg:col-span-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <span className="font-black text-xs text-slate-700 dark:text-slate-300">Firebase Firestore (NoSQL)</span>
                </div>

                <div className="space-y-3 font-mono text-[10px]">
                  {/* Collection Products */}
                  <div className="bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-orange-500 font-extrabold mb-1">COLLECTION: products</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      📄 Document: [productId] (JSON object)<br />
                      &nbsp;&nbsp;↳ nameTh: string<br />
                      &nbsp;&nbsp;↳ nameEn: string<br />
                      &nbsp;&nbsp;↳ price: number<br />
                      &nbsp;&nbsp;↳ stock: number<br />
                      &nbsp;&nbsp;↳ category: string<br />
                      &nbsp;&nbsp;↳ image: string
                    </div>
                  </div>

                  {/* Collection Orders */}
                  <div className="bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-orange-500 font-extrabold mb-1">COLLECTION: orders</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      📄 Document: [orderId] (Nested JSON)<br />
                      &nbsp;&nbsp;↳ userId: string<br />
                      &nbsp;&nbsp;↳ items: Array (Nested maps)<br />
                      &nbsp;&nbsp;↳ total: number<br />
                      &nbsp;&nbsp;↳ status: string<br />
                      &nbsp;&nbsp;↳ createdAt: Timestamp
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Migration Control Bar */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {migrated ? (
                  <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl font-bold text-xs border border-emerald-500/20">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t.migrationSuccess}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl font-bold text-xs border border-amber-500/20">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t.migrationIdle}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleStartMigration}
                disabled={migrating}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 text-white rounded-2xl font-bold text-xs shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 transition-all active:scale-95 disabled:scale-100"
              >
                {migrating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.migrationRunning}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{t.migrateButton}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Migration Terminal Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Box: Database Migration Terminal */}
            <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-rose-500" />
                  <span className="font-mono text-xs font-bold text-slate-300">{t.migrationLogs}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              <div className="flex-1 font-mono text-[10px] text-slate-300 overflow-y-auto space-y-1.5 pr-1 selection:bg-rose-500/30">
                {migrationLogs.length === 0 ? (
                  <div className="text-slate-600 italic">No migration logs found. Press "Start Migration Process" to begin database schema translation.</div>
                ) : (
                  migrationLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={
                        log.includes('SUCCESS') || log.includes('Complete') || log.includes('MATCHED')
                          ? 'text-emerald-400 font-bold' 
                          : log.includes('Step') 
                            ? 'text-rose-400 font-bold' 
                            : 'text-slate-300'
                      }
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Box: Live Firestore API Playground */}
            <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col h-[350px]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-orange-500" />
                  <span className="font-mono text-xs font-bold text-slate-300">Live Firestore API Logs & Playground</span>
                </div>
                <button
                  onClick={handleClearLogs}
                  className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
                  title="Clear Logs"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 font-mono text-[10px] text-slate-300 overflow-y-auto space-y-3 pr-1 selection:bg-orange-500/30">
                {firestoreLogs.length === 0 ? (
                  <div className="text-slate-600 italic">
                    Waiting for Firestore CRUD operations... Add, edit, or delete items in the inventory tab, or make a mock purchase to see live firestore API calls reflected here!
                  </div>
                ) : (
                  firestoreLogs.map((log, idx) => (
                    <div key={idx} className="p-2 bg-slate-900/40 rounded-xl border border-slate-900 space-y-1">
                      <div className="flex items-center justify-between text-slate-500 border-b border-slate-900/50 pb-1">
                        <span className="text-orange-400 font-bold">{log.action}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <pre className="text-[9px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-tight">
                        {log.code}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL (Prevents browser blocks) */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-150 dark:border-slate-800 text-center space-y-4">
            <div className="inline-flex p-3 bg-rose-500/10 text-rose-500 rounded-full">
              <Trash2 className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-slate-800 dark:text-white">
                {lang === 'th' ? "ยืนยันการลบสินค้า" : "Confirm Delete"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {lang === 'th' 
                  ? "คุณแน่ใจหรือไม่ที่จะลบสินค้านี้ออกจากคลัง? การดำเนินการนี้ไม่สามารถย้อนกลับได้" 
                  : "Are you sure you want to delete this product? This action cannot be undone."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleConfirmDelete}
                className="py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                {lang === 'th' ? "ลบสินค้า" : "Delete"}
              </button>
              <button
                onClick={() => setDeletingId(null)}
                className="py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all active:scale-95"
              >
                {lang === 'th' ? "ยกเลิก" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
