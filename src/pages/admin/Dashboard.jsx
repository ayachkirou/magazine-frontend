import { useState, useEffect } from "react";
import { Search, Plus, User, Calendar, Edit, Trash2, ChevronLeft, ChevronRight, FileText, Briefcase, BarChart3, Settings, LogOut } from "lucide-react";
import ArticleForm from "../../components/ArticleForm.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import JobForm from "../../components/JobForm.jsx";
import { getAllArticles, createArticle, updateArticle, deleteArticle } from "../../services/articleServie.js";
import { getAllJobs, createJob, updateJob, deleteJob } from "../../services/jobService.js";

// Fonction pour formater la date
const formatDate = (dateString) => {
  try {
    if (!dateString) return 'N/A';
    
    if (dateString instanceof Date) {
      return dateString.toLocaleDateString('fr-FR');
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn('Date invalide:', dateString);
      return 'N/A';
    }
    
    return date.toLocaleDateString('fr-FR');
  } catch (error) {
    console.error('Erreur de formatage de date:', error, dateString);
    return 'N/A';
  }
};

const AdminDashboard = () => {
  // Articles 
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [activeTab, setActiveTab] = useState("articles"); // Initialisation correcte
  
  // Pagination pour articles
  const [currentArticlePage, setCurrentArticlePage] = useState(1);
  const [articlesPerPage] = useState(5);

  // Pagination pour opportunités
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const [jobsPerPage] = useState(5);

  // Général
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, id: null });

  // Job Offers
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

 // Categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Token et authentification
  const [token, setToken] = useState(localStorage.getItem("token") || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));  

  useEffect(() => {
    // Vérifier si le token existe et est valide
    if (!token) {
      console.error("Pas de token trouvé, accès refusé !");
      setIsAuthenticated(false);
      showMessage('Veuillez vous reconnecter', 'error');
      return;
    }
    
    // Vérifier l'expiration du token si c'est un JWT
    if (token && isJWTTokenExpired(token)) {
      console.error("Token expiré !");
      localStorage.removeItem("token");
      setToken('');
      setIsAuthenticated(false);
      showMessage('Session expirée, veuillez vous reconnecter', 'error');
      return;
    }
    
    setIsAuthenticated(true);
    loadArticles(token);
    loadJobs(token);
    loadCategories(token);
 
  }, [token]);

  // Fonction pour vérifier l'expiration d'un token JWT
  const isJWTTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convertir en millisecondes
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error);
      return true;
    }
  };

// Charger les catégories
  const loadCategories = async (token) => {
    setLoadingCategories(true);
    try {
      console.log("Chargement des catégories...");
      const response = await fetch("http://localhost:8080/categories", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Catégories chargées:", data);
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories", error);
      showMessage('Erreur de chargement des catégories', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };



  // Charger articles
  const loadArticles = async (token) => {
    console.log("loadArticles appelé");
    setLoading(true);
    try {
      const data = await getAllArticles(token);
      console.log("Données reçues du service :", data);
            // Debug: Vérifier la structure des articles
      if (Array.isArray(data)) {
        data.forEach((article, index) => {
          console.log(`Article ${index}:`, {
            id: article.id,
            titre: article.titre,
            category: article.category,
            categoryId: article.categoryId,
            categoryName: article.category?.name
          });
        });
      }
      setArticles(Array.isArray(data) ? data : []);
      setCurrentArticlePage(1);
    } catch (error) {
      console.error("Erreur loadArticles :", error);
      if (error.message.includes('403')) {
        showMessage('Accès refusé. Vérifiez vos permissions.', 'error');
      } else {
        showMessage('Erreur lors du chargement des articles', 'error');
      }
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger jobs
  const loadJobs = async (token) => {
    setLoadingJobs(true);
    try {
      const data = await getAllJobs(token);
      setJobs(Array.isArray(data) ? data : []);
      setCurrentJobPage(1);
    } catch (error) {
      if (error.message.includes('403')) {
        showMessage('Accès refusé. Vérifiez vos permissions.', 'error');
      } else {
        showMessage("Erreur lors du chargement des opportunités", "error");
      }
    } finally {
      setLoadingJobs(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  // CRUD articles
  const handleCreateArticle = async (articleData) => {
    if (!token) {
      showMessage('Token manquant', 'error');
      return;
    }
    
    try {
      await createArticle(articleData, token);
      showMessage('Article créé avec succès !', 'success');
      loadArticles(token);
      setShowForm(false);
    } catch (error) {
      showMessage('Erreur lors de la création', 'error');
    }
  };

  const handleUpdateArticle = async (articleData) => {
    try {
      await updateArticle(editingArticle.id, articleData, token);
      showMessage('Article mis à jour avec succès !', 'success');
      loadArticles(token);
      setEditingArticle(null);
      setShowForm(false);
    } catch (error) {
      showMessage('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      await deleteArticle(id, token);
      showMessage('Article supprimé avec succès !', 'success');
      loadArticles(token);
      setConfirmDialog({ isOpen: false, articleId: null });
    } catch (error) {
      showMessage('Erreur lors de la suppression', 'error');
    }
  };

  // CRUD jobs
  const handleCreateJob = async (jobData) => {
    try {
      console.log("Job reçu dans parent :", jobData);
      await createJob(jobData, token);
      showMessage("Opportunité créée avec succès !", "success");
      console.log("Données de l'opportunité :", jobData);
      loadJobs(token);
      setShowJobForm(false);
    } catch {
      showMessage("Erreur lors de la création de l'opportunité", "error");
    }
  };

  const handleUpdateJob = async (jobData) => {
    try {
      await updateJob(editingJob.id, jobData, token);
      showMessage("Opportunité mise à jour avec succès !", "success");
      loadJobs(token);
      setEditingJob(null);
      setShowJobForm(false);
    } catch {
      showMessage("Erreur lors de la mise à jour de l'opportunité", "error");
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await deleteJob(id, token);
      showMessage("Opportunité supprimée avec succès !", "success");
      loadJobs(token);
      setConfirmDialog({ isOpen: false, type: null, id: null });
    } catch {
      showMessage("Erreur lors de la suppression", "error");
    }
  };

    // Fonction pour obtenir le nom de la catégorie
  const getCategoryName = (article) => {
    // Essayer différents chemins possibles pour la catégorie
    if (article.categoryName) return article.categoryName;
    if (article.category?.name) return article.category.name;
    if (article.category && typeof article.category === 'string') return article.category;
    
    // Si on a un categoryId, chercher dans la liste des catégories
    if (article.categoryId) {
      const foundCategory = categories.find(cat => cat.id === article.categoryId);
      if (foundCategory) return foundCategory.name;
    }
    
    return 'N/A';
  };

  // Filtrage Articles
  const filteredArticles = articles.filter(article =>
    article?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article?.auteur?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrage Jobs
  const filteredJobs = jobs.filter(
    (j) =>
      j?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination pour articles
  const indexOfLastArticle = currentArticlePage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalArticlePages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Pagination pour opportunités
  const indexOfLastJob = currentJobPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalJobPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Changer de page pour articles
  const paginateArticles = (pageNumber) => setCurrentArticlePage(pageNumber);

  // Changer de page pour opportunités
  const paginateJobs = (pageNumber) => setCurrentJobPage(pageNumber);

  // Composant de pagination réutilisable
  const Pagination = ({ currentPage, totalPages, paginate }) => {
    const pageNumbers = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {number}
          </button>
        ))}
        
        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`mx-1 px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Afficher un message si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md w-full mx-4">
          <div className="bg-red-100 text-red-600 p-3 rounded-full inline-flex mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur d'authentification</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors w-full"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button  onClick={() => loadCategories(token)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
               title="Actualiser les catégories">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
                           <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = '/';
                }}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation par onglets améliorée */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("articles")}
              className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "articles" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              Articles
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "jobs" 
                  ? "bg-white text-green-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Opportunités
            </button>
          </div>
        </div>

        {/* Message de notification amélioré */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 shadow-sm border-l-4 ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-800 border-green-400' 
              : 'bg-red-50 text-red-800 border-red-400'
          }`}>
            <div className="flex items-center">
              <div className={`rounded-full p-1 mr-3 ${
                messageType === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {messageType === 'success' ? (
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Section Articles */}
        {activeTab === "articles" && (
          <>
            {/* Formulaire d'article (inchangé) */}
            {showForm && (
              <ArticleForm
                article={editingArticle}
                onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle}
                onCancel={() => {
                  setShowForm(false);
                  setEditingArticle(null);
                }}
                isEditing={!!editingArticle}
              />
            )}

            {/* Barre d'actions pour articles améliorée */}
            {!showForm && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    />
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvel Article
                  </button>
                </div>
              </div>
            )}

            {/* Liste des articles améliorée */}
            {!showForm && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Chargement des articles...</p>
                  </div>
                ) : filteredArticles.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {searchTerm ? 'Aucun article trouvé' : 'Aucun article disponible'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Essayez une autre recherche' : 'Commencez par créer votre premier article'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Article
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Catégorie
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Statut
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-8 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentArticles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-5">
                                <div>
                                  <div className="text-lg font-semibold text-gray-900 mb-1">
                                    {article.titre}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    {article.auteur}
                                  </div>
                                </div>
                              </td>
                               <td className="px-8 py-5">
                                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {getCategoryName(article)}
                                </span>
                              </td>
                              <td className="px-8 py-5">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                  article.status?.toLowerCase() === 'publié' ? 'bg-green-100 text-green-800' :
                                  article.status?.toLowerCase() === 'brouillon' ? 'bg-gray-100 text-gray-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {article.status || 'N/A'}
                                </span>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2" />
                                    {article.datePub ? formatDate(article.datePub) : 'N/A'}
                                </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingArticle(article);
                                      setShowForm(true);
                                    }}
                                    className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                                    title="Modifier"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDialog({ isOpen: true, type: "article", articleId: article.id })}
                                    className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination améliorée */}
                    {totalArticlePages > 1 && (
                      <div className="px-8 py-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Page {currentArticlePage} sur {totalArticlePages}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => paginateArticles(Math.max(1, currentArticlePage - 1))}
                              disabled={currentArticlePage === 1}
                              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                                currentArticlePage === 1 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Précédent
                            </button>
                            <button
                              onClick={() => paginateArticles(Math.min(totalArticlePages, currentArticlePage + 1))}
                              disabled={currentArticlePage === totalArticlePages}
                              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                                currentArticlePage === totalArticlePages 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                              }`}
                            >
                              Suivant
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* Section Opportunités */}
        {activeTab === "jobs" && (
          <>
            {/* Formulaire d'opportunité (inchangé) */}
            {showJobForm && (
              <JobForm
                job={editingJob}
                onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
                onCancel={() => {
                  setShowJobForm(false);
                  setEditingJob(null);
                }}
                isEditing={!!editingJob}
              />
            )}

            {/* Barre d'actions pour opportunités améliorée */}
            {!showJobForm && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des opportunités..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingJob(null);
                      setShowJobForm(true);
                    }}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Nouvelle Opportunité
                  </button>
                </div>
              </div>
            )}

            {/* Liste des opportunités améliorée */}
            {!showJobForm && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loadingJobs ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Chargement des opportunités...</p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {searchTerm ? 'Aucune opportunité trouvée' : 'Aucune opportunité disponible'}
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Essayez une autre recherche' : 'Commencez par créer votre première opportunité'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Titre
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Entreprise
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Localisation
                            </th>
                            <th className="px-8 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-8 py-5">
                                <div className="text-lg font-semibold text-gray-900">
                                  {job.title}
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="text-sm text-gray-600">
                                  {job.company}
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  {job.type}
                                </span>
                              </td>
                              <td className="px-8 py-5">
                                <div className="text-sm text-gray-600">
                                  {job.Location}
                                </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingJob(job);
                                      setShowJobForm(true);
                                    }}
                                    className="p-2 text-yellow-600 hover:text-yellow-800 rounded-lg hover:bg-yellow-50 transition-colors"
                                    title="Modifier"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDialog({ isOpen: true, type: "job", id: job.id })}
                                    className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination améliorée */}
                    {totalJobPages > 1 && (
                      <div className="px-8 py-6 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Page {currentJobPage} sur {totalJobPages}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => paginateJobs(Math.max(1, currentJobPage - 1))}
                              disabled={currentJobPage === 1}
                              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                                currentJobPage === 1 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Précédent
                            </button>
                            <button
                              onClick={() => paginateJobs(Math.min(totalJobPages, currentJobPage + 1))}
                              disabled={currentJobPage === totalJobPages}
                              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                                currentJobPage === totalJobPages 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                              }`}
                            >
                              Suivant
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* Modal de confirmation (inchangé) */}
        <ConfirmDialog 
          isOpen={confirmDialog.isOpen} 
          titre={confirmDialog.type === "job" ? "Supprimer l'opportunité" : "Supprimer l'article"} 
          message={
            confirmDialog.type === "job"
              ? "Êtes-vous sûr de vouloir supprimer cette opportunité ? Cette action est irréversible."
              : "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
          } 
          onConfirm={() => { 
            if (confirmDialog.type === "job") { 
              handleDeleteJob(confirmDialog.id); 
            } else { 
              handleDeleteArticle(confirmDialog.articleId); 
            } 
          }} 
          onCancel={() => setConfirmDialog({ isOpen: false, type: null, id: null, articleId: null })} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;