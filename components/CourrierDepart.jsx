import { useState, useRef } from 'react';
import CourrierForm from './CourrierForm.jsx';
import MailTable from './MailTable';
import { useMailList } from '../hooks/useMailList';
import { useToast } from './ToastContext';
import AddCourierButton from './AddCourierButton';
// ⛔️ Import plein écran supprimé
// import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

function MailDetailModal({ mail, onClose }) {
  if (!mail) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md mx-auto max-h-[90vh] bg-[#181818] rounded-xl shadow-lg p-5 overflow-y-auto border border-primary relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-primary text-xl">✕</button>
        <h2 className="text-lg font-bold mb-4 text-primary">Détail du courrier</h2>
        <div className="space-y-2 text-sm">
          <div><span className="font-semibold text-gray-300">Objet :</span> {mail.objet}</div>
          <div><span className="font-semibold text-gray-300">Destinataire :</span> {mail.destinataire}</div>
          <div><span className="font-semibold text-gray-300">Service :</span> {mail.service}</div>
          <div><span className="font-semibold text-gray-300">Date :</span> {mail.date}</div>
          <div><span className="font-semibold text-gray-300">Statut :</span> {mail.statut}</div>
          {mail.reference && <div><span className="font-semibold text-gray-300">Référence :</span> {mail.reference}</div>}
          {mail.observations && <div><span className="font-semibold text-gray-300">Observations :</span> {mail.observations}</div>}
          {mail.files?.length > 0 && (
            <div>
              <span className="font-semibold text-gray-300">Fichiers :</span>
              <ul className="list-disc ml-5">
                {mail.files.map((f, i) => <li key={i}>{f.name || f}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CourrierDepart() {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);
  const [search, setSearch] = useState('');
  const { mails, addMail, removeMail, updateMail } = useMailList('depart');
  const { addToast } = useToast();
  const containerRef = useRef(null);
  // ⛔️ Etat plein écran supprimé
  // const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  // ⛔️ useEffect plein écran supprimé

  // ⛔️ Fonction handleFullscreen supprimée

  const handleView = (mail) => {
    setSelectedMail(mail);
    setModalType('view');
  };

  const handleEdit = (mail) => {
    setSelectedMail(mail);
    setModalType('edit');
  };

  const handleCloseModal = () => {
    setSelectedMail(null);
    setModalType(null);
  };

  const handleUpdateMail = (updatedMail) => {
    updateMail(updatedMail);
    addToast('Courrier modifié.', 'success');
    handleCloseModal();
  };

  const handleAddMail = (mail) => {
    addMail(mail);
    setLastAddedId(mail.id);
    setShowForm(false);
    addToast('Nouveau courrier ajouté !', 'success');
  };

  const handleRemove = (id) => {
    removeMail(id);
    addToast('Courrier supprimé.', 'success');
  };

  const filteredMails = mails.filter(mail => {
    const q = search.toLowerCase();
    return (
      (mail.objet || '').toLowerCase().includes(q) ||
      (mail.destinataire || '').toLowerCase().includes(q) ||
      (mail.service || '').toLowerCase().includes(q)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'en attente': return 'bg-yellow-500/20 text-yellow-400';
      case 'en cours': return 'bg-blue-500/20 text-blue-400';
      case 'traité': return 'bg-green-500/20 text-green-400';
      case 'archivé': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] flex flex-col bg-main text-main">
      

      {/* Nouvelle barre d'outils avec recherche, tri et bouton ajouter */}
      <div className="flex items-center justify-between gap-4 mb-4 px-4 pt-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              className="w-full pl-4 pr-4 py-2 bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="bg-gray-800/80 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Trier par</option>
            <option value="date">Date</option>
            <option value="destinataire">Destinataire</option>
            <option value="statut">Statut</option>
          </select>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap"
        >
          Ajouter un courrier
        </button>
      </div>

      {/* Formulaire immédiat */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2">
          <div className="w-full max-w-md bg-[#181818] rounded-xl shadow-lg overflow-y-auto border border-primary" style={{ minHeight: '250px', maxHeight: '85vh' }}>
            <div
              tabIndex={-1}
              ref={formRef}
              aria-label="Formulaire d'ajout de courrier"
              className="p-3"
            >
              <CourrierForm
                type="DEPART"
                onClose={() => setShowForm(false)}
                onAddMail={handleAddMail}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      {modalType === 'view' && selectedMail && (
        <MailDetailModal mail={selectedMail} onClose={handleCloseModal} />
      )}

      {modalType === 'edit' && selectedMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md mx-auto max-h-[90vh] bg-[#181818] rounded-xl shadow-lg p-4 overflow-y-auto border border-primary relative" style={{ minHeight: '320px' }}>
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-400 hover:text-primary text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-primary">Éditer le courrier</h2>
            <CourrierForm
              type="DEPART"
              onClose={handleCloseModal}
              onAddMail={handleUpdateMail}
              initialValues={selectedMail}
            />
          </div>
        </div>
      )}

      {/* Tableau simplifié */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-white">Date d'arrivée</th>
                <th className="px-4 py-3 text-left text-white">Expéditeur</th>
                <th className="px-4 py-3 text-left text-white">N° d'enregistrement</th>
                <th className="px-4 py-3 text-left text-white">Destinataire</th>
                <th className="px-4 py-3 text-left text-white">Objet</th>
                <th className="px-4 py-3 text-left text-white">Canal</th>
                <th className="px-4 py-3 text-left text-white">Statut</th>
                <th className="px-4 py-3 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMails.length > 0 ? (
                filteredMails.map((mail) => (
                  <tr key={mail.id} className="hover:bg-gray-800/30 border-b border-gray-700">
                    <td className="px-4 py-3 text-white">{formatDate(mail.date)}</td>
                    <td className="px-4 py-3 text-white">{mail.expediteur || mail.emetteur}</td>
                    <td className="px-4 py-3 text-white">{mail.numero || mail.id}</td>
                    <td className="px-4 py-3 text-white">{mail.destinataire}</td>
                    <td className="px-4 py-3 text-white">{mail.objet}</td>
                    <td className="px-4 py-3 text-white">{mail.canal}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(mail.statut)}`}>
                        {mail.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(mail)} className="text-blue-400 hover:text-blue-300" title="Voir">👁</button>
                        <button onClick={() => handleEdit(mail)} className="text-yellow-400 hover:text-yellow-300" title="Éditer">✏️</button>
                        <button onClick={() => handleRemove(mail.id)} className="text-red-400 hover:text-red-300" title="Supprimer">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    Aucun courrier trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
