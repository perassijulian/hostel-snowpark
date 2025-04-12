🧠 Project Foundations: Key Concepts & Interview-Ready Explanations

✅ Why Next.js?

Next.js is a React-based full-stack framework that simplifies building both the frontend and backend within a single codebase. It supports features like server-side rendering (SSR), static site generation (SSG), and API routes — all built on top of React but with powerful defaults and developer ergonomics.
	•	Routing: Next.js uses file-based routing. Files and folders inside the app/ or pages/ directory automatically become routes.
	•	API Routes: The app/api/ folder (or pages/api/ in older versions) lets you define backend endpoints, removing the need for a separate Express or Node.js server in many cases.
	•	Rendering: You can choose between client components and server components depending on your needs. Next.js automatically optimizes for performance.

💡 Used here because it’s fast for prototyping, has strong defaults, and simplifies deployment of full-stack apps.

⸻

🎨 Why Tailwind CSS?

Tailwind is a utility-first CSS framework, meaning you write your styling directly in the markup using predefined utility classes.
	•	Pros:
	•	Faster styling workflow without context switching between JS and CSS files.
	•	Encourages consistent spacing, font sizes, and colors.
	•	Ideal for rapid prototyping or solo development.
	•	Cons:
	•	Can lead to verbose markup.
	•	Requires a naming or component strategy to maintain visual consistency on larger projects.

💡 Chosen here for speed and simplicity, with the plan to refactor components into reusable UI blocks as the app grows.

⸻

🗂️ Folder Structure & Monorepo Approach
	•	The project is structured as a monorepo with both frontend and backend logic inside the same codebase (Next.js makes this easy).
	•	The app/ directory contains the routing structure and page definitions.
	•	The public/ folder is used for static assets like images and favicons.

💡 This approach reduces complexity for solo dev work and is flexible enough to scale or split later.

⸻

🌍 Deployment & Scalability (Theory for Now)
	•	To deploy, you’d use platforms like Vercel (native to Next.js), Netlify, or traditional hosting.
	•	For dynamic features like bookings or user accounts, you’d:
	•	Connect the backend to a relational database (e.g. PostgreSQL).
	•	Optionally integrate with a CMS via API (e.g. Sanity, Strapi, Contentful).
	•	Secure endpoints and possibly use middleware or authentication providers like NextAuth.

💡 Next.js is deployment-friendly with features like Incremental Static Regeneration and built-in image optimization.

⸻

📁 Static Assets & SEO
	•	Static files (e.g. logos, photos, icons) live in the public/ directory and are served directly.
	•	A favicon was added early on for professionalism, SEO boost, and brand identity.

💡 Focusing on polish and small details even at the early stage shows professionalism.

⸻

🔁 Git & Version Control
	•	Git is used for version control with a linear commit strategy.
	•	Each commit is small, descriptive, and made frequently to capture progress clearly.
	•	Branching isn’t used (yet) since development is solo and sequential. If collaboration or parallel features are introduced, branching will follow best practices.

💡 Keeps the project clean, traceable, and ready to scale if needed.

⸻

🔍 Common Interview Questions This Prepares You For:
	1.	Why did you choose Next.js over plain React?
	2.	How does routing work in your project?
	3.	What are API routes in Next.js, and how are you using them?
	4.	Why Tailwind CSS? What are the trade-offs?
	5.	How would you scale this project if it grew in complexity?
	6.	What’s your deployment plan?
	7.	Where do you store static assets and why?
	8.	How do you manage version control? Why no branches?
	9.	How would you connect your app to a database?
	10.	How would you integrate a CMS if needed?

⸻

