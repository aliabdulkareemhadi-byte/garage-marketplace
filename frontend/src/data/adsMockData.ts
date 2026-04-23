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
];

export const AD_PLACEHOLDER_IMAGE = PLACEHOLDER;
