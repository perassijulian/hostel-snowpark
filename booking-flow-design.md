🧭 Booking Flow Design Challenge

Problem: Designing a Flexible, Scalable Booking System

One of the most interesting challenges I faced in this project was architecting a clean booking flow that could support two common user journeys: 1. Search-based flow:
Users start by entering a date and accommodation type (e.g., “dorm”, “cabin”) and then choose from the available options. 2. Detail-based flow:
Users land directly on a specific accommodation detail page (e.g., from SEO, a share link, or internal navigation) and want to book from there.

Both flows are useful, but supporting both without duplicating logic or creating messy conditional code was a design puzzle.

⸻

🧱 Initial Structure

I structured the app with the following pages:
• /accommodation/[id]: Server-rendered detail page
• /booking: Generic availability search
• /booking/[id]: Specific booking page for an accommodation

Each page had a clear purpose — but it quickly became clear that there were overlapping responsibilities, especially around how form data (dates, guests) moved between pages.

⸻

🌀 The Spaghetti Risk

Initially, I considered handling bookings directly from the accommodation detail page. But since it’s server-rendered, I couldn’t use a traditional form post easily without introducing messy state handling or hybrid routing logic. Similarly, the /booking page handled both availability search and booking logic, which started to feel overloaded.

Without careful planning, this risked becoming a tangle of:
• Form state passed between unrelated pages
• Repetitive availability validation logic
• Inconsistent user flows depending on entry point

⸻

✅ The Solution

To balance flexibility and maintainability, I settled on the following architecture:

1. Server-rendered Accommodation Pages (/accommodation/[id])
   • These pages now display full details and include a client-side booking intent form.
   • The form collects dates and guest info and redirects to /booking/[id] with query parameters.

/accommodation/23 → user fills form → redirects to:
/booking/23?checkIn=2025-08-01&checkOut=2025-08-05&guests=2

This keeps the page fast and SEO-friendly while still interactive.

⸻

2. Dedicated Booking Page (/booking/[id])
   • This page confirms the accommodation and query parameters.
   • It displays availability, total price, and lets the user complete the booking.

All booking logic (validation, final confirmation) is centralized here, making it easier to test and maintain.

⸻

3. Availability Search Page (/booking)
   • This page now acts as a discovery layer.
   • Users search by date/type (e.g., “Show me all available cabins next weekend”).
   • Results link to /booking/[id] with appropriate query params.

⸻

📐 Benefits of This Flow
• ✅ Separation of concerns: Booking, searching, and displaying are clearly separated.
• ✅ Scalable: Easy to add filters (e.g., price, amenities) to the discovery flow.
• ✅ User-friendly: Supports multiple entry points without confusion.
• ✅ Minimal duplication: Availability checking is abstracted and reused.

⸻

🤓 Technical Highlights
• useRouter is used to handle client-side redirection from SSR pages.
• Booking data is passed via query params — avoiding complex global state.
• A shared AccommodationSummary component ensures consistent display across pages.
• All dynamic data comes from a Prisma/SQLite backend, but the architecture would easily scale to PostgreSQL or another DB.

⸻

🚀 Reflection

This was a fun architectural problem — not overly complex, but subtle in how easy it would’ve been to create technical debt early on. I learned how to:
• Think in user flows first
• Use Next.js SSR and client components together gracefully
• Refactor early to avoid duplication or unclear logic

This part of the app helped me build confidence in structuring full-stack React apps that are maintainable, scalable, and user-focused.
