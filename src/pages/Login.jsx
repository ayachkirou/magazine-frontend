import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Stocker le token dans le localStorage
        localStorage.setItem("token", data.token);

        // Décoder le token pour récupérer l'ID et le rôle
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        console.log("User role:", payload.role, "User ID:", payload.id);

        // Stocker l'ID de l'utilisateur pour Edit.jsx
        localStorage.setItem("userId", payload.id);

        // Redirection vers la page principale
        navigate("/home");
      } else {
        alert("Erreur de connexion ❌");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      alert("Erreur serveur. Réessayez plus tard.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h2>
            <p className="text-gray-600">Content de vous revoir</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                placeholder="exemple@email.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                placeholder="Votre mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
              >
                S'inscrire
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
