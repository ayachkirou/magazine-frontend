import { Link, useParams } from "react-router-dom"; 
import { useEffect, useState } from "react"; 
 
export default function ArticleDetail() { 
  const { id } = useParams(); 
  const [article, setArticle] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`http://localhost:8080/api/articles/news/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setArticle(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]); 
 
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="animate-pulse flex flex-col space-y-6">
          {/* Bouton de retour */}
          <div className="h-6 bg-gray-200 rounded w-40 mb-8"></div>
          
          {/* Contenu principal */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-8 pb-8 border-b border-gray-100">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 
 
  return ( 
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"> 
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/all-articles" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300 mb-8 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Retour à la liste des articles
        </Link>

        {article && (
          <article className="bg-white rounded-xl shadow-lg overflow-hidden p-8 md:p-10">
            <div className="mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-3 w-3 bg-indigo-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Article</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">{article.titre}</h1> 
              
              <div className="flex items-center text-gray-600">
                <div className="flex items-center mr-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">{article.auteur}</span>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date().toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <div className="leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>
           
           
          </article>
        )}
      </div>
    </div> 
  ); 
}