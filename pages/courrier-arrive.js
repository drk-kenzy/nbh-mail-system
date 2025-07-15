
import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout.jsx';
import AddCourierButton from '../components/AddCourierButton.jsx';
import CourrierForm from '../components/CourrierForm.jsx';
import MailTable from '../components/MailTable.js';
import { useMailList } from '../hooks/useMailList.js';

export default function CourrierArrivePage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [displayedMails, setDisplayedMails] = useState([]);
  const [isProgressiveLoad, setIsProgressiveLoad] = useState(false);
  
  // Utiliser le hook useMailList pour gérer les données
  const { mails, loading, addMail, deleteMail } = useMailList('arrive');

  // Gérer l'affichage progressif quand les mails changent
  useEffect(() => {
    if (mails.length > 0) {
      setIsProgressiveLoad(true);
      setDisplayedMails([]);
      
      // Afficher les courriers un par un avec un délai
      mails.forEach((mail, index) => {
        setTimeout(() => {
          setDisplayedMails(prev => [...prev, mail]);
          
          // Terminer l'affichage progressif après le dernier élément
          if (index === mails.length - 1) {
            setTimeout(() => setIsProgressiveLoad(false), 200);
          }
        }, index * 150);
      });
    } else {
      setDisplayedMails([]);
      setIsProgressiveLoad(false);
    }
  }, [mails]);

  const handleAddMail = (newMail) => {
    try {
      addMail(newMail);
      setOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du courrier:', error);
    }
  };

  const handleRemoveMail = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce courrier ?')) {
      try {
        deleteMail(id);
      } catch (error) {
        console.error('Erreur lors de la suppression du courrier:', error);
      }
    }
  };

  const handleViewMail = (mail) => {
    // Afficher les détails du courrier dans une modal ou une nouvelle page
    alert(`Détails du courrier:\n\nObjet: ${mail.objet}\nExpéditeur: ${mail.expediteur}\nDate: ${mail.dateReception || mail.date}\nStatut: ${mail.statut}`);
  };

  const handleEditMail = (mail) => {
    // Ouvrir le formulaire d'édition avec les données du courrier
    setOpen(true);
    // Ici vous pouvez passer les données du courrier au formulaire pour l'édition
    console.log('Édition du courrier:', mail);
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
              onRemove={handleRemoveMail}
              onView={handleViewMail}
              onEdit={handleEditMail}
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
