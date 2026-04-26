// Shared status label / color mappings.
// Extracted during cleanup: both workshop-dashboard/bookings and
// company-dashboard/orders defined identical maps inline.

import type { CompanyOrderStatus, WorkshopBookingStatus } from "../types";

export type StatusPalette = { bg: string; fg: string };

export const bookingStatusColors: Record<WorkshopBookingStatus, StatusPalette> =
  {
    "جديد": { bg: "#E6F0FF", fg: "#0066FF" },
    "مؤكد": { bg: "#D1FAE5", fg: "#10B981" },
    "قيد التنفيذ": { bg: "#FEF3C7", fg: "#F59E0B" },
    "مكتمل": { bg: "#F3F4F6", fg: "#4B5563" },
    "ملغي": { bg: "#FEE2E2", fg: "#EF4444" },
  };

export const orderStatusColors: Record<CompanyOrderStatus, StatusPalette> = {
  "جديد": { bg: "#E6F0FF", fg: "#0066FF" },
  "مقبول": { bg: "#D1FAE5", fg: "#10B981" },
  "قيد التجهيز": { bg: "#FEF3C7", fg: "#F59E0B" },
  "مكتمل": { bg: "#F3F4F6", fg: "#4B5563" },
  "ملغي": { bg: "#FEE2E2", fg: "#EF4444" },
};

/** Returns the color palette for a booking status, or a neutral fallback. */
export function getBookingStatusColor(
  status: WorkshopBookingStatus
): StatusPalette {
  return bookingStatusColors[status] ?? { bg: "#F3F4F6", fg: "#4B5563" };
}

/** Returns the color palette for an order status, or a neutral fallback. */
export function getOrderStatusColor(status: CompanyOrderStatus): StatusPalette {
  return orderStatusColors[status] ?? { bg: "#F3F4F6", fg: "#4B5563" };
}
