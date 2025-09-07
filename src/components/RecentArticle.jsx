import React, { useState, useEffect } from 'react';
import closeImg from './../assets/close.jpg';
import { Link } from 'react-router-dom';
export default function RecentArticles() {
  const [articles, setArticles] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    fetch('http://localhost:8080/api/articles/recent', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setArticles(data))
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch('http://localhost:8080/api/jobs/recent', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setOpportunities(data))
      .catch(error => console.error('Error fetching opportunities:', error));
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20">
      {/* Bannière en haut avec overlay */}
      <div className="relative w-full h-72 bg-cover bg-center mb-12" style={{ backgroundImage: `url(${closeImg})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-800 opacity-75"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">Espace Actualités & Opportunités</h1>
        </div>
      </div>

      {/* Contenu des articles */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <div className="h-10 w-4 bg-indigo-600 rounded-full mr-3"></div>
          <h2 className="text-3xl font-bold text-gray-800">Articles Récents</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <Link to={`/articles/${article.id}`} key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-3 w-3 bg-indigo-500 rounded-full mr-2"></div>
                  <span className="text-sm text-indigo-600 font-medium">Article</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{article.titre}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.content?.substring(0, 100)}...</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Par {article.auteur}</p>
                
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Section des opportunités */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="flex items-center mb-8">
          <div className="h-10 w-4 bg-green-500 rounded-full mr-3"></div>
          <h2 className="text-3xl font-bold text-gray-800">Opportunités Professionnelles</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map(opportunity => (
            <Link to={`/opportunities/${opportunity.id}`} key={opportunity.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Offre d'emploi</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{opportunity.title}</h3>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span className="text-sm text-gray-600">{opportunity.company}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">{opportunity.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">{opportunity.type}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Date limite: {opportunity.deadline}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">{opportunity.salary} DH</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">{opportunity.contact ? opportunity.contact : "Non renseigné"}</span>
                  </div>
                </div>
                
               
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}