import { useState, useEffect } from "react";

export function useMailList(type = "arrive") {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMails = () => {
    try {
      setLoading(true);
      const courriers = JSON.parse(localStorage.getItem('courriers') || '[]');
      const filteredCourriers = courriers.filter(courrier => 
        courrier.type === (type === "arrive" ? "ARRIVE" : "DEPART")
      );
      console.log(`Chargement ${type}:`, filteredCourriers); // Debug
      console.log('Tous les courriers:', courriers); // Debug supplémentaire
      setMails(filteredCourriers);
    } catch (error) {
      console.error("Erreur lors du chargement des courriers:", error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  const addMail = (newMail) => {
    try {
      const courriers = JSON.parse(localStorage.getItem('courriers') || '[]');
      const mailWithId = {
        ...newMail,
        id: Date.now(),
        type: type === "arrive" ? "ARRIVE" : "DEPART",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedCourriers = [mailWithId, ...courriers];
      localStorage.setItem('courriers', JSON.stringify(updatedCourriers));

      // Mettre à jour l'état local immédiatement
      setMails(prev => [mailWithId, ...prev]);

      // Déclencher immédiatement plusieurs événements pour assurer la synchronisation
      window.dispatchEvent(new CustomEvent('courriersUpdated', { detail: { type, action: 'add' } }));
      window.dispatchEvent(new CustomEvent('storage', { detail: { key: 'courriers' } }));
      window.dispatchEvent(new CustomEvent('courriersAdded', { detail: mailWithId }));
      
      // Déclencher aussi après un court délai pour s'assurer que tous les composants reçoivent l'événement
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('courriersUpdated', { detail: { type, action: 'add' } }));
        window.dispatchEvent(new CustomEvent('storage', { detail: { key: 'courriers' } }));
      }, 50);

      return mailWithId;
    } catch (error) {
      console.error('Erreur ajout courrier:', error);
      throw error;
    }
  };

  const updateMail = (id, updatedData) => {
    try {
      const existingCourriers = JSON.parse(localStorage.getItem('courriers') || '[]');
      const updatedCourriers = existingCourriers.map(courrier => 
        courrier.id === id 
          ? { ...courrier, ...updatedData, updatedAt: new Date().toISOString() }
          : courrier
      );

      localStorage.setItem('courriers', JSON.stringify(updatedCourriers));

      // Déclencher l'événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('courriersUpdated'));

      setMails(prev => prev.map(mail => 
        mail.id === id ? { ...mail, ...updatedData } : mail
      ));
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      throw error;
    }
  };

  const deleteMail = (id) => {
    try {
      const courriers = JSON.parse(localStorage.getItem('courriers') || '[]');
      const filteredCourriers = courriers.filter(c => c.id !== parseInt(id));
      localStorage.setItem('courriers', JSON.stringify(filteredCourriers));

      // Mettre à jour l'état local immédiatement
      setMails(prev => prev.filter(mail => mail.id !== parseInt(id)));

      // Déclencher plusieurs événements pour assurer la synchronisation
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('courriersUpdated'));
        window.dispatchEvent(new CustomEvent('storage'));
        window.dispatchEvent(new CustomEvent('courriersDeleted', { detail: { id } }));
      }, 10);

      return true;
    } catch (error) {
      console.error('Erreur suppression courrier:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Chargement initial immédiat
    fetchMails();

    // Écouter les changements dans le localStorage
    const handleStorageChange = (event) => {
      console.log('Événement storage détecté pour type:', type, event); // Debug
      fetchMails();
    };

    const handleCourriersUpdated = (event) => {
      console.log('Événement courriersUpdated détecté pour type:', type, event?.detail); // Debug
      fetchMails();
    };

    const handleCourriersAdded = (event) => {
      console.log('Nouveau courrier ajouté:', event.detail, 'pour type:', type);
      // Vérifier si le courrier ajouté correspond au type actuel
      if (event.detail && event.detail.type === (type === "arrive" ? "ARRIVE" : "DEPART")) {
        fetchMails();
      }
    };

    // Écouter plusieurs types d'événements
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('courriersUpdated', handleCourriersUpdated);
    window.addEventListener('courriersAdded', handleCourriersAdded);
    window.addEventListener('focus', handleStorageChange);
    window.addEventListener('visibilitychange', handleStorageChange);

    // Vérifier périodiquement les changements (plus fréquent pour assurer la synchronisation)
    const interval = setInterval(() => {
      console.log('Vérification périodique pour type:', type); // Debug
      fetchMails();
    }, 3000); // Vérifier toutes les 3 secondes

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('courriersUpdated', handleCourriersUpdated);
      window.removeEventListener('courriersAdded', handleCourriersAdded);
      window.removeEventListener('focus', handleStorageChange);
      window.removeEventListener('visibilitychange', handleStorageChange);
      clearInterval(interval);
    };
  }, [type]);

  // Chargement initial au montage du composant
  useEffect(() => {
    fetchMails();
  }, []);

  // Forcer le rafraîchissement quand la page devient visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchMails();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return {
    mails,
    loading,
    addMail,
    updateMail,
    deleteMail,
    refresh: fetchMails
  };
}