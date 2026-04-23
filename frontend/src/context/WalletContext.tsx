import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  Wallet,
  WalletActionResult,
  WalletTransaction,
} from "../types/wallet";
import { initialWallet, sampleTransactions } from "../data/walletMockData";

type WalletContextValue = {
  wallet: Wallet;
  transactions: WalletTransaction[];
  /** Creates a pending top-up transaction. Balance is NOT credited yet. */
  requestTopUp: (amount: number, note?: string) => WalletActionResult;
  /** Approves a pending top-up: marks it approved and credits the wallet. */
  approveTopUp: (id: string) => WalletActionResult;
  /** Rejects a pending top-up: marks it rejected, no balance change. */
  rejectTopUp: (id: string) => WalletActionResult;
  /** Deducts from the wallet. Creates a completed deduct transaction or fails if insufficient. */
  deductBalance: (amount: number, note?: string) => WalletActionResult;
  /** Atomically credits the wallet and creates an approved topup transaction. Additive helper for admin-side crediting. */
  creditWallet: (amount: number, note?: string) => WalletActionResult;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function nowIso(): string {
  return new Date().toISOString();
}

function genId(prefix: string): string {
  // Deterministic-enough mock id; backend will replace this.
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>(initialWallet);
  const [transactions, setTransactions] =
    useState<WalletTransaction[]>(sampleTransactions);

  const requestTopUp = useCallback<WalletContextValue["requestTopUp"]>(
    (amount, note) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        return { ok: false, reason: "المبلغ غير صالح" };
      }
      const tx: WalletTransaction = {
        id: genId("tx"),
        walletId: wallet.id,
        type: "topup",
        amount,
        status: "pending",
        note,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      setTransactions((prev) => [tx, ...prev]);
      return { ok: true, transaction: tx };
    },
    [wallet.id]
  );

  const approveTopUp = useCallback<WalletContextValue["approveTopUp"]>(
    (id) => {
      const existing = transactions.find((t) => t.id === id);
      if (!existing) {
        return { ok: false, reason: "المعاملة غير موجودة" };
      }
      if (existing.type !== "topup") {
        return { ok: false, reason: "المعاملة ليست تعبئة رصيد" };
      }
      if (existing.status !== "pending") {
        return { ok: false, reason: "المعاملة ليست قيد الانتظار" };
      }
      const updated: WalletTransaction = {
        ...existing,
        status: "approved",
        updatedAt: nowIso(),
      };
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setWallet((prev) => ({
        ...prev,
        balance: prev.balance + existing.amount,
        updatedAt: nowIso(),
      }));
      return { ok: true, transaction: updated };
    },
    [transactions]
  );

  const rejectTopUp = useCallback<WalletContextValue["rejectTopUp"]>(
    (id) => {
      const existing = transactions.find((t) => t.id === id);
      if (!existing) {
        return { ok: false, reason: "المعاملة غير موجودة" };
      }
      if (existing.type !== "topup") {
        return { ok: false, reason: "المعاملة ليست تعبئة رصيد" };
      }
      if (existing.status !== "pending") {
        return { ok: false, reason: "المعاملة ليست قيد الانتظار" };
      }
      const updated: WalletTransaction = {
        ...existing,
        status: "rejected",
        updatedAt: nowIso(),
      };
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return { ok: true, transaction: updated };
    },
    [transactions]
  );

  const deductBalance = useCallback<WalletContextValue["deductBalance"]>(
    (amount, note) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        return { ok: false, reason: "المبلغ غير صالح" };
      }
      if (amount > wallet.balance) {
        const failed: WalletTransaction = {
          id: genId("tx"),
          walletId: wallet.id,
          type: "deduct",
          amount,
          status: "failed",
          note: note ?? "رصيد غير كافٍ",
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        setTransactions((prev) => [failed, ...prev]);
        return { ok: false, reason: "الرصيد غير كافٍ" };
      }
      const tx: WalletTransaction = {
        id: genId("tx"),
        walletId: wallet.id,
        type: "deduct",
        amount,
        status: "completed",
        note,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      setTransactions((prev) => [tx, ...prev]);
      setWallet((prev) => ({
        ...prev,
        balance: prev.balance - amount,
        updatedAt: nowIso(),
      }));
      return { ok: true, transaction: tx };
    },
    [wallet.balance, wallet.id]
  );

  const creditWallet = useCallback<WalletContextValue["creditWallet"]>(
    (amount, note) => {
      if (!Number.isFinite(amount) || amount <= 0) {
        return { ok: false, reason: "المبلغ غير صالح" };
      }
      const tx: WalletTransaction = {
        id: genId("tx"),
        walletId: wallet.id,
        type: "topup",
        amount,
        status: "approved",
        note,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      setTransactions((prev) => [tx, ...prev]);
      setWallet((prev) => ({
        ...prev,
        balance: prev.balance + amount,
        updatedAt: nowIso(),
      }));
      return { ok: true, transaction: tx };
    },
    [wallet.id]
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      wallet,
      transactions,
      requestTopUp,
      approveTopUp,
      rejectTopUp,
      deductBalance,
      creditWallet,
    }),
    [wallet, transactions, requestTopUp, approveTopUp, rejectTopUp, deductBalance, creditWallet]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
}
