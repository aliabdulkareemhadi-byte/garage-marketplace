import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { MaintenanceReminder, ReminderStatus } from "../types/reminder";
import { mockReminders } from "../data/mockReminders";

type NewReminderInput = Omit<MaintenanceReminder, "id" | "status"> & {
  status?: ReminderStatus;
};

type RemindersContextValue = {
  reminders: MaintenanceReminder[];
  addReminder: (input: NewReminderInput) => MaintenanceReminder;
  updateStatus: (id: string, status: ReminderStatus) => void;
  removeReminder: (id: string) => void;
  getById: (id: string) => MaintenanceReminder | undefined;
};

const RemindersContext = createContext<RemindersContextValue | null>(null);

export function RemindersProvider({ children }: { children: React.ReactNode }) {
  const [reminders, setReminders] = useState<MaintenanceReminder[]>(mockReminders);

  const addReminder = useCallback((input: NewReminderInput) => {
    const newItem: MaintenanceReminder = {
      id: `rm${Date.now()}`,
      status: "نشط",
      ...input,
    };
    setReminders((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateStatus = useCallback((id: string, status: ReminderStatus) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const removeReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getById = useCallback(
    (id: string) => reminders.find((r) => r.id === id),
    [reminders]
  );

  const value = useMemo<RemindersContextValue>(
    () => ({ reminders, addReminder, updateStatus, removeReminder, getById }),
    [reminders, addReminder, updateStatus, removeReminder, getById]
  );

  return (
    <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>
  );
}

export function useReminders(): RemindersContextValue {
  const ctx = useContext(RemindersContext);
  if (!ctx) {
    throw new Error("useReminders must be used within a RemindersProvider");
  }
  return ctx;
}
