
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
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      mail.objet?.toLowerCase().includes(searchLower) ||
      mail.expediteur?.toLowerCase().includes(searchLower) ||
      mail.numero?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Courrier Arrivé</h1>
          <AddCourierButton onClick={() => setOpen(true)} />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un courrier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des courriers...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <MailTable 
              mails={filteredMails} 
              onRemoveMail={handleRemoveMail}
              isProgressiveLoad={isProgressiveLoad}
            />
          </div>
        )}

        <CourrierForm
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleAddMail}
          type="ARRIVE"
        />
      </div>
    </MainLayout>
  );
}
