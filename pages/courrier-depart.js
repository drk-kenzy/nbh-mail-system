
import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout.jsx';
import AddCourierButton from '../components/AddCourierButton.jsx';
import CourrierForm from '../components/CourrierForm.jsx';
import MailTable from '../components/MailTable.js';
import { useMailList } from '../hooks/useMailList.js';

export default function CourrierDepartPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [displayedMails, setDisplayedMails] = useState([]);
  const [isProgressiveLoad, setIsProgressiveLoad] = useState(false);
  
  // Utiliser le hook useMailList pour gérer les données
  const { mails, loading, addMail, deleteMail } = useMailList('depart');

  // Gérer l'affichage immédiat des courriers
  useEffect(() => {
    // Afficher immédiatement tous les courriers sans animation
    setDisplayedMails(mails);
    setIsProgressiveLoad(false);
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

  const [selectedMail, setSelectedMail] = useState(null);
  const [editingMail, setEditingMail] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

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
          <h1 className="text-2xl font-bold">Courrier Départ</h1>
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
          onClose={() => {
            setOpen(false);
            setEditingMail(null);
          }}
          onSubmit={editingMail ? handleUpdateMail : handleAddMail}
          type="DEPART"
          initialValues={editingMail}
        />

        {/* Modal de visualisation */}
        {viewModalOpen && selectedMail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Détails du Courrier</h2>
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setSelectedMail(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">N° d'enregistrement</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMail.numero || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'envoi</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedMail.dateReception || selectedMail.date ? 
                        new Date(selectedMail.dateReception || selectedMail.date).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expéditeur</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMail.expediteur || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destinataire</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMail.destinataire || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Objet</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMail.objet || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Canal</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMail.canal || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {selectedMail.statut || 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setSelectedMail(null);
                    handleEditMail(selectedMail);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setSelectedMail(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
