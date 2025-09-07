// src/pages/SearchResults.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [articles, setArticles] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    // Charger tous les articles
    fetch("http://localhost:8080/api/articles/news", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((articlesData) => {
        setArticles(Array.isArray(articlesData) ? articlesData : []);
        
        // Charger toutes les opportunités
        return fetch("http://localhost:8080/api/jobs/opportunities", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      })
      .then((res) => res.json())
      .then((jobsData) => {
        setOpportunities(Array.isArray(jobsData) ? jobsData : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filtrer les articles et opportunités en fonction de la recherche
  const filteredArticles = articles.filter(article =>
    article.titre?.toLowerCase().includes(query.toLowerCase()) ||
    article.content?.toLowerCase().includes(query.toLowerCase()) ||
    article.auteur?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredOpportunities = opportunities.filter(opportunity =>
    opportunity.title?.toLowerCase().includes(query.toLowerCase()) ||
    opportunity.company?.toLowerCase().includes(query.toLowerCase()) ||
    opportunity.description?.toLowerCase().includes(query.toLowerCase()) ||
    opportunity.location?.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête de recherche */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <FaSearch className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Résultats de recherche</h1>
              <p className="text-gray-600">
                {query ? `Résultats pour "${query}"` : "Aucun terme de recherche spécifié"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{filteredArticles.length}</p>
              <p className="text-sm text-indigo-800">Articles trouvés</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{filteredOpportunities.length}</p>
              <p className="text-sm text-green-800">Opportunités trouvées</p>
            </div>
          </div>
        </div>

        {/* Résultats des articles */}
        {filteredArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="h-8 w-1 bg-indigo-600 rounded-full mr-3"></div>
              Articles correspondants
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link 
                  to={`/articles/${article.id}`} 
                  key={article.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="h-3 w-3 bg-indigo-500 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Article</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{article.titre}</h2>
                    
                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{article.content}</p>
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{article.auteur}</span>
                      </div>
                      
                      <span className="text-indigo-600 text-sm font-medium flex items-center">
                        Lire la suite
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Résultats des opportunités */}
        {filteredOpportunities.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="h-8 w-1 bg-green-600 rounded-full mr-3"></div>
              Opportunités correspondantes
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOpportunities.map((opportunity) => (
                <Link 
                  to={`/opportunites/${opportunity.id}`}
                  key={opportunity.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-green-500"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Offre d'emploi</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-3">{opportunity.title}</h2>
                    
                    <div className="space-y-3 mb-4 flex-grow">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="truncate">{opportunity.company}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="truncate">{opportunity.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="truncate">{opportunity.type}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 font-medium">Voir les détails</span>
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Aucun résultat */}
        {filteredArticles.length === 0 && filteredOpportunities.length === 0 && query && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="bg-gray-100 p-4 rounded-full inline-flex mb-6">
              <FaSearch className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600 mb-6">
              Aucun article ou opportunité ne correspond à votre recherche "{query}"
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>✓ Vérifiez l'orthographe des mots</p>
              <p>✓ Utilisez des termes plus généraux</p>
              <p>✓ Essayez d'autres mots-clés</p>
            </div>
          </div>
        )}

        {/* Aucun terme de recherche */}
        {!query && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="bg-yellow-100 p-4 rounded-full inline-flex mb-6">
              <FaSearch className="text-yellow-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun terme de recherche</h3>
            <p className="text-gray-600">
              Veuillez entrer un terme de recherche dans la barre de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
}