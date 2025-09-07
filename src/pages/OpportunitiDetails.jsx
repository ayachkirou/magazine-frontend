import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OpportunityDetails() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // récupère le token
    if (!token) return;

    fetch(`http://localhost:8080/api/jobs/opportunities/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setOpportunity(data);
        setError(null);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="p-6 max-w-4xl mx-auto flex justify-center">
      <div className="animate-pulse flex flex-col space-y-4 w-full">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6 max-w-4xl mx-auto text-red-500">
      Erreur: {error}
      <Link to="/all-articles" className="block mt-4 text-blue-600 hover:underline">
        Retour à la liste
      </Link>
    </div>
  );

  if (!opportunity) return (
    <div className="p-6 max-w-4xl mx-auto">
      <p>Aucune opportunité trouvée</p>
      <Link to="/all-articles" className="block mt-4 text-blue-600 hover:underline">
        Retour à la liste
      </Link>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link 
        to="/all-articles" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Retour à la liste
      </Link>

      <article className="bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{opportunity.title || opportunity.title}</h1>
        
        <div className="flex flex-wrap gap-4 my-4">
          <p className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {opportunity.location || opportunity.Location}
          </p>
          
          <p className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {opportunity.company || opportunity.entreprise}
          </p>
          
          <p className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {opportunity.type}
          </p>
        </div>

        {opportunity.salary && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Salary</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {opportunity.salary} DH
            </p>
          </div>
        )}
        {opportunity.contact && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {opportunity.contact ? opportunity.contact : "Non renseigné"}
            </p>
          </div>
        )}
      </article>
    </div>
  );
}