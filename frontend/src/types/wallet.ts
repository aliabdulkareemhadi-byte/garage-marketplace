// Wallet / Balance domain types (shared by workshop and company sides).
// Isolated additive module — no UI bindings here.

export type WalletOwnerType = "workshop" | "company";

export type WalletCurrency = "ر.س" | "USD" | "EUR";

export type Wallet = {
  id: string;
  ownerId: string;
  ownerType: WalletOwnerType;
  balance: number;
  currency: WalletCurrency;
  updatedAt: string; // ISO timestamp
};

export type WalletTransactionType = "topup" | "deduct";

export type WalletTransactionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "failed";

export type WalletTransaction = {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number;
  status: WalletTransactionStatus;
  /** Optional external reference (e.g. invoice id, booking id, payment ref). */
  reference?: string;
  /** Optional short description shown to the owner. */
  note?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};

/** Result shape returned by wallet context actions. */
export type WalletActionResult =
  | { ok: true; transaction: WalletTransaction }
  | { ok: false; reason: string };
