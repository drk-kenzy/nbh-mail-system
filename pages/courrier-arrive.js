import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout.jsx';
import AddCourierButton from '../components/AddCourierButton.jsx';
import CourrierForm from '../components/CourrierForm.jsx';
import MailTable from '../components/MailTable.js';
import { useMailList } from '../hooks/useMailList.js';
import { ensureMailSync } from '../utils/mailSyncUtils.js';
import { MailModalDetail } from '../components/MailModal.jsx';

export default function CourrierArrivePage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [displayedMails, setDisplayedMails] = useState([]);
  const [isProgressiveLoad, setIsProgressiveLoad] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Utiliser le hook useMailList pour gérer les données
  const { mails, loading, addMail, deleteMail, updateMail, updateStatus } = useMailList('arrive');

  // Gérer l'affichage immédiat des courriers
  useEffect(() => {
    // Afficher immédiatement tous les courriers sans animation
    setDisplayedMails(mails);
    setIsProgressiveLoad(false);
  }, [mails]);

  // Forcer la synchronisation au chargement de la page
  useEffect(() => {
    // Assurer la synchronisation au chargement
    ensureMailSync();
  }, []);

  // Ajouter un listener supplémentaire pour forcer le rafraîchissement
  useEffect(() => {
    const handleGlobalRefresh = () => {
      console.log('Rafraîchissement global déclenché pour courrier arrivé');
      // Le hook useMailList va automatiquement se mettre à jour
    };

    window.addEventListener('courriersGlobalRefresh', handleGlobalRefresh);

    return () => {
      window.removeEventListener('courriersGlobalRefresh', handleGlobalRefresh);
    };
  }, []);

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

  const [editingMail, setEditingMail] = useState(null);

  const handleViewMail = (mail) => {
    setSelectedMail(mail);
    setViewModalOpen(true);
  };

  const handleEditMail = (mail) => {
    setEditingMail(mail);
    setOpen(true);
  };

  const handleUpdateMail = async (updatedData) => {
    try {
      await updateMail(editingMail.id, updatedData);
      setOpen(false);
      setEditingMail(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du courrier:', error);
    }
  };

  const handleStatusUpdate = async (mailId, statusData) => {
    try {
      await updateStatus(mailId, statusData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
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
              onRemove={handleRemoveMail}
              onView={handleViewMail}
              onEdit={handleEditMail}
              onStatusUpdate={handleStatusUpdate}
              isProgressiveLoad={isProgressiveLoad}
            />
          </div>
        )}

        <CourrierForm
          open={open}
          onClose={() => {
            setOpen(false);
            setEditingMail(null);
          }}
          onSubmit={editingMail ? handleUpdateMail : handleAddMail}
          type="ARRIVE"
          initialValues={editingMail}
        />

        {/* Modal de visualisation */}
        {viewModalOpen && selectedMail && (
          <MailModalDetail
            mail={selectedMail}
            onClose={() => {
              setViewModalOpen(false);
              setSelectedMail(null);
            }}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </MainLayout>
  );
}