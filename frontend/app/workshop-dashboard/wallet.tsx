import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronRight, Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useWallet } from "../../src/context/WalletContext";
import { useAuth } from "../../src/context/AuthContext";
import { createTopUpRequest } from "../../src/services/topUpRequests";
import type { WalletTransaction, WalletTransactionStatus } from "../../src/types/wallet";

const PACKAGES: number[] = [25000, 50000, 100000];

const statusMeta: Record<
  WalletTransactionStatus,
  { label: string; bg: string; fg: string; icon: React.ReactNode }
> = {
  pending: { label: "قيد الانتظار", bg: "#FEF3C7", fg: "#F59E0B", icon: <Clock size={11} color="#F59E0B" /> },
  approved: { label: "تمت الموافقة", bg: "#D1FAE5", fg: "#10B981", icon: <CheckCircle2 size={11} color="#10B981" /> },
  rejected: { label: "مرفوض", bg: "#FEE2E2", fg: "#EF4444", icon: <XCircle size={11} color="#EF4444" /> },
  completed: { label: "مكتمل", bg: "#E6F0FF", fg: "#0066FF", icon: <CheckCircle2 size={11} color="#0066FF" /> },
  failed: { label: "فشل", bg: "#FEE2E2", fg: "#EF4444", icon: <AlertTriangle size={11} color="#EF4444" /> },
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}

export default function WalletScreen() {
  const router = useRouter();
  const { wallet, transactions, requestTopUp } = useWallet();
  const { session } = useAuth();

  const doTopUp = (amount: number) => {
    const note = `تعبئة باقة ${formatNumber(amount)} ${wallet.currency}`;
    const res = requestTopUp(amount, note);
    if (res.ok) {
      // Mirror request to Firestore (source of truth for admin). Best-effort —
      // failure here does not affect the local pending transaction UX.
      const uid = session?.uid || wallet.ownerId || "anonymous";
      createTopUpRequest(uid, amount, note).catch(() => {});
      Alert.alert(
        "تم إرسال طلب التعبئة",
        `طلبك بقيمة ${formatNumber(amount)} ${wallet.currency} قيد المراجعة.`
      );
    } else {
      Alert.alert("تعذر إرسال الطلب", res.reason);
    }
  };

  const openTopUpPicker = () => {
    Alert.alert("إضافة رصيد", "اختر باقة التعبئة", [
      ...PACKAGES.map((p) => ({ text: `${formatNumber(p)} ${wallet.currency}`, onPress: () => doTopUp(p) })),
      { text: "إلغاء", style: "cancel" as const },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity testID="wallet-back" onPress={() => router.back()} style={styles.back}>
          <ChevronRight size={22} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.title}>المحفظة</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.scroll}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListHeaderComponent={
          <View>
            {/* Balance card */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceHead}>
                <View style={styles.balanceIcon}>
                  <WalletIcon size={18} color="#fff" />
                </View>
                <Text style={styles.balanceLabel}>الرصيد المتاح</Text>
              </View>
              <View style={styles.balanceAmountRow}>
                <Text style={styles.balanceAmount}>{formatNumber(wallet.balance)}</Text>
                <Text style={styles.balanceCurrency}>{wallet.currency}</Text>
              </View>
              <TouchableOpacity testID="wallet-topup-btn" style={styles.topupBtn} onPress={openTopUpPicker}>
                <Plus size={16} color={colors.primary} />
                <Text style={styles.topupTxt}>إضافة رصيد</Text>
              </TouchableOpacity>
            </View>

            {/* Packages */}
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>الباقات</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pkgRow}
            >
              {PACKAGES.map((p) => (
                <TouchableOpacity
                  key={p}
                  testID={`wallet-pkg-${p}`}
                  style={styles.pkgCard}
                  onPress={() => doTopUp(p)}
                >
                  <Text style={styles.pkgAmount}>{formatNumber(p)}</Text>
                  <Text style={styles.pkgCurrency}>{wallet.currency}</Text>
                  <View style={styles.pkgCta}>
                    <Plus size={12} color="#fff" />
                    <Text style={styles.pkgCtaTxt}>تعبئة</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Transactions header */}
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>سجل المعاملات</Text>
              <Text style={styles.sectionSub}>{transactions.length} معاملة</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>لا توجد معاملات بعد</Text>
            <Text style={styles.emptyDesc}>ستظهر معاملاتك هنا بعد أول تعبئة أو خصم.</Text>
          </View>
        }
        renderItem={({ item }) => <TxRow tx={item} currency={wallet.currency} />}
      />
    </SafeAreaView>
  );
}

function TxRow({ tx, currency }: { tx: WalletTransaction; currency: string }) {
  const isTop = tx.type === "topup";
  const meta = statusMeta[tx.status];
  return (
    <View style={styles.txRow} testID={`wallet-tx-${tx.id}`}>
      <View style={[styles.txIcon, { backgroundColor: isTop ? "#D1FAE5" : "#FEE2E2" }]}>
        {isTop ? (
          <ArrowDownLeft size={16} color={colors.success} />
        ) : (
          <ArrowUpRight size={16} color={colors.error} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txTitle}>{isTop ? "تعبئة رصيد" : "خصم"}</Text>
        {tx.note ? <Text style={styles.txNote} numberOfLines={1}>{tx.note}</Text> : null}
        <View style={styles.txMeta}>
          <View style={[styles.statusTag, { backgroundColor: meta.bg }]}>
            {meta.icon}
            <Text style={[styles.statusTxt, { color: meta.fg }]}>{meta.label}</Text>
          </View>
          <Text style={styles.txDate}>{formatDate(tx.createdAt)}</Text>
        </View>
      </View>
      <Text style={[styles.txAmount, { color: isTop ? colors.success : colors.error }]}>
        {isTop ? "+" : "−"}{formatNumber(tx.amount)} {currency}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h2 },

  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  balanceHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  balanceIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceLabel: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "700" },
  balanceAmountRow: { flexDirection: "row", alignItems: "flex-end", gap: 6 },
  balanceAmount: { color: "#fff", fontSize: 34, fontWeight: "800", lineHeight: 38 },
  balanceCurrency: { color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  topupBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff",
    height: 44,
    borderRadius: radius.md,
  },
  topupTxt: { color: colors.primary, fontSize: 14, fontWeight: "800" },

  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, textAlign: "right" },
  sectionSub: { fontSize: 11, color: colors.textMuted, fontWeight: "700" },

  pkgRow: { gap: spacing.md, flexDirection: "row", paddingVertical: 2 },
  pkgCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginEnd: spacing.md,
    gap: 4,
  },
  pkgAmount: { fontSize: 22, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  pkgCurrency: { fontSize: 11, color: colors.textMuted, fontWeight: "700", textAlign: "right" },
  pkgCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    height: 32,
    borderRadius: radius.sm,
  },
  pkgCtaTxt: { color: "#fff", fontSize: 11, fontWeight: "800" },

  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  txIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  txTitle: { fontSize: 13, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  txNote: { fontSize: 11, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  txMeta: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 6 },
  statusTag: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  statusTxt: { fontSize: 10, fontWeight: "800" },
  txDate: { fontSize: 11, color: colors.textLight, fontWeight: "600" },
  txAmount: { fontSize: 14, fontWeight: "800" },

  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    gap: 6,
  },
  emptyTitle: { fontSize: 14, fontWeight: "800", color: colors.textMain },
  emptyDesc: { fontSize: 12, color: colors.textMuted, textAlign: "center" },
});
