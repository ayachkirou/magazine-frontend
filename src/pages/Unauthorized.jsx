// pages/Unauthorized.jsx
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-6 rounded shadow-md text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
                <p className="text-gray-600 mb-6">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
                >
                    Retour
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Se connecter
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;