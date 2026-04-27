# ShopSpell 🪄

ShopSpell is a premium, AI-powered e-commerce platform that allows anyone to create a stunning, fully-functional storefront in seconds. Built with a focus on high-end aesthetics, seamless user experience, and modern web technologies.

## ✨ Features

- **Instant Storefronts**: AI-driven store creation and product generation.
- **Advanced Dashboard**: Real-time analytics, dynamic revenue charts, and comprehensive order management.
- **Smart Order Actions**: Accept, reject, or update order statuses (Processing, Shipped, Delivered) with one click.
- **Customer Order Tracking**: A dedicated "My Purchases" section to track orders across the entire ShopSpell network.
- **Direct Buy Experience**: Streamlined checkout flow with secure authentication and instant order confirmation.
- **Modular Architecture**: Clean, feature-based project structure using Next.js App Router and tRPC.
- **Premium UI**: Glassmorphism effects, dynamic micro-animations, and a responsive design system built with Shadcn/UI and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API**: [tRPC](https://trpc.io/) for end-to-end type safety.
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/).
- **Authentication**: [Better-Auth](https://better-auth.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Icons**: [Lucide React](https://lucide.dev/) & [Material Symbols](https://fonts.google.com/icons)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- A PostgreSQL database (e.g., Supabase or local)
- Environment variables configured in `.env` (see `.env.example`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/shop-spell.git
   cd shop-spell
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Push the database schema:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates an optimized production build.
- `npm run lint`: Runs ESLint to check for code quality and formatting.
- `npm run db:push`: Syncs the Drizzle schema with the database.

---
Built with ❤️ by the ShopSpell Team.
