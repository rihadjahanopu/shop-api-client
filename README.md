# 🛒 ShopAPI — Modern E-Commerce & REST API Sandbox Frontend

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A state-of-the-art, high-performance E-Commerce frontend and interactive REST API sandbox inspired by JSONPlaceholder. Built with Next.js App Router, React 19, TypeScript, and Tailwind CSS v4 featuring a sleek dark-mode glassmorphism design system.

---

## ✨ Features

- **🎨 Modern Design System**: Ultra-sleek dark UI with vibrant HSL color accents, glassmorphism, dynamic micro-animations, and clean typography.
- **📖 Interactive API Documentation Modal**: Built-in developer sandbox with cURL generators, endpoint testing parameters, sample JSON responses, dynamic Base URL resolution, and **1-click OpenAPI 3.0 (.json) Export** for Postman/Insomnia.
- **📊 Admin Dashboard**: Comprehensive admin control panel featuring key metrics (KPIs), category distribution bar charts, inventory valuation, recent user/product tables, and quick action shortcuts.
- **🛍️ Feature-Rich Product Catalog**: Real-time search, category tab filter, price range slider, sorting options, pagination, and detailed product modal views.
- **🔒 Resilient JWT Authentication**: Authentication context supporting dual **LocalStorage** and **Cookie** persistence so user sessions remain seamlessly active on page refreshes.
- **📝 Owner & Admin Management Modals**: Dedicated interface for managing product listings with inline price/stock editing, active/inactive status toggles, and delete operations.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with AuthProvider & Toast
│   │   ├── page.tsx           # Home page (Catalog, Hero, Modals)
│   │   └── globals.css        # Global CSS & Tailwind utilities
│   ├── components/
│   │   ├── AdminDashboard.tsx # Comprehensive Admin Analytics Modal
│   │   ├── ApiDocsModal.tsx   # Interactive API Sandbox & Spec Exporter
│   │   ├── AuthModal.tsx      # Login & Registration Dialog
│   │   ├── CategoriesModal.tsx# Admin Category Management
│   │   ├── CreateProductModal.tsx # Product Creation Dialog
│   │   ├── ManageProductsModal.tsx# Admin Product Management Table
│   │   ├── MyListingsModal.tsx# User Product Management Interface
│   │   ├── Navbar.tsx         # Main Header with Role-Based Navigation
│   │   ├── ProductDetailModal.tsx # Expanded Product View & Reviews
│   │   └── UsersModal.tsx     # Admin User Management & Role Toggles
│   ├── context/
│   │   └── AuthContext.tsx    # Dual Cookie/LocalStorage Session Context
│   ├── lib/
│   │   └── api.ts             # Type-safe Fetch API client wrapper
│   └── types/
│       └── index.ts           # Centralized TypeScript interface definitions
├── .env.local.example         # Environment variable template
├── next.config.ts             # Next.js configuration
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have Node.js 18+ and npm installed on your machine.

### 2. Installation

Clone the repository and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file by copying the template:

```bash
cp .env.local.example .env.local
```

Configure your backend REST API URL in `.env.local`:

```env
# Local Development
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Production (Vercel Backend URL)
# NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

---

## ☁️ Deployment (Vercel)

1. Push your frontend codebase to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the Root Directory to `frontend`.
4. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed backend URL.
5. Click **Deploy**.

---

## 📄 License

Distributed under the MIT License.
