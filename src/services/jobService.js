// service/opportuniteService.js

const API_URL = "http://localhost:8080/api/admin/jobs";


// Récupérer toutes les opportunités
export const getAllJobs = async (token) => {
  try {
       if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // 🔑 token JWT
      },
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log("Opportunités reçues :", data);
    return data;
  } catch (err) {
    console.error("Erreur getAllJobs :", err);
    return [];
  }
};

// Créer une nouvelle opportunité
export const createJob = async (job , token) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log("Opportunité créée :", data);
    return data;
  } catch (err) {
    console.error("Erreur createJob :", err);
    throw err;
  }
};

// Mettre à jour une opportunité
export const updateJob = async (id, job, token) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log("Opportunité modifiée :", data);
    return data;
  } catch (err) {
    console.error("Erreur updateJob :", err);
    throw err;
  }
};

// Supprimer une opportunité
export const deleteJob = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    console.log("Opportunité supprimée :", id);
  } catch (err) {
    console.error("Erreur deleteJob :", err);
    throw err;
  }
};
