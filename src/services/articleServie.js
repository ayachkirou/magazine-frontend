// service/articleService.js

const API_URL = "http://localhost:8080/api/admin/news";


// Récupérer tous les articles
export const getAllArticles = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log("Articles reçus :", data);
    return data;
  } catch (err) {
    console.error("Erreur getAllArticles :", err);
    return [];
  }
};

// Créer un article
export const createArticle = async (article , token) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log("Article créé :", data);
    return data;
  } catch (err) {
    console.error("Erreur createArticle :", err);
    throw err;
  }
};

// Mettre à jour un article
export const updateArticle = async (id, article, token) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log("Article modifié :", data);
    return data;
  } catch (err) {
    console.error("Erreur updateArticle :", err);
    throw err;
  }
};

// Supprimer un article
export const deleteArticle = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    console.log("Article supprimé :", id);
  } catch (err) {
    console.error("Erreur deleteArticle :", err);
    throw err;
  }
};
