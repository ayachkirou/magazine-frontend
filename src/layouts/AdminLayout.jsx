import { Outlet } from "react-router-dom";
// Si tu veux une navbar spéciale admin : import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <AdminNavbar />  tu pourras l’ajouter plus tard si besoin */}
      <main className="flex-grow">
        <Outlet /> {/* ici s'affichent les pages admin */}
      </main>
    </div>
  );
}
