import { useState } from "react";
import { X, Save } from "lucide-react";

const JobForm = ({ job, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    type: job?.type || '',
    Location: job?.Location || '',
    salary: job?.salary || '',
    contact: job?.contact || '',
    deadline: job?.deadline || '',
    ...job
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.company.trim()) newErrors.company = 'L\'entreprise est requise';
    if (!formData.Location.trim()) newErrors.Location = 'La localisation est requise';
    if (!formData.type.trim()) newErrors.type = 'Le type de contrat est requis';
    
    if (formData.contact && !/\S+@\S+\.\S+/.test(formData.contact)) {
      newErrors.contact = 'Le contact doit être un email valide';
    }
    
    if (formData.salary && isNaN(formData.salary)) {
      newErrors.salary = "Le salaire doit être un nombre valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Conversion des données pour correspondre au backend
      const submissionData = {
        ...formData,
        salary: formData.salary ? parseInt(formData.salary) : null,
        // Conversion de la date pour le format backend si nécessaire
        deadline: formData.deadline || null
      };
      
      console.log("Données envoyées au backend:", submissionData);
      await onSubmit(submissionData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre du poste *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Développeur Full Stack"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entreprise *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nom de l'entreprise"
            />
            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localisation *
            </label>
            <input
              type="text"
              name="Location"
              value={formData.Location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.Location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Paris, France"
            />
            {errors.Location && <p className="text-red-500 text-sm mt-1">{errors.Location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de contrat *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionnez un type</option>
              <option value="Temps plein">Temps plein</option>
              <option value="Temps partiel">Temps partiel</option>
              <option value="Stage">Stage</option>
              <option value="Freelance">Freelance</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salaire (€)
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="45000"
            />
            {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact (email)
            </label>
            <input
              type="email"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.contact ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="recrutement@entreprise.com"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date limite de candidature
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 mr-1" />
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                {isEditing ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" />
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobForm;