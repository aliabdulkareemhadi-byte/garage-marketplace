// Firestore-backed service for company offers.
// Collection: "companyOffers"  (flat, keyed by ownerUid — same pattern as ads.ts)
// Each document stores the ownerUid so offers can be queried per-company.

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CompanyOffer, CompanyOfferState } from "../types";

const COL = "companyOffers";

function stripUndefined<T extends Record<string, any>>(obj: T): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k] = v;
  return out;
}

function mapDoc(id: string, data: any): CompanyOffer {
  return {
    id,
    title: data.title ?? "",
    productId: data.productId,
    productTitle: data.productTitle ?? "",
    image: data.image ?? "",
    discountPercent: Number(data.discountPercent ?? 0),
    startDate: data.startDate ?? "",
    endDate: data.endDate ?? "",
    state: (data.state ?? "نشط") as CompanyOfferState,
    description: data.description ?? "",
  };
}

/** Fetch a single offer by its Firestore document ID. */
export async function getOffer(offerId: string): Promise<CompanyOffer | null> {
  const snap = await getDoc(doc(db, COL, offerId));
  if (!snap.exists()) return null;
  return mapDoc(snap.id, snap.data());
}

/** List all offers owned by this company user (scoped by ownerUid). */
export async function listOffers(ownerUid: string): Promise<CompanyOffer[]> {
  const q = query(collection(db, COL), where("ownerUid", "==", ownerUid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc(d.id, d.data()));
}

/** Create a new offer. Returns the saved CompanyOffer with its Firestore id. */
export async function createOffer(
  ownerUid: string,
  data: Omit<CompanyOffer, "id">
): Promise<CompanyOffer> {
  const payload = {
    ...stripUndefined(data as Record<string, any>),
    ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL), payload);
  return { ...data, id: ref.id };
}

/** Patch an existing offer document. */
export async function updateOffer(
  offerId: string,
  data: Partial<Omit<CompanyOffer, "id">>
): Promise<void> {
  await updateDoc(doc(db, COL, offerId), {
    ...stripUndefined(data as Record<string, any>),
    updatedAt: serverTimestamp(),
  });
}

/** Permanently delete an offer. */
export async function deleteOffer(offerId: string): Promise<void> {
  await deleteDoc(doc(db, COL, offerId));
}
