import { Category, MenuItem, Order, AnalyticsData, User } from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'Alex Student', email: 'student@canteen.com', role: 'student' },
  { id: '2', name: 'Sarah Admin', email: 'admin@canteen.com', role: 'admin' },
  { id: '3', name: 'Mike Staff', email: 'staff@canteen.com', role: 'staff' },
];

export const categories: Category[] = [
  { id: '1', name: 'All', icon: 'Grid3X3' },
  { id: '2', name: 'Burgers', icon: 'Beef' },
  { id: '3', name: 'Pizza', icon: 'Pizza' },
  { id: '4', name: 'Drinks', icon: 'Coffee' },
  { id: '5', name: 'Desserts', icon: 'IceCreamCone' },
  { id: '6', name: 'Salads', icon: 'Salad' },
  { id: '7', name: 'Wraps', icon: 'Sandwich' },
];

export const menuItems: MenuItem[] = [
  { id: '1', name: 'Classic Smash Burger', description: 'Double-smashed beef patty with American cheese, pickles, and special sauce', price: 8.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', categoryId: '2', rating: 4.8, ratingCount: 234, calories: 650, isVeg: false, isAvailable: true },
  { id: '2', name: 'Margherita Pizza', description: 'San Marzano tomatoes, fresh mozzarella, basil on hand-tossed dough', price: 12.99, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop', categoryId: '3', rating: 4.6, ratingCount: 189, calories: 820, isVeg: true, isAvailable: true },
  { id: '3', name: 'Iced Caramel Latte', description: 'Espresso with caramel syrup, oat milk, and whipped cream', price: 5.49, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', categoryId: '4', rating: 4.9, ratingCount: 312, calories: 280, isVeg: true, isAvailable: true },
  { id: '4', name: 'Chocolate Lava Cake', description: 'Warm molten chocolate cake with vanilla ice cream', price: 6.99, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop', categoryId: '5', rating: 4.7, ratingCount: 156, calories: 520, isVeg: true, isAvailable: true },
  { id: '5', name: 'Caesar Salad', description: 'Crisp romaine, parmesan, croutons, house-made caesar dressing', price: 9.49, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', categoryId: '6', rating: 4.3, ratingCount: 98, calories: 350, isVeg: true, isAvailable: true },
  { id: '6', name: 'Chicken Tikka Wrap', description: 'Spiced chicken tikka with mint chutney, onions in warm naan wrap', price: 7.99, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', categoryId: '7', rating: 4.5, ratingCount: 178, calories: 480, isVeg: false, isAvailable: true },
  { id: '7', name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce, crispy bacon, cheddar, caramelized onions', price: 10.99, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop', categoryId: '2', rating: 4.7, ratingCount: 201, calories: 780, isVeg: false, isAvailable: true },
  { id: '8', name: 'Berry Smoothie Bowl', description: 'Acai, mixed berries, banana, granola, coconut flakes', price: 8.49, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop', categoryId: '4', rating: 4.4, ratingCount: 143, calories: 320, isVeg: true, isAvailable: true },
  { id: '9', name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella and oregano on thin crust', price: 13.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', categoryId: '3', rating: 4.8, ratingCount: 267, calories: 900, isVeg: false, isAvailable: true },
  { id: '10', name: 'Mango Lassi', description: 'Creamy yogurt-based mango drink with cardamom', price: 4.49, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop', categoryId: '4', rating: 4.6, ratingCount: 165, calories: 220, isVeg: true, isAvailable: true },
  { id: '11', name: 'Falafel Wrap', description: 'Crispy falafel, hummus, tahini, pickled turnips in pita', price: 7.49, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop', categoryId: '7', rating: 4.4, ratingCount: 112, calories: 420, isVeg: true, isAvailable: true },
  { id: '12', name: 'Tiramisu', description: 'Classic Italian layered coffee-mascarpone dessert', price: 7.49, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', categoryId: '5', rating: 4.8, ratingCount: 198, calories: 450, isVeg: true, isAvailable: true },
];

export const mockOrders: Order[] = [
  { id: 'ORD-001', userId: '1', items: [{ menuItemId: '1', menuItemName: 'Classic Smash Burger', quantity: 2, price: 8.99 }, { menuItemId: '3', menuItemName: 'Iced Caramel Latte', quantity: 1, price: 5.49 }], total: 23.47, status: 'preparing', createdAt: '2026-03-18T10:30:00', otp: '4521', qrCode: 'ORD-001-QR', paymentMethod: 'UPI' },
  { id: 'ORD-002', userId: '1', items: [{ menuItemId: '2', menuItemName: 'Margherita Pizza', quantity: 1, price: 12.99 }], total: 12.99, status: 'ready', createdAt: '2026-03-18T09:15:00', otp: '7832', qrCode: 'ORD-002-QR', paymentMethod: 'Card' },
  { id: 'ORD-003', userId: '1', items: [{ menuItemId: '5', menuItemName: 'Caesar Salad', quantity: 1, price: 9.49 }, { menuItemId: '10', menuItemName: 'Mango Lassi', quantity: 2, price: 4.49 }], total: 18.47, status: 'pending', createdAt: '2026-03-18T11:00:00', otp: '1267', qrCode: 'ORD-003-QR', paymentMethod: 'Cash' },
  { id: 'ORD-004', userId: '1', items: [{ menuItemId: '4', menuItemName: 'Chocolate Lava Cake', quantity: 1, price: 6.99 }], total: 6.99, status: 'completed', createdAt: '2026-03-17T14:30:00', otp: '9945', qrCode: 'ORD-004-QR', paymentMethod: 'UPI' },
  { id: 'ORD-005', userId: '1', items: [{ menuItemId: '7', menuItemName: 'BBQ Bacon Burger', quantity: 1, price: 10.99 }, { menuItemId: '8', menuItemName: 'Berry Smoothie Bowl', quantity: 1, price: 8.49 }], total: 19.48, status: 'pending', createdAt: '2026-03-18T11:30:00', otp: '3356', qrCode: 'ORD-005-QR', paymentMethod: 'Card' },
];

export const mockAnalytics: AnalyticsData = {
  totalOrders: 1247,
  dailyRevenue: 3842.50,
  weeklyData: [
    { day: 'Mon', revenue: 2840, orders: 142 },
    { day: 'Tue', revenue: 3120, orders: 158 },
    { day: 'Wed', revenue: 3560, orders: 176 },
    { day: 'Thu', revenue: 3240, orders: 164 },
    { day: 'Fri', revenue: 4100, orders: 205 },
    { day: 'Sat', revenue: 2680, orders: 134 },
    { day: 'Sun', revenue: 2200, orders: 110 },
  ],
  topItems: [
    { name: 'Classic Smash Burger', count: 234 },
    { name: 'Iced Caramel Latte', count: 198 },
    { name: 'Margherita Pizza', count: 176 },
    { name: 'Pepperoni Pizza', count: 156 },
    { name: 'Chocolate Lava Cake', count: 143 },
  ],
  statusDistribution: [
    { status: 'Pending', count: 12 },
    { status: 'Preparing', count: 8 },
    { status: 'Ready', count: 5 },
    { status: 'Completed', count: 1222 },
  ],
};
