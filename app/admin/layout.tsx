export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
      </header>

      {children}
    </div>
  );
}
