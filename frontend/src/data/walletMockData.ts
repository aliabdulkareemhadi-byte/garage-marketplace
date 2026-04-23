// Mock wallet & transaction seed data.
// Used to initialise WalletContext during development. Replace with
// backend-backed data when the API becomes available.

import type { Wallet, WalletTransaction } from "../types/wallet";

export const initialWallet: Wallet = {
  id: "wal-1",
  ownerId: "w1", // aligns with mock workshop/company id conventions
  ownerType: "workshop",
  balance: 1500,
  currency: "ر.س",
  updatedAt: "2026-02-14T10:00:00.000Z",
};

export const sampleTransactions: WalletTransaction[] = [
  {
    id: "tx-1001",
    walletId: initialWallet.id,
    type: "topup",
    amount: 1000,
    status: "approved",
    reference: "BANK-TRF-88231",
    note: "تعبئة رصيد عبر تحويل بنكي",
    createdAt: "2026-01-05T08:12:00.000Z",
    updatedAt: "2026-01-05T12:40:00.000Z",
  },
  {
    id: "tx-1002",
    walletId: initialWallet.id,
    type: "topup",
    amount: 750,
    status: "approved",
    reference: "BANK-TRF-91045",
    note: "تعبئة رصيد",
    createdAt: "2026-01-22T09:30:00.000Z",
    updatedAt: "2026-01-22T11:15:00.000Z",
  },
  {
    id: "tx-1003",
    walletId: initialWallet.id,
    type: "deduct",
    amount: 150,
    status: "completed",
    reference: "AD-BOOST-7712",
    note: "ترويج عرض الشتاء",
    createdAt: "2026-02-01T14:20:00.000Z",
    updatedAt: "2026-02-01T14:20:00.000Z",
  },
  {
    id: "tx-1004",
    walletId: initialWallet.id,
    type: "deduct",
    amount: 100,
    status: "completed",
    reference: "FEATURE-FEE",
    note: "رسوم خدمة مميزة",
    createdAt: "2026-02-08T10:05:00.000Z",
    updatedAt: "2026-02-08T10:05:00.000Z",
  },
  {
    id: "tx-1005",
    walletId: initialWallet.id,
    type: "topup",
    amount: 500,
    status: "pending",
    reference: "BANK-TRF-93820",
    note: "بانتظار تأكيد التحويل",
    createdAt: "2026-02-14T09:00:00.000Z",
    updatedAt: "2026-02-14T09:00:00.000Z",
  },
];
