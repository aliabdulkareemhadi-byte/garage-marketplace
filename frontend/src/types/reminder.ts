// Maintenance reminder types (workshop-side only).
// Isolated feature module — safe to extend without touching shared domain types.

export type ReminderStatus = "نشط" | "قريب الاستحقاق" | "مكتمل" | "ملغي";

export type ReminderServiceType =
  | "تغيير زيت"
  | "تغيير فلتر"
  | "صيانة فرامل"
  | "فحص عام"
  | "استبدال بطارية"
  | "صيانة تكييف"
  | "صيانة كهرباء"
  | "أخرى";

export type MaintenanceReminder = {
  id: string;
  customerName: string;
  customerPhone: string;
  carModel: string;
  carYear: string;
  serviceType: ReminderServiceType;
  workDone: string;
  workshopNotes: string;
  serviceDate: string; // ISO yyyy-mm-dd
  returnDuration: string; // free-text (e.g. "3 أشهر", "5,000 كم")
  nextReminderDate: string; // ISO yyyy-mm-dd
  status: ReminderStatus;
};

export const REMINDER_SERVICE_TYPES: ReminderServiceType[] = [
  "تغيير زيت",
  "تغيير فلتر",
  "صيانة فرامل",
  "فحص عام",
  "استبدال بطارية",
  "صيانة تكييف",
  "صيانة كهرباء",
  "أخرى",
];

export const REMINDER_STATUSES: ReminderStatus[] = [
  "نشط",
  "قريب الاستحقاق",
  "مكتمل",
  "ملغي",
];
