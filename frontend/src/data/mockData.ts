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

export const companies: Company[] = [
  {
    id: "c1",
    name: "الجزيرة للسيارات",
    category: "صيانة متكاملة",
    rating: 4.8,
    reviews: 1240,
    logo: "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=200",
    cover: "https://images.pexels.com/photos/8986039/pexels-photo-8986039.jpeg?w=800",
    description:
      "شركة رائدة في خدمات السيارات وقطع الغيار الأصلية. نقدم خدمات صيانة شاملة لجميع أنواع السيارات مع ضمان الجودة والاحترافية.",
    city: "الرياض",
    services: ["صيانة دورية", "تغيير زيت", "إصلاح محركات", "فحص شامل"],
  },
  {
    id: "c2",
    name: "مركز التميز",
    category: "قطع غيار أصلية",
    rating: 4.6,
    reviews: 860,
    logo: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200",
    cover: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800",
    description: "متخصصون في توفير قطع الغيار الأصلية بأسعار تنافسية وخدمة توصيل سريعة.",
    city: "جدة",
    services: ["قطع غيار", "إكسسوارات", "إطارات", "بطاريات"],
  },
  {
    id: "c3",
    name: "السرعة للميكانيكا",
    category: "ميكانيكا وكهرباء",
    rating: 4.9,
    reviews: 2110,
    logo: "https://images.unsplash.com/photo-1522598140461-ec9911e01c53?w=200",
    cover: "https://images.unsplash.com/photo-1636613112804-c5aebc1f4d8d?w=800",
    description: "خبرة تزيد عن 20 سنة في ميكانيكا وكهرباء جميع السيارات.",
    city: "الدمام",
    services: ["ميكانيكا", "كهرباء", "تكييف", "كمبيوتر سيارة"],
  },
];

export const workshops: Workshop[] = [
  {
    id: "w1",
    name: "ورشة الفارس",
    rating: 4.7,
    reviews: 320,
    image: "https://images.pexels.com/photos/8986039/pexels-photo-8986039.jpeg?w=600",
    city: "الرياض",
    area: "حي النزهة",
    open: true,
    priceRange: "متوسط",
    services: [
      { id: "s1", name: "تغيير زيت + فلتر", price: 180 },
      { id: "s2", name: "فحص شامل", price: 250 },
      { id: "s3", name: "صيانة فرامل", price: 350 },
    ],
  },
  {
    id: "w2",
    name: "ورشة النخبة",
    rating: 4.9,
    reviews: 540,
    image: "https://images.unsplash.com/photo-1636613112804-c5aebc1f4d8d?w=600",
    city: "جدة",
    area: "حي الروضة",
    open: true,
    priceRange: "مرتفع",
    services: [
      { id: "s1", name: "تغيير زيت + فلتر", price: 220 },
      { id: "s2", name: "صيانة كهرباء", price: 400 },
      { id: "s3", name: "برمجة كمبيوتر", price: 500 },
    ],
  },
  {
    id: "w3",
    name: "ورشة الإتقان",
    rating: 4.5,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600",
    city: "الدمام",
    area: "حي الشاطئ",
    open: false,
    priceRange: "اقتصادي",
    services: [
      { id: "s1", name: "تغيير زيت", price: 140 },
      { id: "s2", name: "إصلاح تكييف", price: 300 },
    ],
  },
  {
    id: "w4",
    name: "ورشة الاحتراف",
    rating: 4.8,
    reviews: 780,
    image: "https://images.unsplash.com/photo-1522598140461-ec9911e01c53?w=600",
    city: "الرياض",
    area: "حي العليا",
    open: true,
    priceRange: "متوسط",
    services: [
      { id: "s1", name: "فحص قبل السفر", price: 200 },
      { id: "s2", name: "صيانة دورية", price: 350 },
    ],
  },
];

export const products: Product[] = [
  {
    id: "p1",
    title: "زيت محرك شل هيلكس 5W-30",
    brand: "Shell",
    price: 175,
    oldPrice: 210,
    rating: 4.8,
    reviews: 540,
    images: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800",
      "https://images.unsplash.com/photo-1636613112804-c5aebc1f4d8d?w=800",
    ],
    description: "زيت محرك صناعي بالكامل يوفر حماية قصوى للمحركات الحديثة ويطيل عمر المحرك.",
    specs: [
      { label: "النوع", value: "صناعي بالكامل" },
      { label: "اللزوجة", value: "5W-30" },
      { label: "الحجم", value: "4 لتر" },
      { label: "الضمان", value: "أصلي 100%" },
    ],
    inStock: true,
  },
  {
    id: "p2",
    title: "إطار ميشلان بريمير 225/45 R17",
    brand: "Michelin",
    price: 640,
    rating: 4.9,
    reviews: 320,
    images: [
      "https://images.unsplash.com/photo-1611633235555-45e252fe48c8?w=800",
      "https://images.unsplash.com/photo-1522598140461-ec9911e01c53?w=800",
    ],
    description: "إطار فاخر يوفر ثبات عالي وأداء ممتاز في جميع الظروف الجوية.",
    specs: [
      { label: "المقاس", value: "225/45 R17" },
      { label: "البلد", value: "فرنسا" },
      { label: "الضمان", value: "سنتان" },
    ],
    inStock: true,
  },
  {
    id: "p3",
    title: "فلتر هواء بوش أصلي",
    brand: "Bosch",
    price: 85,
    oldPrice: 110,
    rating: 4.6,
    reviews: 189,
    images: ["https://images.unsplash.com/photo-1522598140461-ec9911e01c53?w=800"],
    description: "فلتر هواء عالي الجودة يحمي المحرك من الأتربة ويحسن الأداء.",
    specs: [
      { label: "النوع", value: "هواء" },
      { label: "الماركة", value: "Bosch" },
      { label: "البلد", value: "ألمانيا" },
    ],
    inStock: true,
  },
  {
    id: "p4",
    title: "بطارية AC Delco 70 أمبير",
    brand: "AC Delco",
    price: 320,
    rating: 4.7,
    reviews: 410,
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800"],
    description: "بطارية ذات عمر افتراضي طويل وأداء موثوق.",
    specs: [
      { label: "السعة", value: "70 أمبير" },
      { label: "الضمان", value: "سنتان" },
    ],
    inStock: false,
  },
];

export const services: Service[] = [
  { id: "sv1", name: "تغيير الزيت والفلتر", icon: "Droplet", priceFrom: 150, duration: "30 د", description: "تغيير زيت المحرك والفلتر بأعلى المعايير." },
  { id: "sv2", name: "فحص شامل للسيارة", icon: "Search", priceFrom: 200, duration: "60 د", description: "فحص كامل لجميع أنظمة السيارة مع تقرير مفصل." },
  { id: "sv3", name: "صيانة الفرامل", icon: "Disc", priceFrom: 300, duration: "90 د", description: "فحص وصيانة نظام الفرامل بالكامل." },
  { id: "sv4", name: "صيانة التكييف", icon: "Wind", priceFrom: 250, duration: "45 د", description: "صيانة وتعبئة غاز التكييف." },
  { id: "sv5", name: "كهرباء السيارة", icon: "Zap", priceFrom: 180, duration: "60 د", description: "تشخيص وإصلاح أعطال الكهرباء." },
  { id: "sv6", name: "صيانة المحرك", icon: "Settings", priceFrom: 500, duration: "120 د", description: "صيانة شاملة للمحرك." },
  { id: "sv7", name: "ميزان وتوازن", icon: "Target", priceFrom: 120, duration: "40 د", description: "ميزان الإطارات وتوازن العجلات." },
  { id: "sv8", name: "تلميع وتنظيف", icon: "Sparkles", priceFrom: 200, duration: "90 د", description: "تلميع خارجي وتنظيف داخلي." },
];

export const notifications: NotificationItem[] = [
  { id: "n1", title: "تم تأكيد حجزك", body: "تم تأكيد حجز ورشة الفارس يوم الخميس الساعة 10:00 ص", time: "قبل 5 د", read: false, type: "booking" },
  { id: "n2", title: "طلبك في الطريق", body: "طلب #1023 قيد التوصيل، سيصل خلال 45 دقيقة", time: "قبل ساعة", read: false, type: "order" },
  { id: "n3", title: "خصم 20% على الإطارات", body: "عرض لفترة محدودة على جميع إطارات ميشلان", time: "قبل 3 ساعات", read: false, type: "promo" },
  { id: "n4", title: "تم تسليم طلبك", body: "تم تسليم طلب #1019 بنجاح", time: "أمس", read: true, type: "order" },
  { id: "n5", title: "تقييم الخدمة", body: "كيف كانت تجربتك مع ورشة النخبة؟", time: "قبل يومين", read: true, type: "system" },
  { id: "n6", title: "تذكير بالصيانة الدورية", body: "حان موعد الصيانة الدورية لسيارتك", time: "قبل 3 أيام", read: true, type: "system" },
];

export const cartItems = [
  { id: "ci1", productId: "p1", title: "زيت محرك شل هيلكس 5W-30", price: 175, qty: 2, image: products[0].images[0] },
  { id: "ci2", productId: "p3", title: "فلتر هواء بوش أصلي", price: 85, qty: 1, image: products[2].images[0] },
];

export const orders = [
  { id: "o1001", date: "2026-02-10", total: 435, status: "قيد التوصيل", items: 3 },
  { id: "o1002", date: "2026-02-05", total: 640, status: "تم التسليم", items: 1 },
  { id: "o1003", date: "2026-01-28", total: 295, status: "تم التسليم", items: 2 },
];

export const bookings = [
  { id: "b201", workshop: "ورشة الفارس", service: "تغيير زيت + فلتر", date: "2026-02-15", time: "10:00 ص", status: "مؤكد" },
  { id: "b202", workshop: "ورشة النخبة", service: "فحص شامل", date: "2026-02-08", time: "02:00 م", status: "مكتمل" },
];

// Bookings from the workshop owner's perspective
export type WorkshopBooking = {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  vehicle: string;
  price: number;
  status: "جديد" | "مؤكد" | "قيد التنفيذ" | "مكتمل" | "ملغي";
};

export const workshopBookings: WorkshopBooking[] = [
  { id: "wb1", customerName: "أحمد محمد", customerPhone: "0551234567", service: "تغيير زيت + فلتر", date: "2026-02-15", time: "10:00 ص", vehicle: "تويوتا كامري 2022", price: 180, status: "جديد" },
  { id: "wb2", customerName: "خالد السعيد", customerPhone: "0559876543", service: "فحص شامل", date: "2026-02-15", time: "12:00 م", vehicle: "نيسان التيما 2021", price: 250, status: "مؤكد" },
  { id: "wb3", customerName: "سعد العتيبي", customerPhone: "0552223344", service: "صيانة فرامل", date: "2026-02-16", time: "09:00 ص", vehicle: "هيونداي سوناتا 2020", price: 350, status: "قيد التنفيذ" },
  { id: "wb4", customerName: "محمد الحربي", customerPhone: "0553334455", service: "تغيير زيت + فلتر", date: "2026-02-12", time: "03:00 م", vehicle: "كيا سبورتاج 2019", price: 180, status: "مكتمل" },
  { id: "wb5", customerName: "عبدالله القحطاني", customerPhone: "0554445566", service: "فحص شامل", date: "2026-02-10", time: "11:00 ص", vehicle: "شيفروليه ماليبو 2018", price: 250, status: "مكتمل" },
];

// Session / role management (mock)
export type UserRole = "customer" | "company" | "workshop";

export type Session = {
  role: UserRole;
  name: string;
  email: string;
  entityId?: string; // id of the company/workshop the owner manages
};

// Company-side: orders, offers, sales stats
export type CompanyOrderStatus = "جديد" | "مقبول" | "قيد التجهيز" | "مكتمل" | "ملغي";

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

export const companyOrders: CompanyOrder[] = [
  { id: "co1", customerName: "أحمد محمد", customerPhone: "0551234567", city: "الرياض", productId: "p1", productTitle: "زيت محرك شل هيلكس 5W-30", productImage: products[0].images[0], quantity: 2, unitPrice: 175, total: 350, date: "2026-02-14", paymentMethod: "بطاقة", status: "جديد" },
  { id: "co2", customerName: "خالد السعيد", customerPhone: "0559876543", city: "جدة", productId: "p2", productTitle: "إطار ميشلان بريمير 225/45 R17", productImage: products[1].images[0], quantity: 4, unitPrice: 640, total: 2560, date: "2026-02-14", paymentMethod: "بطاقة", status: "جديد" },
  { id: "co3", customerName: "سعد العتيبي", customerPhone: "0552223344", city: "الرياض", productId: "p3", productTitle: "فلتر هواء بوش أصلي", productImage: products[2].images[0], quantity: 1, unitPrice: 85, total: 85, date: "2026-02-13", paymentMethod: "دفع عند الاستلام", status: "مقبول" },
  { id: "co4", customerName: "محمد الحربي", customerPhone: "0553334455", city: "الدمام", productId: "p1", productTitle: "زيت محرك شل هيلكس 5W-30", productImage: products[0].images[0], quantity: 3, unitPrice: 175, total: 525, date: "2026-02-13", paymentMethod: "محفظة", status: "قيد التجهيز" },
  { id: "co5", customerName: "عبدالله القحطاني", customerPhone: "0554445566", city: "الرياض", productId: "p4", productTitle: "بطارية AC Delco 70 أمبير", productImage: products[3].images[0], quantity: 1, unitPrice: 320, total: 320, date: "2026-02-11", paymentMethod: "بطاقة", status: "مكتمل" },
  { id: "co6", customerName: "فهد الدوسري", customerPhone: "0555556677", city: "جدة", productId: "p1", productTitle: "زيت محرك شل هيلكس 5W-30", productImage: products[0].images[0], quantity: 2, unitPrice: 175, total: 350, date: "2026-02-10", paymentMethod: "دفع عند الاستلام", status: "مكتمل" },
  { id: "co7", customerName: "ناصر الشهراني", customerPhone: "0556667788", city: "الرياض", productId: "p3", productTitle: "فلتر هواء بوش أصلي", productImage: products[2].images[0], quantity: 2, unitPrice: 85, total: 170, date: "2026-02-08", paymentMethod: "بطاقة", status: "ملغي" },
];

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

export const companyOffers: CompanyOffer[] = [
  { id: "of1", title: "خصم الشتاء على الزيوت", productId: "p1", productTitle: "زيت محرك شل هيلكس 5W-30", image: products[0].images[0], discountPercent: 20, startDate: "2026-02-01", endDate: "2026-02-28", state: "نشط", description: "خصم حصري على زيوت المحركات طوال فبراير." },
  { id: "of2", title: "عرض الإطارات", productId: "p2", productTitle: "إطار ميشلان بريمير 225/45 R17", image: products[1].images[0], discountPercent: 15, startDate: "2026-02-10", endDate: "2026-02-20", state: "نشط", description: "وفّر 15% عند شراء 4 إطارات ميشلان." },
  { id: "of3", title: "فلاتر بنصف السعر", productId: "p3", productTitle: "فلتر هواء بوش أصلي", image: products[2].images[0], discountPercent: 50, startDate: "2026-01-15", endDate: "2026-01-31", state: "منتهي", description: "عرض انتهى — خصم 50% على الفلاتر." },
  { id: "of4", title: "عرض الربيع القادم", productId: "p4", productTitle: "بطارية AC Delco 70 أمبير", image: products[3].images[0], discountPercent: 10, startDate: "2026-03-01", endDate: "2026-03-15", state: "مجدول", description: "عرض مجدول لبداية شهر مارس." },
];

export const companyStats = {
  totalProducts: products.length,
  monthlyOrders: 48,
  totalSales: 18450,
  views: "3.2k",
  bestSeller: {
    productId: "p1",
    title: "زيت محرك شل هيلكس 5W-30",
    image: products[0].images[0],
    sales: 124,
    revenue: 21700,
  },
};

// Workshop stats (mock)
export const workshopStats = {
  totalBookings: workshopBookings.length + 12,
  monthlyBookings: workshopBookings.length,
  revenue: workshopBookings.filter((b) => b.status === "مكتمل").reduce((s, b) => s + b.price, 0) + 4200,
  activeServices: 3,
  rating: 4.7,
  reviews: 320,
  topService: {
    name: "تغيير زيت + فلتر",
    count: 42,
    revenue: 7560,
  },
};

// Workshop offers (mock)
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
export const workshopOffers: WorkshopOffer[] = [
  { id: "wof1", title: "خصم تغيير الزيت", serviceName: "تغيير زيت + فلتر", discountPercent: 15, startDate: "2026-02-01", endDate: "2026-02-28", state: "نشط", description: "خصم 15% على خدمة تغيير الزيت طوال فبراير." },
  { id: "wof2", title: "الفحص الشامل المجاني", serviceName: "فحص شامل", discountPercent: 50, startDate: "2026-02-10", endDate: "2026-02-20", state: "نشط", description: "فحص شامل بنصف السعر لفترة محدودة." },
  { id: "wof3", title: "عرض الربيع", serviceName: "صيانة فرامل", discountPercent: 20, startDate: "2026-03-01", endDate: "2026-03-15", state: "مجدول", description: "خصم 20% قادم في بداية مارس." },
];
