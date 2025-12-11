import ReturnForm from "./_components/Returnform";
import Header from "./_components/Header";
import "./globals.css";

export default function Page() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Header />
      <main className="relative z-10 p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <ReturnForm />
      </main>
    </div>
  );
}
