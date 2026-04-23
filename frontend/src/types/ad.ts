// Internal Advertisement domain types.
// Additive only — no external dependencies.

export type AdvertiserType = "workshop" | "company";

export type AdStatus = "active" | "expired" | "scheduled";

export type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  advertiserType: AdvertiserType;
  startDate: string; // ISO or YYYY-MM-DD
  endDate: string;   // ISO or YYYY-MM-DD
  isFeatured: boolean;
  status: AdStatus;
  promotionPrice: number;
  isPaid: boolean;
  // Firestore-backed fields (optional to preserve compatibility with mock seeds).
  ownerUid?: string;
  createdAt?: any; // firestore Timestamp on read; serverTimestamp() on write
  updatedAt?: any;
};

export const AD_PRICE_NORMAL = 25000;
export const AD_PRICE_FEATURED = 50000;
