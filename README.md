# 🚗 جراج ماركت — Car Services Marketplace (Arabic RTL)

تطبيق **React Native / Expo** احترافي لسوق خدمات السيارات وقطع الغيار، بواجهة عربية RTL بالكامل.

---

## 📦 هيكل المشروع الكامل

```
/app
├── backend/                          # (غير مستخدم حالياً - mock data فقط)
│   ├── .env
│   ├── requirements.txt
│   └── server.py
│
└── frontend/
    ├── .env                          # متغيرات البيئة (لا تعدّلها)
    ├── app.json                      # إعدادات Expo
    ├── package.json                  # التبعيات
    ├── tsconfig.json
    ├── metro.config.js
    │
    ├── app/                          # الشاشات (expo-router - file based)
    │   ├── _layout.tsx               # RTL setup + CartProvider + Stack
    │   ├── index.tsx                 # شاشة البداية (Splash)
    │   │
    │   ├── auth/                     # 1) Auth flow (3 شاشات)
    │   │   ├── _layout.tsx
    │   │   ├── login.tsx             # تسجيل الدخول
    │   │   ├── register.tsx          # إنشاء حساب
    │   │   └── forgot.tsx            # نسيت كلمة المرور
    │   │
    │   ├── (tabs)/                   # Bottom tabs (5 شاشات)
    │   │   ├── _layout.tsx           # Tab bar + badge للسلة
    │   │   ├── home.tsx              # 2) الرئيسية
    │   │   ├── services.tsx          # 6) قائمة الخدمات
    │   │   ├── cart.tsx              # 8) السلة / الطلبات
    │   │   ├── notifications.tsx     # 9) الإشعارات
    │   │   └── profile.tsx           # 10) الملف الشخصي
    │   │
    │   ├── company/[id].tsx          # 3) ملف الشركة
    │   ├── workshop/[id].tsx         # 4) ملف الورشة
    │   ├── product/[id].tsx          # 5) تفاصيل المنتج
    │   └── booking/[id].tsx          # 7) صفحة الحجز
    │
    └── src/                          # كود قابل لإعادة الاستخدام
        ├── theme/
        │   └── theme.ts              # الألوان، المسافات، الخطوط
        │
        ├── components/               # Reusable components
        │   ├── CompanyCard.tsx
        │   ├── WorkshopCard.tsx
        │   ├── ProductCard.tsx
        │   ├── ServiceCard.tsx
        │   └── ScreenHeader.tsx
        │
        ├── context/
        │   └── CartContext.tsx       # إدارة حالة السلة
        │
        └── data/
            └── mockData.ts           # البيانات الوهمية (شركات، ورش، منتجات...)
```

---

## 📄 قائمة الملفات التي تم إنشاؤها

### الشاشات (10 شاشات رئيسية)
| # | الشاشة | المسار |
|---|--------|--------|
| 1 | Login | `app/auth/login.tsx` |
| - | Register | `app/auth/register.tsx` |
| - | Forgot Password | `app/auth/forgot.tsx` |
| 2 | Home | `app/(tabs)/home.tsx` |
| 3 | Company Profile | `app/company/[id].tsx` |
| 4 | Workshop Profile | `app/workshop/[id].tsx` |
| 5 | Product Details | `app/product/[id].tsx` |
| 6 | Services List | `app/(tabs)/services.tsx` |
| 7 | Booking Page | `app/booking/[id].tsx` |
| 8 | Cart / Orders | `app/(tabs)/cart.tsx` |
| 9 | Notifications | `app/(tabs)/notifications.tsx` |
| 10 | User Profile | `app/(tabs)/profile.tsx` |
| + | Splash/Welcome | `app/index.tsx` |

### الـ Layouts والتنقل
- `app/_layout.tsx` — Root layout + RTL forcing + CartProvider
- `app/auth/_layout.tsx` — Auth stack
- `app/(tabs)/_layout.tsx` — Bottom tabs (5 tabs) مع badge السلة

### المكونات القابلة لإعادة الاستخدام (src/components)
- `CompanyCard.tsx` — بطاقة شركة أفقية
- `WorkshopCard.tsx` — بطاقة ورشة (مربعة)
- `ProductCard.tsx` — بطاقة منتج مع زر +
- `ServiceCard.tsx` — سطر خدمة
- `ScreenHeader.tsx` — هيدر مع زر رجوع

### الحالة والبيانات
- `src/context/CartContext.tsx` — Context للسلة (add/remove/update)
- `src/data/mockData.ts` — بيانات وهمية كاملة (3 شركات، 4 ورش، 4 منتجات، 8 خدمات، 6 إشعارات، طلبات، حجوزات)
- `src/theme/theme.ts` — نظام التصميم الموحد

---

## 🎨 نظام التصميم

### الألوان
```ts
primary:     #0A0A0A    // أسود - أزرار رئيسية
accent:      #0066FF    // أزرق - الروابط والتاجات
background:  #F8F9FA    // خلفية التطبيق
surface:     #FFFFFF    // البطاقات
textMain:    #111827    // النص الرئيسي
textMuted:   #4B5563    // النص الثانوي
border:      #E5E7EB    // الحدود
success:     #10B981    error: #EF4444
```

### المسافات (8/12/16/24)
```ts
xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
```

### الخطوط
- أحجام: 24 (h1) / 18 (h2) / 16 (h3) / 14 (body) / 12 (small)
- RTL: `textAlign: "right"` + `paddingStart/marginEnd`

---

## 🚀 كيفية التشغيل محلياً (خطوة بخطوة)

### 1) المتطلبات
- **Node.js 18+** (يُفضل 20)
- **Yarn** أو **npm**
- **Expo Go** على جوالك ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### 2) نسخ المشروع
```bash
# انسخ مجلد frontend إلى جهازك
cp -r /app/frontend ~/car-marketplace
cd ~/car-marketplace
```

### 3) تثبيت التبعيات
```bash
yarn install
# أو
npm install
```

### 4) إنشاء ملف `.env` (في جذر المجلد)
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
```
> ملاحظة: التطبيق حالياً يعمل بـ mock data فقط، لا يحتاج backend.

### 5) تشغيل التطبيق
```bash
npx expo start
```

سيظهر لك:
- **QR code** في الـ terminal
- روابط للتشغيل على iOS / Android / Web

---

## 📱 التشغيل على الجوال عبر Expo Go

### الطريقة 1: QR Code (الأسهل)
1. شغّل: `npx expo start`
2. افتح تطبيق **Expo Go** على جوالك
3. **iOS**: افتح الكاميرا واقرأ QR code
4. **Android**: من داخل Expo Go → "Scan QR code"
5. التطبيق سيفتح مباشرة 🎉

> ⚠️ يجب أن يكون الجوال والكمبيوتر على **نفس شبكة Wi-Fi**

### الطريقة 2: Tunnel (إذا الشبكة لا تعمل)
```bash
npx expo start --tunnel
```
(يتطلب تثبيت ngrok أول مرة — سيطلب منك تلقائياً)

### الطريقة 3: Web preview
```bash
npx expo start --web
```

---

## 📦 كيفية بناء APK للأندرويد

### الطريقة 1: EAS Build (الموصى بها)

#### أ) تثبيت EAS CLI
```bash
npm install -g eas-cli
```

#### ب) تسجيل الدخول (حساب Expo مجاني)
```bash
eas login
```

#### ج) إعداد المشروع
```bash
cd ~/car-marketplace
eas build:configure
```

#### د) بناء APK
```bash
# APK للتثبيت المباشر (ملف .apk)
eas build --platform android --profile preview

# AAB للـ Google Play (ملف .aab)
eas build --platform android --profile production
```

سيأخذ البناء 10-20 دقيقة على خوادم Expo، وعند الانتهاء ستحصل على **رابط تحميل APK**.

#### إعداد `eas.json` (إنشئه في جذر المشروع):
```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "distribution": "internal"
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

### الطريقة 2: بناء محلي (يتطلب Android Studio)
```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
# APK سيكون في: android/app/build/outputs/apk/release/
```

---

## 🍎 بناء iOS (macOS فقط)

```bash
eas build --platform ios --profile preview
```
يتطلب حساب Apple Developer ($99/سنة) للتوزيع.

---

## 🧭 مخطط التنقل (Navigation Flow)

```
index (Splash)
  │
  ├──► auth/login ──► auth/forgot
  │        │
  │        └──► auth/register
  │               │
  └──► (tabs)/    │
       ├── home ◄────────────────┐
       │    ├─► company/[id]     │
       │    ├─► workshop/[id] ──► booking/[id]
       │    └─► product/[id] ───► cart
       │
       ├── services ──► booking/[id]
       ├── cart
       ├── notifications
       └── profile ──► logout ──► index
```

---

## ✅ ميزات مكتملة

- ✅ **RTL عربي كامل** (I18nManager.forceRTL + paddingStart/marginEnd)
- ✅ **10 شاشات** كاملة ومترابطة
- ✅ **5 Reusable Components**
- ✅ **Bottom tabs** مع badge ديناميكي للسلة
- ✅ **نظام سلة تفاعلي** (Context API)
- ✅ **ScrollViews أفقية** بـ `inverted` للـ RTL
- ✅ **data-testid** على جميع العناصر التفاعلية
- ✅ **KeyboardAvoidingView** في شاشات Auth
- ✅ **SafeAreaView** في كل الشاشات
- ✅ **TypeScript** بالكامل
- ✅ **بيانات وهمية عربية** واقعية

---

## 📝 قواعد التسمية المتبعة

| النوع | القاعدة | مثال |
|-------|---------|------|
| الشاشات | kebab-case / camelCase | `login.tsx`, `[id].tsx` |
| المكونات | PascalCase | `WorkshopCard.tsx` |
| الـ Hooks | camelCase + `use` prefix | `useCart()` |
| Types | PascalCase | `Company`, `Workshop` |
| testID | kebab-case | `login-submit-btn` |

---

## 🔮 التطوير المستقبلي (Backend Integration)

عند جاهزية الـ backend، استبدل الاستيرادات من `mockData.ts` بـ API calls:

```ts
// قبل
import { companies } from "../src/data/mockData";

// بعد
const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
const { data: companies } = useQuery(['companies'],
  () => fetch(`${BASE}/api/companies`).then(r => r.json())
);
```

الـ endpoints المقترحة:
- `GET /api/companies`
- `GET /api/workshops`
- `GET /api/products`
- `GET /api/services`
- `POST /api/bookings`
- `POST /api/orders`
- `POST /api/auth/login` & `/register`

---

## 📞 استكشاف الأخطاء الشائعة

| المشكلة | الحل |
|---------|------|
| RTL لا يعمل | أغلق Expo Go وأعد فتحه بعد أول تشغيل |
| "Cannot find module" | `rm -rf node_modules && yarn install` |
| QR code لا يعمل | استخدم `npx expo start --tunnel` |
| خطأ react-native-svg | `yarn add react-native-svg` |

---

**تم بحمد الله 🎉**

المشروع جاهز للتطوير والنشر. استمتع بالبناء!
