const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const COURRIERS_FILE = path.join(DATA_DIR, 'courriers.json');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialiser le fichier s'il n'existe pas
if (!fs.existsSync(COURRIERS_FILE)) {
  fs.writeFileSync(COURRIERS_FILE, JSON.stringify([]));
}

export const localStorage = {
  // Récupérer tous les courriers ou filtrer par type
  getCourriers: (type = null) => {
    try {
      if (!fs.existsSync(COURRIERS_FILE)) {
        fs.writeFileSync(COURRIERS_FILE, JSON.stringify([], null, 2));
        return [];
      }
      const data = fs.readFileSync(COURRIERS_FILE, 'utf8');
      const courriers = JSON.parse(data);

      if (type) {
        return courriers.filter(c => c.type === type);
      }
      return courriers;
    } catch (error) {
      console.error('Erreur lecture courriers:', error);
      return [];
    }
  },

  // Ajouter un courrier
  addCourrier: (courrier) => {
    try {
      const courriers = localStorage.getCourriers();
      const newCourrier = {
        ...courrier,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      courriers.unshift(newCourrier);
      fs.writeFileSync(COURRIERS_FILE, JSON.stringify(courriers, null, 2));
      return newCourrier;
    } catch (error) {
      console.error('Erreur ajout courrier:', error);
      throw error;
    }
  },

  // Mettre à jour un courrier
  updateCourrier: (id, updates) => {
    try {
      const courriers = localStorage.getCourriers();
      const index = courriers.findIndex(c => c.id == id);
      if (index === -1) throw new Error('Courrier non trouvé');

      courriers[index] = { 
        ...courriers[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      fs.writeFileSync(COURRIERS_FILE, JSON.stringify(courriers, null, 2));
      return courriers[index];
    } catch (error) {
      console.error('Erreur mise à jour courrier:', error);
      throw error;
    }
  },

  // Supprimer un courrier
  deleteCourrier: (id) => {
    try {
      const courriers = localStorage.getCourriers();
      const filtered = courriers.filter(c => c.id != id);
      fs.writeFileSync(COURRIERS_FILE, JSON.stringify(filtered, null, 2));
      return true;
    } catch (error) {
      console.error('Erreur suppression courrier:', error);
      throw error;
    }
  }
};