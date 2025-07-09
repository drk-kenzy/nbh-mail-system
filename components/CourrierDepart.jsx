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

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] flex flex-col bg-main text-main">
      {/* Barre d'outils avec recherche, tri et ajouter */}
      <div className="flex items-center justify-between gap-4 mb-4 px-4 pt-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Trier par</option>
            <option value="date">Date</option>
            <option value="destinataire">Destinataire</option>
            <option value="objet">Objet</option>
            <option value="statut">Statut</option>
          </select>
          <button
            onClick={() => setShowForm(f => !f)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Ajouter un courrier
          </button>
        </div>
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

      {/* Tableau */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-4">
        <MailTable
          mails={filteredMails}
          onRemove={handleRemove}
          search={search}
          setSearch={setSearch}
          onView={handleView}
          onEdit={handleEdit}
          lastAddedId={lastAddedId}
        />
      </div>
    </div>
  );
}
