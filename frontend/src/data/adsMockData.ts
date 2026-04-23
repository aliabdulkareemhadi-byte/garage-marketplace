// Mock seed for workshop internal advertisements.
// Replace with backend data when API becomes available.

import type { Ad } from "../types/ad";
import { AD_PRICE_FEATURED, AD_PRICE_NORMAL } from "../types/ad";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=60";

export const initialWorkshopAds: Ad[] = [
  {
    id: "ad-1",
    title: "صيانة شاملة بخصم خاص",
    description: "عرض محدود على الفحص الشامل وتغيير الزيت.",
    imageUrl: PLACEHOLDER,
    advertiserType: "workshop",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
    isFeatured: true,
    status: "active",
    promotionPrice: AD_PRICE_FEATURED,
    isPaid: true,
  },
  {
    id: "ad-2",
    title: "خدمات الفرامل المتميزة",
    description: "جودة عالية وأسعار منافسة لصيانة الفرامل.",
    imageUrl: PLACEHOLDER,
    advertiserType: "workshop",
    startDate: "2026-01-15",
    endDate: "2026-01-31",
    isFeatured: false,
    status: "expired",
    promotionPrice: AD_PRICE_NORMAL,
    isPaid: true,
  },
  {
    id: "ad-3",
    title: "عرض الربيع القادم",
    description: "تجهيز السيارة لموسم الربيع بأفضل الأسعار.",
    imageUrl: PLACEHOLDER,
    advertiserType: "workshop",
    startDate: "2026-03-10",
    endDate: "2026-03-25",
    isFeatured: false,
    status: "scheduled",
    promotionPrice: AD_PRICE_NORMAL,
    isPaid: false,
  },
  {
    id: "ad-4",
    title: "تغيير زيت احترافي",
    description: "زيوت أصلية وخدمة سريعة لجميع أنواع السيارات.",
    imageUrl:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=60",
    advertiserType: "workshop",
    startDate: "2026-02-05",
    endDate: "2026-03-05",
    isFeatured: false,
    status: "active",
    promotionPrice: AD_PRICE_NORMAL,
    isPaid: true,
  },
  {
    id: "ad-5",
    title: "فحص كهرباء السيارة",
    description: "تشخيص شامل لمنظومة الكهرباء بأحدث الأجهزة.",
    imageUrl:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=60",
    advertiserType: "workshop",
    startDate: "2026-02-10",
    endDate: "2026-03-15",
    isFeatured: true,
    status: "active",
    promotionPrice: AD_PRICE_FEATURED,
    isPaid: true,
  },
  {
    id: "ad-6",
    title: "صيانة التكييف الصيفية",
    description: "تعبئة غاز وتنظيف مكيف السيارة بعروض حصرية.",
    imageUrl:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=60",
    advertiserType: "workshop",
    startDate: "2026-02-12",
    endDate: "2026-04-01",
    isFeatured: false,
    status: "active",
    promotionPrice: AD_PRICE_NORMAL,
    isPaid: true,
  },
];

export const AD_PLACEHOLDER_IMAGE = PLACEHOLDER;

// Mock seed for company internal advertisements.
// Additive only — mirrors workshop seed with advertiserType = "company".
export const initialCompanyAds: Ad[] = [
  {
    id: "cad-1",
    title: "خصم خاص على قطع الغيار الأصلية",
    description: "تشكيلة واسعة من قطع الغيار الأصلية بأسعار منافسة.",
    imageUrl:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=60",
    advertiserType: "company",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
    isFeatured: true,
    status: "active",
    promotionPrice: AD_PRICE_FEATURED,
    isPaid: true,
  },
  {
    id: "cad-2",
    title: "إطارات بأسعار الجملة",
    description: "إطارات متنوعة من أشهر الماركات العالمية.",
    imageUrl:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=60",
    advertiserType: "company",
    startDate: "2026-02-05",
    endDate: "2026-03-05",
    isFeatured: false,
    status: "active",
    promotionPrice: AD_PRICE_NORMAL,
    isPaid: true,
  },
  {
    id: "cad-3",
    title: "بطاريات عالية الجودة",
    description: "بطاريات بضمان طويل الأمد وأداء موثوق.",
    imageUrl:
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=60",
    advertiserType: "company",
    startDate: "2026-03-01",
    endDate: "2026-03-20",
    isFeatured: false,
    status: "scheduled",
    promotionPrice: AD_PRICE_NORMAL,
    isPaid: false,
  },
];
