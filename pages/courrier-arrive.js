
import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout.jsx';
import AddCourierButton from '../components/AddCourierButton.jsx';
import CourrierForm from '../components/CourrierForm.jsx';
import MailTable from '../components/MailTable.js';

export default function CourrierArrivePage() {
  const [open, setOpen] = useState(false);
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [displayedMails, setDisplayedMails] = useState([]);
  const [isProgressiveLoad, setIsProgressiveLoad] = useState(false);

  // Charger les courriers depuis localStorage
  useEffect(() => {
    loadMailsFromStorage();
    
    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      loadMailsFromStorage();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Écouter les changements via un event personnalisé
    window.addEventListener('courriersUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('courriersUpdated', handleStorageChange);
    };
  }, []);

  const loadMailsFromStorage = () => {
    try {
      const courriers = JSON.parse(localStorage.getItem('courriers') || '[]');
      const courriersArrives = courriers.filter(courrier => courrier.type === 'ARRIVE');
      
      setMails(courriersArrives);
      setLoading(false);
      
      // Démarrer l'affichage progressif
      if (courriersArrives.length > 0) {
        setIsProgressiveLoad(true);
        setDisplayedMails([]);
        
        // Afficher les courriers un par un avec un délai
        courriersArrives.forEach((mail, index) => {
          setTimeout(() => {
            setDisplayedMails(prev => [...prev, mail]);
            
            // Terminer l'affichage progressif après le dernier élément
            if (index === courriersArrives.length - 1) {
              setTimeout(() => setIsProgressiveLoad(false), 200);
            }
          }, index * 150);
        });
      } else {
        setDisplayedMails([]);
        setIsProgressiveLoad(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement depuis localStorage:', error);
      setMails([]);
      setDisplayedMails([]);
      setLoading(false);
      setIsProgressiveLoad(false);
    }
  };

  const handleAddMail = (newMail) => {
    try {
      const existingCourriers = JSON.parse(localStorage.getItem('courriers') || '[]');
      const mailWithId = {
        ...newMail,
        id: Date.now(),
        type: 'ARRIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedCourriers = [mailWithId, ...existingCourriers];
      localStorage.setItem('courriers', JSON.stringify(updatedCourriers));
      
      // Déclencher l'événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('courriersUpdated'));
      
      setOpen(false);
      
      // Recharger les données
      loadMailsFromStorage();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du courrier:', error);
    }
  };

  const handleRemoveMail = (id) => {
    try {
      const existingCourriers = JSON.parse(localStorage.getItem('courriers') || '[]');
      const updatedCourriers = existingCourriers.filter(courrier => courrier.id !== id);
      localStorage.setItem('courriers', JSON.stringify(updatedCourriers));
      
      // Déclencher l'événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('courriersUpdated'));
      
      // Recharger les données
      loadMailsFromStorage();
    } catch (error) {
      console.error('Erreur lors de la suppression du courrier:', error);
    }
  };

  const filteredMails = displayedMails.filter(mail => {
    const searchLower = search.toLowerCase();
    return (
      (mail.objet || '').toLowerCase().includes(searchLower) ||
      (mail.expediteur || '').toLowerCase().includes(searchLower) ||
      (mail.destinataire || '').toLowerCase().includes(searchLower) ||
      (mail.numero || '').toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Chargement des courriers...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Courriers Arrivés</h1>
          <AddCourierButton onClick={() => setOpen(true)} open={open} />
        </div>

        {open && (
          <div className="bg-white rounded-lg shadow-lg p-6 border">
            <CourrierForm 
              type="ARRIVE" 
              onClose={() => setOpen(false)} 
              onAddMail={handleAddMail}
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <MailTable
            mails={filteredMails}
            onRemove={handleRemoveMail}
            search={search}
            setSearch={setSearch}
            loading={isProgressiveLoad}
          />
        </div>
      </div>
    </MainLayout>
  );
}
