import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Plus,
  Megaphone,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  TrendingUp,
  X,
  Save,
  FileText,
  Tag,
  Wallet as WalletIcon,
} from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import EmptyState from "../../src/components/EmptyState";
import FilterTabs from "../../src/components/FilterTabs";
import { useWallet } from "../../src/context/WalletContext";
import { useAuth } from "../../src/context/AuthContext";
import { createAd, listAdsByOwner, updateAd } from "../../src/services/ads";
import {
  AD_PRICE_FEATURED,
  AD_PRICE_NORMAL,
  type Ad,
  type AdStatus,
} from "../../src/types/ad";
import {
  AD_PLACEHOLDER_IMAGE,
  initialWorkshopAds,
} from "../../src/data/adsMockData";

const statusMeta: Record<
  AdStatus,
  { label: string; bg: string; fg: string; icon: React.ReactNode }
> = {
  active: {
    label: "نشط",
    bg: "#D1FAE5",
    fg: "#10B981",
    icon: <CheckCircle2 size={12} color="#10B981" />,
  },
  scheduled: {
    label: "مجدول",
    bg: "#FEF3C7",
    fg: "#F59E0B",
    icon: <Clock size={12} color="#F59E0B" />,
  },
  expired: {
    label: "منتهي",
    bg: "#F3F4F6",
    fg: "#4B5563",
    icon: <XCircle size={12} color="#4B5563" />,
  },
};

type Filter = "الكل" | "نشط" | "مجدول" | "منتهي";
const filters: Filter[] = ["الكل", "نشط", "مجدول", "منتهي"];
const filterToStatus: Record<Exclude<Filter, "الكل">, AdStatus> = {
  نشط: "active",
  مجدول: "scheduled",
  منتهي: "expired",
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function genId(): string {
  return `ad-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function WorkshopAdsScreen() {
  const router = useRouter();
  const { wallet, deductBalance } = useWallet();
  const { session } = useAuth();
  const ownerUid = session?.uid;

  const [ads, setAds] = useState<Ad[]>(initialWorkshopAds);
  const [filter, setFilter] = useState<Filter>("الكل");
  const [createOpen, setCreateOpen] = useState(false);

  // Load ads from Firestore. Fallback to mock seed on empty / failure.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ownerUid) return; // no session → keep mock seed
      try {
        const remote = await listAdsByOwner("workshop", ownerUid);
        if (cancelled) return;
        if (remote.length > 0) setAds(remote);
      } catch {
        // Firestore unreachable — keep mock seed.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ownerUid]);

  const visible = useMemo(() => {
    if (filter === "الكل") return ads;
    return ads.filter((a) => a.status === filterToStatus[filter]);
  }, [ads, filter]);

  const activeCount = ads.filter((a) => a.status === "active").length;

  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);

  const addAd = async (newAd: Ad) => {
    // Optimistic insert so the UI updates immediately, even when Firestore is offline.
    setAds((prev) => [newAd, ...prev]);
    if (!ownerUid) return;
    try {
      const saved = await createAd({ ...newAd, ownerUid });
      // Replace the optimistic item with the Firestore-backed one (real id).
      setAds((prev) => prev.map((a) => (a.id === newAd.id ? saved : a)));
    } catch {
      // Firestore unreachable — keep the optimistic local ad.
    }
  };

  const promote = (ad: Ad) => {
    if (ad.isPaid) {
      Alert.alert("تم الترويج مسبقاً", "هذا الإعلان مُروَّج بالفعل.");
      return;
    }
    const amount = ad.isFeatured ? AD_PRICE_FEATURED : AD_PRICE_NORMAL;
    Alert.alert(
      "تأكيد الترويج",
      `سيتم خصم ${formatNumber(amount)} ${wallet.currency} من المحفظة.`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "تأكيد",
          onPress: () => {
            const res = deductBalance(amount, `ترويج إعلان: ${ad.title}`);
            if (!res.ok) {
              Alert.alert("الرصيد غير كافٍ", res.reason);
              return;
            }
            setAds((prev) =>
              prev.map((a) =>
                a.id === ad.id
                  ? { ...a, isPaid: true, promotionPrice: amount }
                  : a
              )
            );
            // Best-effort Firestore sync; failure does not roll back wallet.
            updateAd(ad.id, { isPaid: true, promotionPrice: amount }).catch(
              () => {}
            );
            Alert.alert("تم الترويج", "تم ترويج الإعلان بنجاح.");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          testID="ads-back"
          onPress={() => router.back()}
          style={styles.back}
        >
          <ChevronRight size={22} color={colors.textMain} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>الإعلانات</Text>
          <Text style={styles.sub}>
            {ads.length} إعلان · {activeCount} نشط
          </Text>
        </View>
        <TouchableOpacity
          testID="ads-create-btn"
          style={styles.addBtn}
          onPress={openCreate}
        >
          <Plus size={16} color="#fff" />
          <Text style={styles.addTxt}>جديد</Text>
        </TouchableOpacity>
      </View>

      {/* Wallet strip */}
      <View style={styles.walletStrip}>
        <View style={styles.walletIconWrap}>
          <WalletIcon size={16} color={colors.accent} />
        </View>
        <Text style={styles.walletLabel}>رصيد المحفظة</Text>
        <Text style={styles.walletAmount}>
          {formatNumber(wallet.balance)} {wallet.currency}
        </Text>
      </View>

      <FilterTabs tabs={filters} active={filter} onChange={setFilter} />

      <FlatList
        data={visible}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <EmptyState
            icon={<Megaphone size={40} color={colors.textLight} />}
            title={
              filter === "الكل"
                ? "لا توجد إعلانات بعد"
                : `لا توجد إعلانات ${filter}`
            }
            description="أنشئ إعلانك الأول وروّج لخدمات ورشتك لجذب المزيد من العملاء"
            actionLabel="+ إنشاء إعلان"
            onAction={openCreate}
            testID="empty-ads"
          />
        }
        renderItem={({ item }) => (
          <AdCard ad={item} currency={wallet.currency} onPromote={promote} />
        )}
      />

      <CreateAdModal
        visible={createOpen}
        onClose={closeCreate}
        onCreate={addAd}
      />
    </SafeAreaView>
  );
}

function AdCard({
  ad,
  currency,
  onPromote,
}: {
  ad: Ad;
  currency: string;
  onPromote: (ad: Ad) => void;
}) {
  const meta = statusMeta[ad.status];
  const price = ad.isFeatured ? AD_PRICE_FEATURED : AD_PRICE_NORMAL;
  return (
    <View style={styles.card} testID={`ad-${ad.id}`}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: ad.imageUrl }} style={styles.image} />
        {ad.isFeatured ? (
          <View style={styles.featuredTag}>
            <Star size={10} color="#fff" fill="#fff" />
            <Text style={styles.featuredTxt}>مميز</Text>
          </View>
        ) : null}
        <View style={[styles.statusTag, { backgroundColor: meta.bg }]}>
          {meta.icon}
          <Text style={[styles.statusTxt, { color: meta.fg }]}>
            {meta.label}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.adTitle} numberOfLines={1}>
          {ad.title}
        </Text>
        <Text style={styles.adDesc} numberOfLines={2}>
          {ad.description}
        </Text>

        <View style={styles.dateRow}>
          <Calendar size={11} color={colors.textMuted} />
          <Text style={styles.dateTxt}>
            {ad.startDate} → {ad.endDate}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <View style={styles.priceLeft}>
            <Tag size={12} color={colors.accent} />
            <Text style={styles.priceTxt}>
              {formatNumber(price)} {currency}
            </Text>
          </View>
          {ad.isPaid ? (
            <View style={styles.paidTag}>
              <CheckCircle2 size={11} color={colors.success} />
              <Text style={styles.paidTxt}>مُروَّج</Text>
            </View>
          ) : (
            <View style={styles.unpaidTag}>
              <Text style={styles.unpaidTxt}>غير مُروَّج</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          testID={`promote-${ad.id}`}
          style={[styles.promoteBtn, ad.isPaid && styles.promoteBtnDisabled]}
          onPress={() => onPromote(ad)}
          disabled={ad.isPaid}
        >
          <TrendingUp size={14} color="#fff" />
          <Text style={styles.promoteTxt}>
            {ad.isPaid ? "تم الترويج" : "ترويج الإعلان"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CreateAdModal({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (ad: Ad) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const reset = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setIsFeatured(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("بيانات ناقصة", "يرجى إدخال عنوان الإعلان.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("بيانات ناقصة", "يرجى إدخال وصف الإعلان.");
      return;
    }
    if (!startDate.trim() || !endDate.trim()) {
      Alert.alert("بيانات ناقصة", "يرجى إدخال تاريخ البداية والنهاية.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    let status: AdStatus = "active";
    if (startDate > today) status = "scheduled";
    else if (endDate < today) status = "expired";

    const newAd: Ad = {
      id: genId(),
      title: title.trim(),
      description: description.trim(),
      imageUrl: AD_PLACEHOLDER_IMAGE,
      advertiserType: "workshop",
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      isFeatured,
      status,
      promotionPrice: isFeatured ? AD_PRICE_FEATURED : AD_PRICE_NORMAL,
      isPaid: false,
    };

    onCreate(newAd);
    reset();
    onClose();
    Alert.alert(
      "تم إنشاء الإعلان",
      "يمكنك الآن ترويج الإعلان من القائمة."
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              testID="ads-create-close"
              onPress={handleClose}
              style={styles.modalClose}
            >
              <X size={20} color={colors.textMain} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>إنشاء إعلان جديد</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.modalBody}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.previewImgWrap}>
              <Image
                source={{ uri: AD_PLACEHOLDER_IMAGE }}
                style={styles.previewImg}
              />
              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeTxt}>صورة افتراضية</Text>
              </View>
            </View>

            <Field
              label="العنوان"
              icon={<Megaphone size={16} color={colors.textLight} />}
              value={title}
              onChangeText={setTitle}
              placeholder="مثال: عرض الصيانة الشامل"
              testID="ads-field-title"
            />

            <Field
              label="وصف مختصر"
              icon={<FileText size={16} color={colors.textLight} />}
              value={description}
              onChangeText={setDescription}
              placeholder="وصف قصير للإعلان..."
              multiline
              testID="ads-field-desc"
            />

            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Field
                  label="تاريخ البداية"
                  icon={<Calendar size={16} color={colors.textLight} />}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="2026-03-01"
                  testID="ads-field-start"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Field
                  label="تاريخ النهاية"
                  icon={<Calendar size={16} color={colors.textLight} />}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="2026-03-15"
                  testID="ads-field-end"
                />
              </View>
            </View>

            <View style={styles.featuredRow}>
              <View style={styles.featuredLeft}>
                <Star size={16} color={colors.warning} />
                <View>
                  <Text style={styles.featuredLabel}>إعلان مميز</Text>
                  <Text style={styles.featuredHint}>
                    {isFeatured
                      ? `${formatNumber(AD_PRICE_FEATURED)} ر.س عند الترويج`
                      : `${formatNumber(AD_PRICE_NORMAL)} ر.س عند الترويج`}
                  </Text>
                </View>
              </View>
              <Switch
                testID="ads-field-featured"
                value={isFeatured}
                onValueChange={setIsFeatured}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#fff"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              testID="ads-create-save"
              style={styles.saveBtn}
              onPress={handleSave}
            >
              <Save size={16} color="#fff" />
              <Text style={styles.saveTxt}>حفظ الإعلان</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, icon, testID, multiline, ...rest }: any) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.inputWrapMulti]}>
        {icon}
        <TextInput
          testID={testID}
          {...rest}
          multiline={multiline}
          placeholderTextColor={colors.textLight}
          style={[
            styles.input,
            multiline && { minHeight: 70, paddingVertical: spacing.sm },
          ]}
        />
      </View>
    </View>
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
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    height: 36,
    borderRadius: radius.md,
  },
  addTxt: { color: "#fff", fontSize: 12, fontWeight: "800" },

  walletStrip: {
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
  walletLabel: { flex: 1, fontSize: 12, color: colors.textMuted, fontWeight: "700", textAlign: "right" },
  walletAmount: { fontSize: 13, color: colors.accent, fontWeight: "800" },

  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, paddingTop: spacing.sm },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  imageWrap: { height: 140, position: "relative", backgroundColor: colors.surfaceAlt },
  image: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  featuredTag: {
    position: "absolute",
    top: spacing.sm,
    insetInlineStart: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  featuredTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
  statusTag: {
    position: "absolute",
    top: spacing.sm,
    insetInlineEnd: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusTxt: { fontSize: 10, fontWeight: "800" },

  body: { padding: spacing.md, gap: 6 },
  adTitle: { fontSize: 14, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  adDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 18, textAlign: "right" },

  dateRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  dateTxt: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceTxt: { fontSize: 12, color: colors.accent, fontWeight: "800" },
  paidTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  paidTxt: { fontSize: 10, color: colors.success, fontWeight: "800" },
  unpaidTag: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unpaidTxt: { fontSize: 10, color: colors.textMuted, fontWeight: "800" },

  promoteBtn: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primary,
    height: 40,
    borderRadius: radius.md,
  },
  promoteBtnDisabled: { backgroundColor: colors.textLight },
  promoteTxt: { color: "#fff", fontSize: 13, fontWeight: "800" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: "92%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: { ...typography.h3, textAlign: "center", flex: 1 },
  modalBody: { padding: spacing.lg, paddingBottom: spacing.xl },

  previewImgWrap: {
    height: 140,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceAlt,
  },
  previewImg: { width: "100%", height: "100%" },
  previewBadge: {
    position: "absolute",
    bottom: spacing.sm,
    insetInlineStart: spacing.sm,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  previewBadgeTxt: { color: "#fff", fontSize: 10, fontWeight: "700" },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMain,
    marginBottom: 6,
    textAlign: "right",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWrapMulti: { height: "auto", alignItems: "flex-start", paddingVertical: spacing.sm },
  input: { flex: 1, fontSize: 13, color: colors.textMain, textAlign: "right", paddingVertical: 0 },

  featuredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
  },
  featuredLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 },
  featuredLabel: { fontSize: 13, fontWeight: "800", color: colors.textMain, textAlign: "right" },
  featuredHint: { fontSize: 11, color: colors.textMuted, textAlign: "right", marginTop: 2 },

  modalFooter: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: radius.md,
  },
  saveTxt: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
