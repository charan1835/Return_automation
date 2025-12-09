import ReturnForm from "./_components/Returnform";
import Header from "./_components/Header";
import "./globals.css";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="p-4 md:p-8">
        <ReturnForm />
      </main>
    </div>
  );
}
