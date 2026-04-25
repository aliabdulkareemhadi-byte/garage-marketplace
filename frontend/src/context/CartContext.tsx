import React, { createContext, useContext, useState, ReactNode } from "react";
import { cartItems as seed } from "../data/mockData";

type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  qty: number;
  image: string;
};

type CartCtx = {
  items: CartItem[];
  addItem: (p: { id: string; title: string; price: number; image: string }) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(seed);

  const addItem = (p: { id: string; title: string; price: number; image: string }) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === p.id);
      if (found) {
        return prev.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: `ci${Date.now()}`, productId: p.id, title: p.title, price: p.price, image: p.image, qty: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return setItems((prev) => prev.filter((i) => i.id !== id));
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ items, addItem, updateQty, removeItem, clear, total, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
