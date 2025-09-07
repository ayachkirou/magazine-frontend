import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // pas de token -> redirection login
  if (!token) {
    console.log("[PrivateRoute] Utilisateur NON connecté → redirect login");
    return <Navigate to="/" replace />;
  }
  console.log("[PrivateRoute] Utilisateur connecté → accès autorisé");
  // sinon -> on rend la page
  return children ? children : <Outlet />;
};

export default PrivateRoute;
