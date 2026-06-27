# SquidHack 2026 - Finalist Portal & Landing Page

A premium, responsive, and modern React + Vite application for **SquidHack 2026** inspired by the Squid Game aesthetic. This project includes the hackathon landing page, a multi-step finalist registration portal, and an embedded administrative dashboard.

---

## 🚀 Features

### 🎮 Player Portal (Finalist Registration Form)
- **Multi-Step Stepper**: Visually guides players across 5 stages: Team Info ➔ Member Details ➔ Project Info ➔ Payment Details ➔ Review & Agreement.
- **Dynamic Field Generation**: Automatically adjusts team member input forms (supporting 1 to 4 members) based on selection.
- **Draft Auto-Save**: Keeps input values persisted to `localStorage` automatically on change, preventing progress loss.
- **Real-Time QR Payments**: Displays a scan-ready UPI QR code preconfigured with the ₹1500 fee.
- **Confetti Celebration**: Fires full-screen canvas-confetti particle explosions on successful registration.

### 👑 Frontman Controls (Admin Dashboard)
- **Secure Toggle**: Easy-to-access Admin view via the website footer.
- **Search & Filtering**: Search through teams instantly and filter by registration/payment status.
- **Interactive Details**: Detailed modal displaying team member details, project descriptions, and uploaded payment screenshots.
- **Registration Management**: Actions to approve or reject teams, verify payment, and view details.
- **Outbox Log**: Displays simulated automated email outbox (verification, approval, rejection emails) to demonstrate communication logs.
- **CSV Data Export**: One-click download of all registration data into a spreadsheet.

---

## 🛠️ Tech Stack
- **Framework**: React 19 (Single Page Application)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (native `@theme` configurations)
- **Routing**: React Router 7 (with route-based lazy-loading and suspense fallbacks)
- **Effects**: Canvas-Confetti

---

## 📁 Project Structure

```bash
src/
├── assets/         # Project styles and images
├── components/     # Reusable UI components (Navbar, Footer, FAQItem, cards, etc.)
├── pages/          # Lazy-loaded views (Home.jsx, Register.jsx)
├── App.jsx         # App router and loader fallback
├── index.css       # Tailwind directives and custom CSS themes
└── main.jsx        # App entry point
```

---

## 💻 Get Started

### Install Dependencies
```bash
npm install
```

### Run Locally (Development Server)
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

