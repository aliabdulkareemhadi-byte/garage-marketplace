// Firestore-backed top-up requests service.
// Best-effort: callers should handle thrown errors gracefully.

import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type TopUpRequestStatus = "pending" | "approved" | "rejected";

export type TopUpRequest = {
  id: string;
  uid: string;
  amount: number;
  status: TopUpRequestStatus;
  note: string;
  createdAt?: any; // firestore Timestamp on read; serverTimestamp() on write
};

const COL = "topUpRequests";

/** Create a new pending top-up request. Returns the created doc (with id). */
export async function createTopUpRequest(
  uid: string,
  amount: number,
  note: string
): Promise<TopUpRequest> {
  const payload = {
    uid,
    amount,
    status: "pending" as TopUpRequestStatus,
    note,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL), payload);
  return { id: ref.id, ...payload };
}

/** List all top-up requests (admin view), newest first. */
export async function listTopUpRequests(): Promise<TopUpRequest[]> {
  let snap;
  try {
    snap = await getDocs(
      query(collection(db, COL), orderBy("createdAt", "desc"))
    );
  } catch {
    // `orderBy` requires the field to exist on every doc — fall back to an
    // unordered query so legacy docs without createdAt still appear.
    snap = await getDocs(collection(db, COL));
  }
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      uid: data.uid ?? "",
      amount: Number(data.amount ?? 0),
      status: (data.status ?? "pending") as TopUpRequestStatus,
      note: data.note ?? "",
      createdAt: data.createdAt,
    };
  });
}

/** Update only the status of a request (admin approve/reject). */
export async function updateTopUpRequestStatus(
  id: string,
  status: Exclude<TopUpRequestStatus, "pending">
): Promise<void> {
  await updateDoc(doc(db, COL, id), { status });
}
