# 🩺 MedicoDocs — Frontend

> **MedicoDocs** is a lightweight, mobile-first personal & family medical document vault with Gemini AI prescription intelligence, ImageKit CDN storage, and Firebase Authentication.

---

## 🚀 Live Demo & Deployment

* **Live Application:** `[Deploying on Vercel...]`
* **Live Backend API:** [https://medico-docs-ab-be.vercel.app](https://medico-docs-ab-be.vercel.app)
* **Backend API Repository:** [https://github.com/abdnimit1203/MedicoDocs-BE](https://github.com/abdnimit1203/MedicoDocs-BE)
* **Frontend Repository:** [https://github.com/abdnimit1203/MedicoDocs-FE](https://github.com/abdnimit1203/MedicoDocs-FE)

---

## 🌟 Key Features

* 📱 **Mobile-First UX:** Sleek, responsive layout with a fixed bottom navigation bar and bottom-right Floating Action Button (FAB).
* 🤖 **Gemini AI Prescription Intelligence:** Automatically extracts doctor details, specialties, clinic locations, prescribed medicines, dosages, frequencies, and clinical notes from uploaded document images.
* 🧪 **Diagnostic Test Report Intelligence:** Specialized Gemini AI extraction for lab test parameters, measured values, reference ranges, and abnormal flags.
* 🛡️ **Review-Before-Save Safety Guarantee:** AI predictions populate local form fields for user review before explicitly saving to MongoDB. No silent autosaving.
* 🔒 **Firebase Authentication:** User-isolated data vault with Google One-Tap Sign-In and Email/Password security.
* ⚡ **ImageKit Cloud CDN:** Optimized cloud image uploads with Base64 fallback handling.
* 🔔 **Interactive Toast System:** Instant feedback for authentication, form validation, record operations, and AI scans using `react-hot-toast`.

---

## 🛠️ Technology Stack

* **Framework:** Next.js 15 (App Router, TypeScript)
* **Styling:** Tailwind CSS (Vanilla CSS design system tokens)
* **Icons:** Lucide React
* **Notifications:** `react-hot-toast`
* **Auth SDK:** Firebase JS SDK v12
* **Storage SDK:** ImageKit JS Client

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root of `MedicoDocs-FE`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev

# 3. Open browser at http://localhost:3000
```

---

## 👤 Developer & Contact Information

* **Developer:** ABD
* **GitHub Profile:** [https://github.com/abdnimit1203](https://github.com/abdnimit1203)
* **Repository:** [https://github.com/abdnimit1203/MedicoDocs-FE](https://github.com/abdnimit1203/MedicoDocs-FE)
