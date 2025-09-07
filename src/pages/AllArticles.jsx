import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AllArticles() {
  const [articles, setArticles] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [articlesPage, setArticlesPage] = useState(1);
  const [opportunitiesPage, setOpportunitiesPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/articles/news", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/jobs/opportunities", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setOpportunities(data))
      .catch((err) => console.error(err));
  }, []);

  // Get current items for articles
  const indexOfLastArticle = articlesPage * itemsPerPage;
  const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  // Get current items for opportunities
  const indexOfLastOpportunity = opportunitiesPage * itemsPerPage;
  const indexOfFirstOpportunity = indexOfLastOpportunity - itemsPerPage;
  const currentOpportunities = opportunities.slice(indexOfFirstOpportunity, indexOfLastOpportunity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Articles Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="h-10 w-4 bg-indigo-600 rounded-full mr-3"></div>
                <h1 className="text-3xl font-bold text-gray-800">Tous les articles</h1>
              </div>
              <p className="text-gray-600 mt-2">Découvrez tous nos articles rédigés par des experts</p>
            </div>
            
            {articles.length > itemsPerPage && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setArticlesPage(prev => Math.max(prev - 1, 1))}
                  disabled={articlesPage === 1}
                  className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Précédent
                </button>
                <button
                  onClick={() => setArticlesPage(prev => (prev * itemsPerPage < articles.length ? prev + 1 : prev))}
                  disabled={articlesPage * itemsPerPage >= articles.length}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200"
                >
                  Suivant
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {currentArticles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentArticles.map((article) => (
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
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
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
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-gray-500 text-lg">Aucun article disponible pour le moment</p>
            </div>
          )}
        </section>

        {/* Opportunities Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="h-10 w-4 bg-green-500 rounded-full mr-3"></div>
                <h1 className="text-3xl font-bold text-gray-800">Toutes les opportunités</h1>
              </div>
              <p className="text-gray-600 mt-2">Explorez les offres d'emploi et opportunités professionnelles</p>
            </div>
            
            {opportunities.length > itemsPerPage && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setOpportunitiesPage(prev => Math.max(prev - 1, 1))}
                  disabled={opportunitiesPage === 1}
                  className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Précédent
                </button>
                <button
                  onClick={() => setOpportunitiesPage(prev => (prev * itemsPerPage < opportunities.length ? prev + 1 : prev))}
                  disabled={opportunitiesPage * itemsPerPage >= opportunities.length}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors duration-200"
                >
                  Suivant
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {currentOpportunities.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentOpportunities.map((opportunity) => (
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
                        <svg className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span className="truncate">{opportunity.company}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="truncate">{opportunity.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
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
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <p className="text-gray-500 text-lg">Aucune opportunité disponible pour le moment</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}