import Navbar from "../components/Navbar";
import ModernFooter from "../components/ModernFooter";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* ici s'affichent les pages normales */}
      </main>
      <ModernFooter />
    </div>
  );
}
