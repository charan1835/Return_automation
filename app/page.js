import ReturnForm from "./_components/Returnform";
import Header from "./_components/Header";
import "./globals.css";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4">
        <ReturnForm />
      </main>
    </div>
  );
}
