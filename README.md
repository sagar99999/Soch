# Soch Band – Official Website

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

A modern, full-stack web application for the Pakistani rock band **Soch**. Built with React 19, TypeScript, Vite, and Firebase, it serves as a dynamic hub for fans to explore tour dates, music, media, and band information, while providing an intuitive admin dashboard for content management.

**Live Demo:** [soch-tau.vercel.app](https://soch-tau.vercel.app)

---

## ✨ Key Features

### For Fans (Public-Facing)

- **Hero Section & Navigation** – An immersive hero section with cinematic background, smooth animations using **Framer Motion**, and a mobile‑friendly responsive navigation bar.
- **Tour Dates & Events** – Upcoming concerts displayed with city, venue, date, and ticket links, dynamically loaded from Firestore.
- **Gallery & Media** – A responsive carousel gallery showcasing band images, powered by Firestore real‑time updates.
- **Music & Streaming** – A dedicated music page with embedded Spotify and YouTube links, plus a "Sonic Archive" section for audio/video content.
- **Band Members** – Profiles of each band member with roles, instruments, and bios, fetched dynamically.
- **Contact Form** – A fan message submission form that stores messages directly to Firestore, with real‑time success feedback.

### For Admin (Content Management)

- **Google Authentication** – Secure sign‑in using Firebase Auth with Google Provider; only the designated admin email can access the dashboard.
- **Comprehensive Admin Dashboard** – Manage all content types from one place:
  - **Events** – Add, edit, or delete upcoming concerts.
  - **Gallery** – Upload and manage images with captions.
  - **Merchandise** – Manage product listings, pricing, and stock.
  - **Fan Messages** – View all submitted messages, sorted by date.
  - **Band Members** – Reorder and edit member profiles (names, roles, instruments, bios, images).
- **Real‑Time Updates** – All changes on the admin panel reflect instantly on the frontend without page reloads (powered by Firestore’s `onSnapshot` listeners).

### Technical Highlights

- **Real‑time Data Sync** – Firestore listeners provide live updates for all content sections (events, gallery, members, messages, merchandise).
- **Modular & Type‑Safe** – The entire codebase is written in TypeScript, with reusable components, custom hooks, and well‑typed interfaces.
- **Responsive & Animated UI** – Tailwind CSS for utility‑first styling, plus Framer Motion for smooth page transitions and micro‑interactions.
- **SEO Optimized** – Dynamic page titles and Open Graph meta tags for each route (Home, Music, Admin).
- **Environment Ready** – Uses `.env.local` to store the Gemini API key for future AI integrations (e.g., automated event descriptions or content summaries).

---

## 🛠️ Tech Stack

| Category         | Technologies                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**     | React 19, TypeScript, Vite, React Router DOM                                                                                                    |
| **Styling**      | Tailwind CSS 4, `clsx` + `tailwind-merge` for conditional classes, **Framer Motion** for animations                                            |
| **Backend (BaaS)** | **Firebase** – Authentication (Google Provider), Firestore (NoSQL database), Firebase Applet config                                           |
| **Utilities**    | `date-fns` (date formatting), `lucide-react` (icons), `dotenv` (environment variables)                                                          |
| **AI Potential** | `@google/genai` installed – ready for Gemini API integration (automated content generation or fan Q&A)                                         |
| **Deployment**   | Vercel (live demo)                                                                                                                               |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm (or yarn/pnpm)
- A Firebase project with Authentication (Google provider enabled) and Firestore database
- A Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sagar99999/Soch.git
   cd Soch
