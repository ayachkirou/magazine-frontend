import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaFacebook, FaPaperPlane } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Remplacez ces valeurs par les vôtres depuis EmailJS
      const serviceID = 'service_5qepkjb';
      const templateID = 'template_n4swilk';
      const userID = 'IaK_LoDCeAj9DnphC';

      await emailjs.send(serviceID, templateID, {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'ayachkiro@email.com' // Votre email
      }, userID);

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Erreur envoi email:', error);
      setSubmitStatus('error');
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        
        {/* Infos de contact */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            📩 Contactez <span className="text-blue-600">Enginetech</span>
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Vous avez une question, une opportunité ou une idée à partager ?
            N'hésitez pas à nous écrire. Notre équipe est là pour vous répondre
            dans les plus brefs délais.
          </p>

          <div className="space-y-6">
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaEnvelope className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600">contact@enginetech.com</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaPhone className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Téléphone</h3>
                <p className="text-gray-600">+212 6 00 00 00 00</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Réseaux sociaux</h3>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="bg-blue-100 text-blue-600 p-3 rounded-full hover:bg-blue-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-xl" />
                </a>
                <a 
                  href="#" 
                  className="bg-blue-100 text-blue-400 p-3 rounded-full hover:bg-blue-200 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a 
                  href="#" 
                  className="bg-blue-100 text-blue-800 p-3 rounded-full hover:bg-blue-200 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Envoyez-nous un message</h3>
          
          {submitStatus === 'success' && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
              ✅ Message envoyé avec succès ! Nous vous répondrons rapidement.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              ❌ Une erreur s'est produite. Veuillez réessayer ou nous contacter directement par email.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Nom complet</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-4 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Décrivez-nous votre projet ou question..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" />
                  Envoyer le message
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Nous répondons généralement dans les 24 heures.
          </p>
        </div>

      </div>
    </section>
  );
}