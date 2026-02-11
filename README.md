# Desi Food Hub 🍛

Welcome to the **Desi Food Hub** repository. This project is structured as a mono-repo containing both the frontend and backend for a full-stack food delivery application.

## 📁 Project Structure

### `/client`
The Frontend application built with **Next.js 14+ (App Router)**.
- **Rendering**: Optimized usage of SSR (Server-Side Rendering) for Search/Restaurant pages and SSG (Static Generation) for Home/City pages.
- **Styling**: Tailored for generic CSS or Tailwind (configurable).
- **State**: Designed for global state management (Redux/Zustand).

### `/server`
The Backend API built with **Node.js & Express**.
- **Database**: MongoDB with Mongoose ODM.
- **Auth**: JWT-based authentication.
- **Architecture**: Controller-Service-Repository pattern for scalability.

## 🚀 Getting Started

Please refer to `ARCHITECTURE.md` for a deep dive into the routing and rendering strategies.

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Next Steps
1. Navigate to `/client` and initialize Next.js: `npx create-next-app@latest .`
2. Navigate to `/server` and initialize Node: `npm init -y`
