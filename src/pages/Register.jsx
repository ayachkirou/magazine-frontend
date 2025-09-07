"use client";

import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")

        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }

      const data = await res.json();
      setMessage("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      console.log("Utilisateur créé :", data);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h2>
            <p className="text-gray-600">Rejoignez-nous dès aujourd'hui</p>
          </div>
          
          {message && (
            <div className={`mb-6 p-3 rounded-lg text-center ${message.includes("réussie") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="exemple@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              S'inscrire
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte?{" "}
              <a href="/" className="text-blue-600 hover:text-blue-800 font-medium transition duration-200">
                Se connecter
              </a>
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 py-4 px-6 border-t border-gray-100">
          <p className="text-xs text-center text-gray-500">
            En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
}