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

      // Déclencher l'événement pour les autres composants
      window.dispatchEvent(new CustomEvent('courriersUpdated'));

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

      // Déclencher l'événement pour les autres composants
      window.dispatchEvent(new CustomEvent('courriersUpdated'));

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
    const handleStorageChange = () => {
      console.log('Événement de mise à jour détecté'); // Debug
      fetchMails();
    };

    // Écouter plusieurs types d'événements
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('courriersUpdated', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    // Vérifier périodiquement les changements (moins fréquent)
    const interval = setInterval(fetchMails, 10000); // Vérifier toutes les 10 secondes

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('courriersUpdated', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
      clearInterval(interval);
    };
  }, [type]);

  // Chargement initial au montage du composant
  useEffect(() => {
    fetchMails();
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