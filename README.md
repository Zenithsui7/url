# ☁️ Tun Sahur — Instant File Sharing

A beautiful iOS 26 Liquid Glass UI file-sharing app built with **React + Tailwind CSS + Firebase**.

Upload any file and instantly receive a **shareable link** and **QR code**.

---

## 🚀 Quick Setup (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → enter a name → Continue
3. Disable Google Analytics (optional) → **Create project**

### 3. Enable Firebase Storage
1. In the Firebase console, go to **Storage** → **Get started**
2. Click **Start in test mode** → **Next** → choose a region → **Done**
3. Update storage rules (under Rules tab):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### 4. Enable Firestore
1. Go to **Firestore Database** → **Create database**
2. Select **Start in test mode** → **Next** → choose region → **Enable**
3. Update Firestore rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /files/{docId} {
      allow read, write: if true;
    }
  }
}
```

### 5. Get your Firebase config
1. Go to **Project Settings** (gear icon) → **Your apps** → **Web app** (</> icon)
2. Register app with any nickname → **Register app**
3. Copy the `firebaseConfig` object

### 6. Add your config to the app
Open `src/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "YOUR_ACTUAL_API_KEY",
  authDomain:        "your-project-id.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdefgh",
};
```

### 7. Run the app
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 🌐 Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting (select your project)
firebase init hosting
# → Use existing project → your-project-id
# → Public directory: dist
# → Single-page app: Yes
# → Overwrite index.html: No

# Build
npm run build

# Deploy
firebase deploy
```

Your app is now live at `https://your-project-id.web.app` 🚀

---

## 📂 Project Structure

```
tun-sahur/
├── src/
│   ├── components/
│   │   ├── DropZone.jsx      — Drag & drop upload with progress
│   │   ├── FilePreview.jsx   — Smart preview (image/video/audio/pdf)
│   │   ├── NavBar.jsx        — Glass navigation bar
│   │   ├── QRCodeDisplay.jsx — QR code generator + download
│   │   └── Toast.jsx         — Notification toasts
│   ├── context/
│   │   ├── ThemeContext.jsx   — Dark/light mode toggle
│   │   └── ToastContext.jsx   — App-wide toast notifications
│   ├── pages/
│   │   ├── Home.jsx          — Upload page
│   │   ├── FilePage.jsx      — Shareable file view page
│   │   └── Gallery.jsx       — Upload history
│   ├── firebase.js           — Firebase configuration ← EDIT THIS
│   ├── App.jsx               — Router & providers
│   ├── main.jsx              — Entry point
│   └── index.css             — Global styles + glass effects
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── firebase.json             — Firebase hosting config
```

---

## ✨ Features

- 🔥 **Drag & drop** or tap to upload any file type
- 🔗 **Shareable link** generated instantly after upload
- 📱 **QR code** downloadable as PNG
- 🖼️ **Smart previews** — images, videos, audio, PDFs, and more
- 🌗 **Dark / light mode** toggle
- 📚 **Gallery** — browsable upload history (localStorage)
- 🍎 **iOS 26 Liquid Glass** UI — frosted glass, gradients, spring animations
- 📲 **Fully responsive** — native iOS feel on mobile

---

## 🛡️ Security Note

The test-mode Firebase rules above allow public read/write — suitable for development. Before going to production, add authentication or restrict access by domain/user.

---

## 🎨 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 18 + Vite               |
| Styling   | Tailwind CSS 3                |
| Animation | CSS animations + keyframes    |
| Storage   | Firebase Storage              |
| Database  | Firebase Firestore            |
| QR Codes  | `qrcode` npm package          |
| Routing   | React Router v6               |
| Hosting   | Firebase Hosting              |
