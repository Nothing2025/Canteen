export type UserRole = 'student' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  rating: number;
  ratingCount: number;
  calories?: number;
  isVeg: boolean;
  isAvailable: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  otp: string;
  qrCode: string;
  paymentMethod: string;
}

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

export interface Rating {
  id: string;
  userId: string;
  menuItemId: string;
  rating: number;
  comment?: string;
}

export interface AnalyticsData {
  totalOrders: number;
  dailyRevenue: number;
  weeklyData: { day: string; revenue: number; orders: number }[];
  topItems: { name: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
}
