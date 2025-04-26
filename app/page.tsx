import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function Home() {
  const cardData = [
    {
      emoji: "🏔️",
      title: "Snowpark",
      description: "rails, jumps & a homemade rope tow",
    },
    {
      emoji: "🛏️",
      title: "Hostel",
      description: "cozy rooms for snowboarders & travelers",
    },
    {
      emoji: "🧑‍🤝‍🧑",
      title: "Volunteering",
      description: "work, ride, and be part of the crew",
    },
    {
      emoji: "💻",
      title: "Remote Friendly",
      description: "fast internet & chill work spaces",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Hero */}
      <section className="relative h-screen bg-cover bg-center bg-[url('/images/hero.jpg')]">
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Snowboarding. Community. Patagonia.
          </h1>
          <p className="mt-4 text-lg max-w-xl">
            A hostel-meets-snowpark experience for riders, volunteers, and
            travelers from around the world.
          </p>
          <div className="mt-6 space-x-4">
            <a
              href="/booking"
              className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Book Now
            </a>
            <a
              href="/volunteer"
              className="px-6 py-3 bg-transparent border border-white font-semibold rounded-xl hover:bg-white hover:text-black transition"
            >
              Join Us
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">What is Hostel Snowpark?</h2>
        <p className="text-lg text-gray-600">
          We’re building more than a place to sleep. This is a space where
          snowboarders, travelers, and volunteers live, ride, and create
          community together in Patagonia.
        </p>
      </section>

      {/* Highlights */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {cardData.map((card) => (
            <Card
              key={card.title}
              title={card.title}
              description={card.description}
              emoji={card.emoji}
            />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to ride with us?</h2>
        <div className="space-x-4">
          <a
            href="/booking"
            className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition"
          >
            Book Now
          </a>
          <a
            href="/volunteer"
            className="px-6 py-3 border border-black font-semibold rounded-xl hover:bg-black hover:text-white transition"
          >
            Join Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Hostel Snowpark — All rights reserved
        </p>
        <p className="mt-2">
          <a
            href="https://github.com/perassijulian/hostel-snowpark"
            target="_blank"
            className="underline hover:text-gray-300"
          >
            Julian Perassi
          </a>
        </p>
      </footer>
    </main>
  );
}
