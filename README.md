# 🍔 CafeteriaQR (CanteenGo)
### *Premium Real-time School Dining & Management Platform*

![Status](https://img.shields.io/badge/Status-Complete-green?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Expo%20|%20Node%20|%20MongoDB%20|%20Supabase-orange?style=for-the-badge)

**CafeteriaQR** is an end-to-end mobile platform designed to eliminate canteen queues and streamline food management in schools and universities. Using a "Fortress" architecture, the platform ensures secure authentication, real-time kitchen notifications, and frictionless digital payments.

---

## 🏗️ The "Fortress" Architecture

Our platform is divided into three distinct human-friendly layers:

### 1. 🥇 The SuperAdmin Master Control
- Global overview of all canteen facilities.
- One-tap canteen launch and admin assignment.
- High-level platform statistics (Revenue, Orders, Canteens).

### 2. 👨‍🍳 The Admin Kitchen Hub
- Real-time order monitoring using **Socket.io**.
- Instant audio alerts (**Custom "Correct Answer" Tone**) for new orders.
- Order lifecycle management (Accept → Mark Ready).
- **Anti-Fraud Guard**: Screenshot hash verification to prevent receipt re-use.

### 3. 🍔 The Student Menu & Checkout
- High-performance, searchable menu with sticky categories.
- Cross-device **Synced Cart** (saved to your account, not just your phone).
- Frictionless checkout: Pickup time selection + "Copy Total" tool.
- Secure, backend-signed screenshot uploads to Cloudinary.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React Native (Expo), NativeWind (Tailwind), Lucide Icons |
| **Backend** | Node.js, Express, Socket.io, Helmet (Security) |
| **Database** | MongoDB (Data Integrity), Supabase (Auth & JWT) |
| **Storage** | Cloudinary (Signed Receipt Uploads) |
| **UX** | Expo-AV (Sound Notifications), Expo-Haptics |

---

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js installed.
- Expo Go app on your physical device.

### 1. Setup the Backend
```bash
cd backend
npm install
# Create a .env file with your MongoDB and Supabase keys
npm start
```

### 2. Setup the Frontend
```bash
cd frontend
npm install
# Create a .env file with your EXPO_PUBLIC keys
npx expo start
```

---

## 🛡️ Security Features
- **JWT Verification**: Every API call is verified against Supabase's authentication engine.
- **Rate Limiting**: Protection against brute-force login attacks (5 OTPs per hour).
- **Signed Storage**: Direct client-to-Cloudinary uploads requested via backend signatures.
- **Anti-Fraud Hashing**: MD5 checksums for every payment receipt submitted.

---

## 🤝 Collaboration
This repository is lightweight. When cloning, always run `npm install` in both the `frontend` and `backend` directories to regenerate dependencies.

**MenuQR Powered**
