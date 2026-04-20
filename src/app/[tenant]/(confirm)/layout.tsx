export default function ProtectedAuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <main
        className="min-h-screen bg-center bg-no-repeat bg-cover bg-fixed"
        style={{ backgroundImage: "url('/login.webp')" }}
      >
        {children}
      </main>
  );
}
