import { useState, useEffect } from "react"; 
import { X, Save } from "lucide-react"; 

const ArticleForm = ({ article, onSubmit, onCancel, isEditing }) => { 
  const [formData, setFormData] = useState({ 
    titre: '', 
    content: '', 
    auteur: '', 
    category: '', 
    status: '', // Champ texte pour le statut
    ...article 
  }); 

  const [categories, setCategories] = useState([]); 
  const [errors, setErrors] = useState({}); 
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => { 
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token non trouvé");
      return;
    }

    setLoadingCategories(true);
    fetch("http://localhost:8080/categories", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }) 
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Catégories chargées:", data);
        setCategories(data);
      }) 
      .catch((err) => {
        console.error("Erreur lors du chargement des catégories", err);
        // Optionnel: afficher un message à l'utilisateur
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, []); 

  const handleChange = (e) => { 
    const { name, value } = e.target; 
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "category" ? Number(value) : value
    })); 
  }; 

  const validateForm = () => { 
    const newErrors = {}; 
    if (!formData.titre.trim()) newErrors.titre = 'Le titre est requis'; 
    if (!formData.content.trim()) newErrors.content = 'Le contenu est requis'; 
    if (!formData.auteur.trim()) newErrors.auteur = 'L\'auteur est requis'; 
    if (!formData.category) newErrors.category = "La catégorie est requise"; 
    if (!formData.status.trim()) newErrors.status = "Le statut est requis"; 

    setErrors(newErrors); 
    return Object.keys(newErrors).length === 0; 
  }; 

  const handleSubmit = () => {
    if (validateForm()) {
      // Créer le payload correctement
      const payload = {
        id: article?.id,               // Inclure l'ID si on modifie
        titre: formData.titre,
        content: formData.content,
        auteur: formData.auteur,
        status: formData.status,       // Admin écrit directement le statut
        category: { id: Number(formData.category) } // catégorie par ID
      };

      console.log("Payload envoyé :", payload);
      onSubmit(payload); // Appel à la fonction parent (create ou update)
    }
  };

  return ( 
    <div className="bg-white rounded-lg shadow-md p-6 mb-6"> 
      <h2 className="text-xl font-semibold mb-4"> 
        {isEditing ? 'Modifier l\'article' : 'Nouvel article'} 
      </h2> 

      <div className="space-y-4"> 
        {/* Titre */}
        <div> 
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label> 
          <input 
            type="text" 
            name="titre" 
            value={formData.titre} 
            onChange={handleChange} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.titre ? 'border-red-500' : 'border-gray-300'
            }`} 
            placeholder="Titre de l'article" 
          /> 
          {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>} 
        </div> 

        {/* Auteur */}
        <div> 
          <label className="block text-sm font-medium text-gray-700 mb-1">Auteur *</label> 
          <input 
            type="text" 
            name="auteur" 
            value={formData.auteur} 
            onChange={handleChange} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.auteur ? 'border-red-500' : 'border-gray-300'
            }`} 
            placeholder="Nom de l'auteur" 
          /> 
          {errors.auteur && <p className="text-red-500 text-sm mt-1">{errors.auteur}</p>} 
        </div> 

        {/* Catégorie */}
        <div> 
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label> 
          {loadingCategories ? (
            <div className="flex items-center text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Chargement des catégories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-red-500 text-sm">
              Aucune catégorie disponible. Veuillez contacter l'administrateur.
            </div>
          ) : (
            <>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              > 
                <option value="">-- Choisir une catégorie --</option> 
                {categories.map((cat) => ( 
                  <option key={cat.id} value={cat.id}>{cat.name}</option> 
                ))} 
              </select> 
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </>
          )}
        </div> 

        {/* Contenu */}
        <div> 
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label> 
          <textarea 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            rows={6} 
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`} 
            placeholder="Contenu de l'article..." 
          /> 
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>} 
        </div> 

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Choisir un statut --</option>
            <option value="Publié">Publié</option>
            <option value="Brouillon">Brouillon</option>
            <option value="Archivé">Archivé</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-2 pt-4"> 
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors" 
          > 
            <X className="w-4 h-4 mr-1" /> Annuler 
          </button> 
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={loadingCategories || categories.length === 0}
            className={`flex items-center px-4 py-2 rounded transition-colors ${
              loadingCategories || categories.length === 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`} 
          > 
            <Save className="w-4 h-4 mr-1" /> 
            {isEditing ? 'Mettre à jour' : 'Créer'} 
          </button> 
        </div> 
      </div> 
    </div> 
  ); 
}; 

export default ArticleForm;