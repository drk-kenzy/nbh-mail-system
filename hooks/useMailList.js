
import { useState, useEffect } from "react";

export function useMailList(type = "arrive") {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = type === "arrive" ? "courriers-arrive" : "courriers-depart";

  // Fonction pour charger les données depuis localStorage
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      const data = stored ? JSON.parse(stored) : [];
      console.log(`Chargement ${type} depuis localStorage:`, data);
      setMails(data);
      return data;
    } catch (error) {
      console.error(`Erreur lors du chargement des courriers ${type}:`, error);
      setMails([]);
      return [];
    }
  };

  // Fonction pour sauvegarder dans localStorage
  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.log(`Sauvegarde ${type} dans localStorage:`, data);
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde:`, error);
    }
  };

  const fetchMails = async () => {
    try {
      setLoading(true);
      const data = loadFromLocalStorage();
      setMails(data);
    } catch (error) {
      console.error(`Erreur lors du chargement des courriers ${type}:`, error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  const addMail = async (newMail) => {
    try {
      const currentMails = loadFromLocalStorage();
      const courrier = {
        ...newMail,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedMails = [courrier, ...currentMails];
      saveToLocalStorage(updatedMails);
      setMails(updatedMails);
      
      // Déclencher les événements de synchronisation
      window.dispatchEvent(new CustomEvent('courriersUpdated', { 
        detail: { type, action: 'add', courrier } 
      }));
      
      return courrier;
    } catch (error) {
      console.error('Erreur ajout courrier:', error);
      throw error;
    }
  };

  const updateMail = async (id, updatedData) => {
    try {
      const currentMails = loadFromLocalStorage();
      const updatedMails = currentMails.map(mail => 
        mail.id === id 
          ? { ...mail, ...updatedData, updatedAt: new Date().toISOString() }
          : mail
      );
      
      saveToLocalStorage(updatedMails);
      setMails(updatedMails);
      
      const updatedCourrier = updatedMails.find(mail => mail.id === id);
      
      // Déclencher les événements de synchronisation
      window.dispatchEvent(new CustomEvent('courriersUpdated', { 
        detail: { type, action: 'update', courrier: updatedCourrier } 
      }));
      
      return updatedCourrier;
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      throw error;
    }
  };

  const updateStatus = async (id, statusData) => {
    try {
      // Mise à jour optimiste de l'état local
      setMails(prevMails => 
        prevMails.map(mail => 
          mail.id === id 
            ? { ...mail, statut: statusData.statut, status: statusData.statut }
            : mail
        )
      );

      const currentMails = loadFromLocalStorage();
      const updatedMails = currentMails.map(mail => 
        mail.id === id 
          ? { ...mail, statut: statusData.statut, status: statusData.statut, updatedAt: new Date().toISOString() }
          : mail
      );
      
      saveToLocalStorage(updatedMails);
      setMails(updatedMails);
      
      const updatedCourrier = updatedMails.find(mail => mail.id === id);
      
      // Déclencher les événements de synchronisation
      window.dispatchEvent(new CustomEvent('courriersUpdated', { 
        detail: { type, action: 'update', courrier: updatedCourrier } 
      }));
      
      return updatedCourrier;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      throw error;
    }
  };

  const deleteMail = async (id) => {
    try {
      const currentMails = loadFromLocalStorage();
      const updatedMails = currentMails.filter(mail => mail.id !== id);
      
      saveToLocalStorage(updatedMails);
      setMails(updatedMails);
      
      // Déclencher les événements de synchronisation
      window.dispatchEvent(new CustomEvent('courriersUpdated', { 
        detail: { type, action: 'delete', id } 
      }));
      
      return true;
    } catch (error) {
      console.error('Erreur suppression courrier:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Chargement initial depuis localStorage
    fetchMails();

    // Écouter les changements depuis d'autres composants/onglets
    const handleCourriersUpdated = (event) => {
      console.log('Événement courriersUpdated détecté pour type:', type, event?.detail);
      // Rafraîchir uniquement si cela concerne notre type ou si c'est général
      if (!event.detail?.type || event.detail.type === type) {
        fetchMails();
      }
    };

    const handleStorageChange = (event) => {
      // Écouter les changements de localStorage depuis d'autres onglets
      if (event.key === storageKey) {
        console.log('Changement localStorage détecté pour:', storageKey);
        fetchMails();
      }
    };

    // Écouter les événements de synchronisation
    window.addEventListener('courriersUpdated', handleCourriersUpdated);
    window.addEventListener('focus', fetchMails);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchMails();
      }
    });

    return () => {
      window.removeEventListener('courriersUpdated', handleCourriersUpdated);
      window.removeEventListener('focus', fetchMails);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('visibilitychange', fetchMails);
    };
  }, [type, storageKey]);

  return {
    mails,
    loading,
    addMail,
    updateMail,
    updateStatus,
    deleteMail,
    refresh: fetchMails
  };
}
