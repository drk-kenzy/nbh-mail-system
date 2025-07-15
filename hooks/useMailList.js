
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
      setMails(filteredCourriers);
    } catch (error) {
      console.error("Erreur lors du chargement des courriers:", error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMails();
    
    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      fetchMails();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('courriersUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('courriersUpdated', handleStorageChange);
    };
  }, [type]);

  const addMail = (mail) => {
    try {
      const existingCourriers = JSON.parse(localStorage.getItem('courriers') || '[]');
      const newMail = {
        ...mail,
        id: Date.now(),
        type: type === "arrive" ? "ARRIVE" : "DEPART",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedCourriers = [newMail, ...existingCourriers];
      localStorage.setItem('courriers', JSON.stringify(updatedCourriers));
      
      // Déclencher l'événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('courriersUpdated'));
      
      setMails(prev => [newMail, ...prev]);
      return newMail;
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
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
      const existingCourriers = JSON.parse(localStorage.getItem('courriers') || '[]');
      const updatedCourriers = existingCourriers.filter(courrier => courrier.id !== id);
      localStorage.setItem('courriers', JSON.stringify(updatedCourriers));
      
      // Déclencher l'événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('courriersUpdated'));
      
      setMails(prev => prev.filter(mail => mail.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      throw error;
    }
  };

  return {
    mails,
    loading,
    addMail,
    updateMail,
    deleteMail,
    refetch: fetchMails
  };
}
