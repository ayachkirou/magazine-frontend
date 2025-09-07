// hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        console.log("[useAuth] Token trouvé :", token);
        if (!token) {
            console.log("[useAuth] Aucun token → utilisateur NON authentifié");
            setIsAuthenticated(false);
            setUserRoles([]);
            setLoading(false);
            return;
        }

        // Vérifier si le token est expiré
        if (isTokenExpired(token)) {
            console.log("[useAuth] Token expiré → déconnexion");
            logout();
            return;
        }

        const roles = extractUserRoles(token);
          console.log("[useAuth] Utilisateur authentifié avec rôles :", roles);
        setIsAuthenticated(true);
        setUserRoles(roles);
        setLoading(false);
    };

    const login = (token) => {
        localStorage.setItem('token', token);
        checkAuthStatus();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRoles([]);
        window.location.href = '/';
    };

    return { isAuthenticated, userRoles, loading, login, logout, checkAuthStatus };
};

// Fonction utilitaire pour vérifier l'expiration du token
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
};

// Fonction utilitaire pour extraire les rôles du token
const extractUserRoles = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.roles ? payload.roles.split(',') : [];
    } catch {
        return [];
    }
};