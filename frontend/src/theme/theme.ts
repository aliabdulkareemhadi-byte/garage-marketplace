export const colors = {
  primary: "#0A0A0A",
  secondary: "#FFFFFF",
  accent: "#0066FF",
  accentSoft: "#E6F0FF",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F3F4F6",
  textMain: "#111827",
  textMuted: "#4B5563",
  textLight: "#9CA3AF",
  border: "#E5E7EB",
  borderStrong: "#D1D5DB",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  star: "#F59E0B",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 24, fontWeight: "700" as const, color: colors.textMain },
  h2: { fontSize: 18, fontWeight: "700" as const, color: colors.textMain },
  h3: { fontSize: 16, fontWeight: "600" as const, color: colors.textMain },
  body: { fontSize: 14, fontWeight: "400" as const, color: colors.textMuted },
  bodyStrong: { fontSize: 14, fontWeight: "600" as const, color: colors.textMain },
  small: { fontSize: 12, fontWeight: "500" as const, color: colors.textLight },
  price: { fontSize: 16, fontWeight: "700" as const, color: colors.textMain },
};
