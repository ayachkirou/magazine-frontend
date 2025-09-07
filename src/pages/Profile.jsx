import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        username: payload.sub,
        email: payload.email ,
        joinDate: new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
    } catch (e) {
      console.error("Erreur décodage du token", e);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSave = () => {
    // Logique pour sauvegarder les modifications
    setIsEditing(false);
    // Ici vous ajouteriez un appel API pour mettre à jour le profil
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Carte de profil */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* En-tête avec photo de profil */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
            <p className="text-indigo-100">Membre EngineTech</p>
          </div>

          

            {/* Informations utilisateur */}
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <FaUser className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={user.username}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{user.username}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <FaEnvelope className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue={user.username}
                      className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{user.username}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <FaCalendar className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Membre depuis</p>
                  <p className="font-medium text-gray-800">{user.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Bouton de sauvegarde en mode édition */}
            {isEditing && (
              <button
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-6 hover:bg-indigo-700 transition-colors"
              >
                Sauvegarder les modifications
              </button>
            )}

            {/* Séparateur */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Bouton de déconnexion */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Statistiques supplémentaires */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-indigo-600">0</p>
            <p className="text-sm text-gray-600">Articles lus</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-indigo-600">0</p>
            <p className="text-sm text-gray-600">Favoris</p>
          </div>
        </div>
      </div>
  
  );
};

export default Profile;