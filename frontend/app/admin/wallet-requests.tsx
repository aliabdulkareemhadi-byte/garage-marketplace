import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet as WalletIcon,
  User,
} from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useWallet } from "../../src/context/WalletContext";
import {
  listTopUpRequests,
  updateTopUpRequestStatus,
  type TopUpRequest as FsTopUpRequest,
  type TopUpRequestStatus,
} from "../../src/services/topUpRequests";

type RequestStatus = TopUpRequestStatus;

type TopUpRequest = {
  id: string;
  userId: string;
  amount: number;
  note: string;
  status: RequestStatus;
};

// Mock fallback — used only when Firestore is empty OR unreachable (preview pod).
const MOCK_REQUESTS: TopUpRequest[] = [
  {
    id: "req-1001",
    userId: "w1",
    amount: 5000,
    note: "تحويل بنكي - الراجحي",
    status: "pending",
  },
  {
    id: "req-1002",
    userId: "w2",
    amount: 25000,
    note: "تعبئة لترويج إعلان",
    status: "pending",
  },
  {
    id: "req-1003",
    userId: "c1",
    amount: 10000,
    note: "تحويل بنكي - الأهلي",
    status: "pending",
  },
  {
    id: "req-1004",
    userId: "w3",
    amount: 50000,
    note: "تعبئة لإعلان مميز",
    status: "pending",
  },
];

const statusMeta: Record<
  RequestStatus,
  { label: string; bg: string; fg: string; icon: React.ReactNode }
> = {
  pending: {
    label: "قيد المراجعة",
    bg: "#FEF3C7",
    fg: "#F59E0B",
    icon: <Clock size={11} color="#F59E0B" />,
  },
  approved: {
    label: "مقبول",
    bg: "#D1FAE5",
    fg: "#10B981",
    icon: <CheckCircle2 size={11} color="#10B981" />,
  },
  rejected: {
    label: "مرفوض",
    bg: "#FEE2E2",
    fg: "#EF4444",
    icon: <XCircle size={11} color="#EF4444" />,
  },
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function mapFsRequest(r: FsTopUpRequest): TopUpRequest {
  return {
    id: r.id,
    userId: r.uid,
    amount: r.amount,
    note: r.note,
    status: r.status,
  };
}

export default function AdminWalletRequests() {
  const router = useRouter();
  const { wallet } = useWallet();

  const [requests, setRequests] = useState<TopUpRequest[]>(MOCK_REQUESTS);

  // Load real requests from Firestore; fall back to mock if empty/unreachable.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const remote = await listTopUpRequests();
        if (cancelled) return;
        if (remote.length > 0) setRequests(remote.map(mapFsRequest));
      } catch {
        // Keep mock fallback.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  const onApprove = (req: TopUpRequest) => {
    // Per spec: approve updates status only — no balance logic.
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "approved" } : r))
    );
    // Best-effort Firestore sync.
    updateTopUpRequestStatus(req.id, "approved").catch(() => {});
    Alert.alert("تم قبول الطلب", `تم تحديث حالة الطلب إلى مقبول.`);
  };

  const onReject = (req: TopUpRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "rejected" } : r))
    );
    updateTopUpRequestStatus(req.id, "rejected").catch(() => {});
    Alert.alert("تم رفض الطلب", "تم تحديث حالة الطلب إلى مرفوض.");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          testID="admin-back"
          onPress={() => router.back()}
          style={styles.back}
        >
          <ChevronRight size={22} color={colors.textMain} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>طلبات تعبئة الرصيد</Text>
          <Text style={styles.sub}>
            {requests.length} طلب · {pendingCount} قيد المراجعة
          </Text>
        </View>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeTxt}>Admin</Text>
        </View>
      </View>

      <View style={styles.balanceStrip}>
        <View style={styles.walletIconWrap}>
          <WalletIcon size={16} color={colors.accent} />
        </View>
        <Text style={styles.balanceLabel}>الرصيد الحالي</Text>
        <Text style={styles.balanceAmount}>
          {formatNumber(wallet.balance)} {wallet.currency}
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>لا توجد طلبات</Text>
          </View>
        }
        renderItem={({ item }) => {
          const meta = statusMeta[item.status];
          const isPending = item.status === "pending";
          return (
            <View style={styles.card} testID={`admin-req-${item.id}`}>
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <User size={16} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userId}>{item.userId}</Text>
                  <Text style={styles.reqId}>{item.id}</Text>
                </View>
                <View style={[styles.statusTag, { backgroundColor: meta.bg }]}>
                  {meta.icon}
                  <Text style={[styles.statusTxt, { color: meta.fg }]}>
                    {meta.label}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>المبلغ</Text>
                <Text style={styles.amount}>
                  {formatNumber(item.amount)} {wallet.currency}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ملاحظة</Text>
                <Text style={styles.note} numberOfLines={2}>
                  {item.note}
                </Text>
              </View>

              {isPending ? (
                <View style={styles.actions}>
                  <TouchableOpacity
                    testID={`admin-approve-${item.id}`}
                    style={styles.approveBtn}
                    onPress={() => onApprove(item)}
                  >
                    <CheckCircle2 size={14} color="#fff" />
                    <Text style={styles.approveTxt}>قبول</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID={`admin-reject-${item.id}`}
                    style={styles.rejectBtn}
                    onPress={() => onReject(item)}
                  >
                    <XCircle size={14} color={colors.error} />
                    <Text style={styles.rejectTxt}>رفض</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { ...typography.h2, textAlign: "right" },
  sub: { fontSize: 11, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  adminBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  adminBadgeTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },

  balanceStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  walletIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceLabel: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "700",
    textAlign: "right",
  },
  balanceAmount: { fontSize: 13, color: colors.accent, fontWeight: "800" },

  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  userId: { fontSize: 13, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  reqId: { fontSize: 10, color: colors.textMuted, textAlign: "right", marginTop: 1 },
  statusTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusTxt: { fontSize: 10, fontWeight: "800" },

  divider: { height: 1, backgroundColor: colors.border },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  infoLabel: { fontSize: 11, color: colors.textMuted, fontWeight: "700" },
  amount: { fontSize: 13, fontWeight: "800", color: colors.accent },
  note: {
    flex: 1,
    fontSize: 12,
    color: colors.textMain,
    fontWeight: "600",
    textAlign: "left",
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  approveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.success,
    height: 38,
    borderRadius: radius.md,
  },
  approveTxt: { color: "#fff", fontSize: 12, fontWeight: "800" },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  rejectTxt: { color: colors.error, fontSize: 12, fontWeight: "800" },

  empty: {
    padding: spacing.xl,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: { fontSize: 13, color: colors.textMuted, fontWeight: "700" },
});
