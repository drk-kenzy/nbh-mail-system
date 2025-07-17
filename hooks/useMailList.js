import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  arrive: 'courriers_arrive',
  depart: 'courriers_depart'
};

export function useMailList(type) {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = STORAGE_KEYS[type];

  // Charger les données du localStorage au montage
  useEffect(() => {
    loadFromLocalStorage();
  }, [type]);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      const data = stored ? JSON.parse(stored) : [];
      setMails(data);
      console.log(`Courriers ${type} chargés depuis localStorage:`, data);
    } catch (error) {
      console.error('Erreur chargement localStorage:', error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      console.log(`Courriers ${type} sauvegardés dans localStorage:`, data);
    } catch (error) {
      console.error('Erreur sauvegarde localStorage:', error);
    }
  };

  const addMail = (newMail) => {
    const mailWithId = {
      ...newMail,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      type: type.toUpperCase()
    };

    const updatedMails = [mailWithId, ...mails];
    setMails(updatedMails);
    saveToLocalStorage(updatedMails);
    return mailWithId;
  };

  const updateMail = (id, updates) => {
    const updatedMails = mails.map(mail => 
      mail.id === id ? { ...mail, ...updates, updatedAt: new Date().toISOString() } : mail
    );
    setMails(updatedMails);
    saveToLocalStorage(updatedMails);
    return updatedMails.find(mail => mail.id === id);
  };

  const deleteMail = (id) => {
    const updatedMails = mails.filter(mail => mail.id !== id);
    setMails(updatedMails);
    saveToLocalStorage(updatedMails);
  };

  const updateStatus = (id, newStatus) => {
    return updateMail(id, { statut: newStatus });
  };

  return {
    mails,
    loading,
    addMail,
    updateMail,
    deleteMail,
    updateStatus,
    refreshMails: loadFromLocalStorage
  };
}