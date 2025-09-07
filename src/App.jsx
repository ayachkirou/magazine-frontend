import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RecentArticles from "./components/RecentArticle.jsx";
import AllArticles from "./pages/AllArticles.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ArticleDetail from "./pages/ArticleDetails.jsx";
import OpportunitiDetails from "./pages/OpportunitiDetails.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx"; // <- import PrivateRoute
import './App.css';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Profile from "./pages/Profile.jsx"
import SearchResults from "./pages/SearchResults.jsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Routes protégées */}
            <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route path="/search" element={<SearchResults />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/home" element={<RecentArticles />} />
              <Route path="/all-articles" element={<AllArticles />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/opportunites/:id" element={<OpportunitiDetails />} />
            </Route>

            <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route path="/admin/dashboard" element={
                 <ProtectedRoute requiredRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
                } />
            </Route>

            {/* Redirection par défaut vers login si URL invalide */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
