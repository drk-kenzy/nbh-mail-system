
import { useState, useEffect } from "react";

export function useMailList(type = "arrive") {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = type === "arrive" ? "/api/courrier-arrive" : "/api/courrier-depart";

  const fetchMails = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      if (response.ok) {
        const courriers = await response.json();
        console.log(`Chargement ${type} depuis API:`, courriers);
        setMails(courriers);
      } else {
        console.error(`Erreur lors du chargement des courriers ${type}:`, response.status);
        setMails([]);
      }
    } catch (error) {
      console.error(`Erreur lors du chargement des courriers ${type}:`, error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  const addMail = async (newMail) => {
    try {
      const formData = new FormData();
      
      // Ajouter tous les champs du courrier
      Object.keys(newMail).forEach(key => {
        if (key !== 'fichiers') {
          formData.append(key, newMail[key]);
        }
      });

      // Ajouter les fichiers s'il y en a
      if (newMail.fichiers && Array.isArray(newMail.fichiers)) {
        newMail.fichiers.forEach(file => {
          formData.append('fichiers', file);
        });
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const courrier = await response.json();
        
        // Rafraîchir la liste depuis l'API
        await fetchMails();
        
        // Déclencher les événements de synchronisation
        window.dispatchEvent(new CustomEvent('courriersUpdated', { 
          detail: { type, action: 'add', courrier } 
        }));
        
        return courrier;
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur ajout courrier:', error);
      throw error;
    }
  };

  const updateMail = async (id, updatedData) => {
    try {
      const formData = new FormData();
      
      // Ajouter tous les champs du courrier
      Object.keys(updatedData).forEach(key => {
        if (key !== 'fichiers') {
          formData.append(key, updatedData[key]);
        }
      });

      // Ajouter les fichiers s'il y en a
      if (updatedData.fichiers && Array.isArray(updatedData.fichiers)) {
        updatedData.fichiers.forEach(file => {
          formData.append('fichiers', file);
        });
      }

      const response = await fetch(`${apiUrl}?id=${id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        const courrier = await response.json();
        
        // Rafraîchir la liste depuis l'API
        await fetchMails();
        
        // Déclencher les événements de synchronisation
        window.dispatchEvent(new CustomEvent('courriersUpdated', { 
          detail: { type, action: 'update', courrier } 
        }));
        
        return courrier;
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
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

      const formData = new FormData();
      formData.append('statut', statusData.statut);

      const response = await fetch(`${apiUrl}?id=${id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        const courrier = await response.json();
        
        // Déclencher les événements de synchronisation
        window.dispatchEvent(new CustomEvent('courriersUpdated', { 
          detail: { type, action: 'update', courrier } 
        }));
        
        return courrier;
      } else {
        // Revenir à l'état précédent en cas d'erreur
        await fetchMails();
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      // Revenir à l'état précédent en cas d'erreur
      await fetchMails();
      throw error;
    }
  };

  const deleteMail = async (id) => {
    try {
      const response = await fetch(`${apiUrl}?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Rafraîchir la liste depuis l'API
        await fetchMails();
        
        // Déclencher les événements de synchronisation
        window.dispatchEvent(new CustomEvent('courriersUpdated', { 
          detail: { type, action: 'delete', id } 
        }));
        
        return true;
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur suppression courrier:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Chargement initial
    fetchMails();

    // Écouter les changements depuis d'autres composants/onglets
    const handleCourriersUpdated = (event) => {
      console.log('Événement courriersUpdated détecté pour type:', type, event?.detail);
      // Rafraîchir uniquement si cela concerne notre type ou si c'est général
      if (!event.detail?.type || event.detail.type === (type === "arrive" ? "ARRIVE" : "DEPART")) {
        fetchMails();
      }
    };

    // Écouter les événements de synchronisation
    window.addEventListener('courriersUpdated', handleCourriersUpdated);
    window.addEventListener('focus', fetchMails);
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchMails();
      }
    });

    return () => {
      window.removeEventListener('courriersUpdated', handleCourriersUpdated);
      window.removeEventListener('focus', fetchMails);
      window.removeEventListener('visibilitychange', fetchMails);
    };
  }, [type]);

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
