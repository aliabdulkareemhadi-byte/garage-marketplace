// Shared domain types for the garage-marketplace app.
// Moved from src/data/mockData.ts during cleanup.

export type Company = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  logo: string;
  cover: string;
  description: string;
  city: string;
  services: string[];
};

export type Workshop = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  image: string;
  city: string;
  area: string;
  open: boolean;
  priceRange: string;
  services: { id: string; name: string; price: number }[];
};

export type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  inStock: boolean;
};

export type Service = {
  id: string;
  name: string;
  icon: string;
  priceFrom: number;
  duration: string;
  description: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "order" | "booking" | "promo" | "system";
};

// Session / role management (mock)
export type UserRole = "customer" | "company" | "workshop";

export type Session = {
  role: UserRole;
  name: string;
  email: string;
  entityId?: string; // id of the company/workshop the owner manages
};

// Bookings from the workshop owner's perspective
export type WorkshopBookingStatus =
  | "جديد"
  | "مؤكد"
  | "قيد التنفيذ"
  | "مكتمل"
  | "ملغي";

export type WorkshopBooking = {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  vehicle: string;
  price: number;
  status: WorkshopBookingStatus;
};

// Company-side: orders, offers, sales stats
export type CompanyOrderStatus =
  | "جديد"
  | "مقبول"
  | "قيد التجهيز"
  | "مكتمل"
  | "ملغي";

export type CompanyOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string;
  paymentMethod: "دفع عند الاستلام" | "بطاقة" | "محفظة";
  status: CompanyOrderStatus;
};

export type CompanyOfferState = "نشط" | "منتهي" | "مجدول";

export type CompanyOffer = {
  id: string;
  title: string;
  productId?: string;
  productTitle: string;
  image: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  state: CompanyOfferState;
  description: string;
};

export type WorkshopOfferState = "نشط" | "منتهي" | "مجدول";

export type WorkshopOffer = {
  id: string;
  title: string;
  serviceName: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  state: WorkshopOfferState;
  description: string;
};
