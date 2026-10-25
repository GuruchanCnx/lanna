export type Category = 'donuts' | 'beverages' | 'desserts' | 'bags';

export interface Product {
  id: string;
  nameTh: string;
  nameEn: string;
  price: number;
  category: Category;
  stock: number;
  image: string;
  descriptionTh?: string;
  descriptionEn?: string;
  isBeverage?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  vesselDiscount: boolean; // if true, saves 2 Baht
  options?: {
    temperature?: 'hot' | 'cold';
    toppings?: 'none' | 'with';
  };
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: {
    productId: string;
    nameTh: string;
    nameEn: string;
    price: number;
    quantity: number;
    vesselDiscount: boolean;
    options?: {
      temperature?: 'hot' | 'cold';
      toppings?: 'none' | 'with';
    };
  }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'promptpay' | 'cash';
  paymentSlip?: string; // image string or mock file name
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  provider: 'email' | 'google' | 'apple';
}
