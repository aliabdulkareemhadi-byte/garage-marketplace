// Firestore-backed service for company products.
// Collection: "companyProducts"  (flat, keyed by ownerUid — same pattern as companyOffers.ts)

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
import type { Product } from "../types";

/** Product as stored in Firestore — extends the base Product type with an `active` visibility flag. */
export type CompanyProduct = Product & { active: boolean };

const COL = "companyProducts";

function stripUndefined<T extends Record<string, any>>(obj: T): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k] = v;
  return out;
}

function mapDoc(id: string, data: any): CompanyProduct {
  return {
    id,
    title: data.title ?? "",
    brand: data.brand ?? "",
    price: Number(data.price ?? 0),
    oldPrice: data.oldPrice !== undefined && data.oldPrice !== null ? Number(data.oldPrice) : undefined,
    rating: Number(data.rating ?? 0),
    reviews: Number(data.reviews ?? 0),
    images: Array.isArray(data.images) ? data.images : [],
    description: data.description ?? "",
    specs: Array.isArray(data.specs) ? data.specs : [],
    inStock: data.inStock !== false,
    active: data.active !== false,
  };
}

/** Fetch a single product by its Firestore document ID. */
export async function getProduct(productId: string): Promise<CompanyProduct | null> {
  const snap = await getDoc(doc(db, COL, productId));
  if (!snap.exists()) return null;
  return mapDoc(snap.id, snap.data());
}

/** List all products owned by this company user (scoped by ownerUid). */
export async function listProducts(ownerUid: string): Promise<CompanyProduct[]> {
  const q = query(collection(db, COL), where("ownerUid", "==", ownerUid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc(d.id, d.data()));
}

/** Create a new product. Returns the saved CompanyProduct with its Firestore id. */
export async function createProduct(
  ownerUid: string,
  data: Omit<CompanyProduct, "id">
): Promise<CompanyProduct> {
  const payload = {
    ...stripUndefined(data as Record<string, any>),
    ownerUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL), payload);
  return { ...data, id: ref.id };
}

/** Patch an existing product document. */
export async function updateProduct(
  productId: string,
  data: Partial<Omit<CompanyProduct, "id">>
): Promise<void> {
  await updateDoc(doc(db, COL, productId), {
    ...stripUndefined(data as Record<string, any>),
    updatedAt: serverTimestamp(),
  });
}

/** Permanently delete a product. */
export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, COL, productId));
}
