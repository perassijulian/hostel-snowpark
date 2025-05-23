# 🏔️ Snowpark Hostel Booking

A full-stack booking system designed for a snowpark-hostel hybrid — built with modern web technologies, focused on maintainability, and structured to support both short-term guests and long-term volunteers.

---

## ✨ Features

- 🔍 **Search & Book** accommodations based on date and guest count
- 📄 **Detail pages** for each accommodation (`/accommodation/[id]`)
- 🛏️ **Flexible booking flow**: from search or direct links
- 🧑‍💻 **Admin panel** for booking management (`/admin`)
- 📅 **Dynamic availability validation** and summaries
- 🧠 **Custom forms** for guests and volunteers
- 🔐 **Authentication** with `NextAuth.js`
- ⚙️ **Middleware-protected routes**
- 🧪 **Test suite** using `Vitest`

---

## 🧱 Project Structure

```txt
.
├── app
│ ├── accommodation # SSR detail pages with booking intent forms
│ ├── admin # Booking filters and admin actions
│ ├── api # API routes (bookings, availability, etc.)
│ ├── booking # Booking logic and search flows
│ ├── contact # Contact form (optional)
│ ├── volunteer # Volunteer sign-up and data collection
│ ├── globals.css # Tailwind styles
│ ├── layout.tsx # App layout
│ └── providers.tsx # Context providers
├── components # Shared UI components (Forms, Cards, etc.)
├── lib # Utilities: DB, Auth, Prisma
├── hooks # Custom React hooks
├── middleware.ts # Auth middleware
├── prisma # Prisma schema and migrations
├── public # Images, favicon
├── test # API tests and setup
├── types # Shared TypeScript types
├── utils # File upload helpers
├── booking-flow-design.md # Architectural breakdown
└── README.md # You’re here!
```

---

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Prisma** + **PostgreSQL** for database
- **NextAuth.js** for authentication
- **Vitest** for testing
- **Zod** for validations
- **Uploadthing** for file handling

---

## 🚀 Getting Started

```bash
git clone https://github.com/yourname/snowpark-booking
cd snowpark-booking
npm install
npm run dev
```

---

## 🧪 Running Tests

```bash
npm run test
```

---

## 📚 Docs & Design

- [booking-flow-design.md](./booking-flow-design.md) — explains the dual-flow challenge and architecture
- [future-steps.md](./future-steps.md) — explains the potential improvements
- /admin — authenticated dashboard for filtering and reviewing bookings
- /middleware.ts — route protection for secure admin access

⸻

## 🔮 Potential Improvements

✅ Already planned and/or in progress:

- 🌐 Form loading UX and syncing with query params
- 📦 Extract form validation into reusable utilities
- 🔁 Toast notifications or modal components to decouple UI feedback
- 📅 Use a real booking calendar UI (react-day-picker)
- 🛡️ Add rate limiting and bot protection on API routes

⸻

## 👤 Author

Made with 💚 by Julian
Let’s connect on LinkedIn or explore more on GitHub
