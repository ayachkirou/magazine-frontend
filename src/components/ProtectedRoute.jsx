import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, userRoles, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // 👈 Ajouté

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                 console.log("[ProtectedRoute] Pas authentifié → redirection login");
                // Rediriger vers login si non authentifié
                navigate('/', {
                    state: { from: location.pathname },
                    replace: true
                });
                return;
            }

            // Vérifier les rôles si requis
            if (requiredRoles.length > 0) {
                const hasRequiredRole = requiredRoles.some(role =>
                    userRoles.includes(role)
                );
                 console.log("[ProtectedRoute] Vérif rôles requis:", requiredRoles, "→ ok ?", hasRequiredRole);

                if (!hasRequiredRole) {
                     console.log("[ProtectedRoute] Pas le rôle → redirection unauthorized");
                    // Rediriger vers page non autorisée
                    navigate('/unauthorized', { replace: true });
                }
            }
        }
    }, [isAuthenticated, userRoles, loading, requiredRoles, navigate, location]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;
