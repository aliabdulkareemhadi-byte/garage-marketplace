// Firestore-backed ads service.
// All methods are best-effort: callers should handle thrown errors and fall back
// to mock/local state to preserve the existing UX when Firestore is unreachable.

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Ad, AdvertiserType } from "../types/ad";

const ADS_COL = "ads";

function stripUndefined<T extends Record<string, any>>(obj: T): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k] = v;
  return out;
}

function mapDoc(id: string, data: any): Ad {
  return {
    id,
    title: data.title ?? "",
    description: data.description ?? "",
    imageUrl: data.imageUrl ?? "",
    advertiserType: data.advertiserType,
    startDate: data.startDate ?? "",
    endDate: data.endDate ?? "",
    isFeatured: !!data.isFeatured,
    status: data.status ?? "active",
    promotionPrice: Number(data.promotionPrice ?? 0),
    isPaid: !!data.isPaid,
    ownerUid: data.ownerUid,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/** Create a new ad. Returns the full Ad (with Firestore-generated id). */
export async function createAd(
  data: Omit<Ad, "id" | "createdAt" | "updatedAt"> & { ownerUid: string }
): Promise<Ad> {
  const payload = {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, ADS_COL), payload);
  return { ...(data as any), id: ref.id } as Ad;
}

/** Patch an existing ad (used by promote flow). */
export async function updateAd(id: string, patch: Partial<Ad>): Promise<void> {
  await updateDoc(doc(db, ADS_COL, id), {
    ...stripUndefined(patch),
    updatedAt: serverTimestamp(),
  });
}

/** List ads owned by a given user, filtered by advertiser type. */
export async function listAdsByOwner(
  advertiserType: AdvertiserType,
  ownerUid: string
): Promise<Ad[]> {
  const q = query(
    collection(db, ADS_COL),
    where("advertiserType", "==", advertiserType),
    where("ownerUid", "==", ownerUid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc(d.id, d.data()));
}

/** List all active ads (for customer home). */
export async function listActiveAds(): Promise<Ad[]> {
  const q = query(collection(db, ADS_COL), where("status", "==", "active"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc(d.id, d.data()));
}
