import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronRight, Save, Tag, DollarSign, Package, FileText, Plus, X, Star } from "lucide-react-native";
import { colors, spacing, radius, typography } from "../../src/theme/theme";
import { useAuth } from "../../src/context/AuthContext";
import { getProduct, createProduct, updateProduct } from "../../src/services/companyProducts";

export default function ProductEdit() {
  const router = useRouter();
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editMode = !!id;

  const [formLoading, setFormLoading] = useState(editMode);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    price: "",
    oldPrice: "",
    description: "",
    inStock: true,
  });
  const [images, setImages] = useState<string[]>([]);
  const [coverIdx, setCoverIdx] = useState(0);

  // In edit mode, load the existing product from Firestore.
  useEffect(() => {
    if (!editMode || !id) return;
    (async () => {
      try {
        const product = await getProduct(id);
        if (product) {
          setForm({
            title: product.title,
            brand: product.brand,
            price: String(product.price),
            oldPrice: product.oldPrice ? String(product.oldPrice) : "",
            description: product.description,
            inStock: product.inStock,
          });
          setImages(product.images);
          setCoverIdx(0);
        }
      } catch {
        Alert.alert("خطأ", "تعذّر تحميل بيانات المنتج");
      } finally {
        setFormLoading(false);
      }
    })();
  }, []);

  const addImage = () => {
    const pool = [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600",
      "https://images.unsplash.com/photo-1636613112804-c5aebc1f4d8d?w=600",
      "https://images.unsplash.com/photo-1611633235555-45e252fe48c8?w=600",
      "https://images.unsplash.com/photo-1522598140461-ec9911e01c53?w=600",
    ];
    setImages((imgs) => [...imgs, pool[imgs.length % pool.length]]);
  };
  const removeImage = (i: number) => {
    setImages((imgs) => imgs.filter((_, idx) => idx !== i));
    if (coverIdx === i) setCoverIdx(0);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert("خطأ", "يرجى إدخال اسم المنتج");
      return;
    }
    if (!session?.uid) {
      Alert.alert("خطأ", "غير مسجل الدخول — session.uid is missing");
      return;
    }

    setSaving(true);
    try {
      // Re-order images so the selected cover comes first.
      const orderedImages = [...images];
      if (coverIdx > 0 && orderedImages.length > 1) {
        const [cover] = orderedImages.splice(coverIdx, 1);
        orderedImages.unshift(cover);
      }

      // Build payload — all optional fields have safe defaults so Firestore
      // never receives undefined values.
      const payload = {
        title: form.title.trim() || "",
        brand: form.brand.trim() || "",
        price: Number(form.price) || 0,
        ...(form.oldPrice ? { oldPrice: Number(form.oldPrice) } : {}),
        description: form.description.trim() || "",
        inStock: form.inStock === true,
        active: true,
        images: Array.isArray(orderedImages) ? orderedImages : [],
        rating: 0,
        reviews: 0,
        specs: [] as { label: string; value: string }[],
      };

      console.log("[product-edit] handleSave —", editMode ? "UPDATE" : "CREATE");
      console.log("[product-edit] session.uid:", session.uid);
      console.log("[product-edit] editMode:", editMode, "| id:", id);
      console.log("[product-edit] payload:", JSON.stringify(payload, null, 2));

      if (editMode && id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(session.uid, payload);
      }

      router.back();
    } catch (err: any) {
      console.error("[product-edit] save FAILED:", err);
      const code: string = err?.code ?? "unknown";
      const msg: string = err?.message ?? "unknown error";

      // Surface the exact Firebase error so the developer can act on it.
      if (code === "permission-denied") {
        Alert.alert(
          "خطأ: صلاحيات Firestore",
          "permission-denied — يرجى تحديث قواعد Firestore في لوحة تحكم Firebase للسماح بالكتابة على مجموعة companyProducts.\n\nCode: " + code
        );
      } else {
        Alert.alert(
          "خطأ في الحفظ",
          `تعذّر حفظ المنتج.\n\nCode: ${code}\nMessage: ${msg}`
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (formLoading) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: "center", justifyContent: "center" }]} edges={["top", "bottom"]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity testID="pe-back" onPress={() => router.back()} style={styles.back}>
            <ChevronRight size={22} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.title}>{editMode ? "تعديل المنتج" : "إضافة منتج جديد"}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Field
            label="اسم المنتج"
            icon={<Package size={18} color={colors.textLight} />}
            value={form.title}
            onChangeText={(t: string) => setForm({ ...form, title: t })}
            placeholder="مثال: زيت محرك شل هيلكس 5W-30"
            testID="pe-title"
          />
          <Field
            label="العلامة التجارية"
            icon={<Tag size={18} color={colors.textLight} />}
            value={form.brand}
            onChangeText={(t: string) => setForm({ ...form, brand: t })}
            placeholder="Shell"
            testID="pe-brand"
          />
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <Field
                label="السعر (ر.س)"
                icon={<DollarSign size={18} color={colors.textLight} />}
                value={form.price}
                onChangeText={(t: string) => setForm({ ...form, price: t })}
                placeholder="175"
                keyboardType="numeric"
                testID="pe-price"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="السعر القديم"
                icon={<DollarSign size={18} color={colors.textLight} />}
                value={form.oldPrice}
                onChangeText={(t: string) => setForm({ ...form, oldPrice: t })}
                placeholder="210"
                keyboardType="numeric"
                testID="pe-oldprice"
              />
            </View>
          </View>

          <Field
            label="الوصف"
            icon={<FileText size={18} color={colors.textLight} />}
            value={form.description}
            onChangeText={(t: string) => setForm({ ...form, description: t })}
            placeholder="وصف المنتج..."
            multiline
            testID="pe-desc"
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>متوفر في المخزون</Text>
              <Text style={styles.switchSub}>يمكن للعملاء طلب المنتج</Text>
            </View>
            <Switch
              testID="pe-stock-switch"
              value={form.inStock}
              onValueChange={(v) => setForm({ ...form, inStock: v })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.imagesBox}>
            <View style={styles.imagesHead}>
              <Text style={styles.imagesTitle}>صور المنتج</Text>
              <Text style={styles.imagesCount}>{images.length}/8</Text>
            </View>
            {images.length === 0 ? (
              <View style={styles.imagesEmpty}>
                <Text style={styles.imagesEmptyTxt}>لم يتم رفع صور بعد</Text>
                <TouchableOpacity testID="pe-upload-btn" style={styles.uploadBtn} onPress={addImage}>
                  <Plus size={14} color={colors.accent} />
                  <Text style={styles.uploadTxt}>رفع صورة</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: 4 }}>
                {images.map((uri, i) => (
                  <View key={`${uri}-${i}`} style={styles.imgCell}>
                    <Image source={{ uri }} style={styles.imgThumb} />
                    {coverIdx === i && (
                      <View style={styles.coverBadge}>
                        <Star size={9} color="#fff" fill="#fff" />
                        <Text style={styles.coverBadgeTxt}>الرئيسية</Text>
                      </View>
                    )}
                    <TouchableOpacity testID={`remove-img-${i}`} style={styles.removeBtn} onPress={() => removeImage(i)}>
                      <X size={12} color="#fff" />
                    </TouchableOpacity>
                    {coverIdx !== i && (
                      <TouchableOpacity testID={`set-cover-${i}`} style={styles.setCoverBtn} onPress={() => setCoverIdx(i)}>
                        <Text style={styles.setCoverTxt}>تعيين رئيسية</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {images.length < 8 && (
                  <TouchableOpacity testID="pe-add-img" style={styles.addImgCell} onPress={addImage}>
                    <Plus size={22} color={colors.textMuted} />
                    <Text style={styles.addImgTxt}>إضافة</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <TouchableOpacity
            testID="pe-save-btn"
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Save size={18} color="#fff" />
            )}
            <Text style={styles.saveTxt}>{editMode ? "حفظ التعديلات" : "إضافة المنتج"}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, icon, testID, multiline, ...rest }: any) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.inputWrapMulti]}>
        {icon}
        <TextInput
          testID={testID}
          {...rest}
          multiline={multiline}
          placeholderTextColor={colors.textLight}
          style={[styles.input, multiline && { minHeight: 80, paddingVertical: spacing.sm }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h2 },
  scroll: { padding: spacing.lg, paddingBottom: 120 },
  label: { fontSize: 13, fontWeight: "600", color: colors.textMain, marginBottom: 6, textAlign: "right" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 52, borderWidth: 1, borderColor: colors.border },
  inputWrapMulti: { height: "auto", alignItems: "flex-start", paddingVertical: spacing.sm },
  input: { flex: 1, fontSize: 14, color: colors.textMain, textAlign: "right", paddingVertical: 0 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  switchLabel: { fontSize: 14, fontWeight: "700", color: colors.textMain, textAlign: "right" },
  switchSub: { fontSize: 12, color: colors.textMuted, marginTop: 2, textAlign: "right" },
  imagesBox: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  imagesHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  imagesTitle: { ...typography.h3, textAlign: "right" },
  imagesCount: { fontSize: 12, color: colors.textMuted, fontWeight: "700" },
  imagesEmpty: { borderWidth: 1.5, borderStyle: "dashed", borderColor: colors.border, borderRadius: radius.md, padding: spacing.xl, alignItems: "center", gap: spacing.md },
  imagesEmptyTxt: { color: colors.textMuted, fontSize: 12 },
  uploadBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.accentSoft, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.md },
  uploadTxt: { color: colors.accent, fontSize: 13, fontWeight: "700" },
  imgCell: { width: 110, height: 110, borderRadius: radius.md, overflow: "hidden", backgroundColor: colors.surfaceAlt, marginEnd: spacing.sm, position: "relative" },
  imgThumb: { width: "100%", height: "100%" },
  coverBadge: { position: "absolute", top: 4, insetInlineStart: 4, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: colors.accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },
  coverBadgeTxt: { color: "#fff", fontSize: 9, fontWeight: "800" },
  removeBtn: { position: "absolute", top: 4, insetInlineEnd: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: "rgba(0,0,0,0.65)", alignItems: "center", justifyContent: "center" },
  setCoverBtn: { position: "absolute", bottom: 4, insetInlineStart: 4, insetInlineEnd: 4, backgroundColor: "rgba(0,0,0,0.6)", paddingVertical: 3, borderRadius: radius.sm, alignItems: "center" },
  setCoverTxt: { color: "#fff", fontSize: 10, fontWeight: "700" },
  addImgCell: { width: 110, height: 110, borderRadius: radius.md, borderWidth: 1.5, borderStyle: "dashed", borderColor: colors.borderStrong, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center", gap: 4, marginEnd: spacing.sm },
  addImgTxt: { fontSize: 11, color: colors.textMuted, fontWeight: "700" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, padding: spacing.lg },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primary, height: 52, borderRadius: radius.md },
  saveTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
