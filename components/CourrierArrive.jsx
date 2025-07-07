import { useState, useRef, useEffect } from 'react';
import CourrierForm from './CourrierForm.jsx';
import Loader from './Loader';
import MailTable from './MailTable';
import { useMailList } from '../hooks/useMailList';
import { useToast } from './ToastContext';
import AddCourierButton from './AddCourierButton';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

// Composant de détail pour la modale "Voir"
function MailDetailModal({ mail, onClose }) {
  if (!mail) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md mx-auto max-h-[90vh] bg-[#181818] rounded-2xl shadow-2xl p-6 overflow-y-auto border border-primary relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-primary text-xl">✕</button>
        <h2 className="text-lg font-bold mb-4 text-primary">Détail du courrier</h2>
        <div className="space-y-2 text-sm">
          <div><span className="font-semibold text-gray-300">Expéditeur :</span> {mail.expediteur}</div>
          <div><span className="font-semibold text-gray-300">Destinataire :</span> {mail.destinataire}</div>
          <div><span className="font-semibold text-gray-300">Date :</span> {mail.date}</div>
          <div><span className="font-semibold text-gray-300">Statut :</span> {mail.statut}</div>
          {mail.reference && <div><span className="font-semibold text-gray-300">Référence :</span> {mail.reference}</div>}
          {mail.observations && <div><span className="font-semibold text-gray-300">Observations :</span> {mail.observations}</div>}
          {mail.files && mail.files.length > 0 && (
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

export default function CourrierArrive() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [search, setSearch] = useState('');
  const { mails, addMail, removeMail, updateMail } = useMailList('arrive');
  const { addToast } = useToast();
 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Gestion du mode plein écran natif
  const handleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) containerRef.current.requestFullscreen();
      else if (containerRef.current.webkitRequestFullscreen) containerRef.current.webkitRequestFullscreen();
      else if (containerRef.current.msRequestFullscreen) containerRef.current.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Nouveaux états pour la modale de détail/édition
  const [selectedMail, setSelectedMail] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view' ou 'edit'
  // Nouvel état pour l'effet "Nouveau"
  const [lastAddedId, setLastAddedId] = useState(null);

  useEffect(() => {
    if (showForm) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (formRef.current) {
          formRef.current.focus();
        }
      }, 700);
    }
  }, [showForm]);

  const handleRemove = (id) => {
    removeMail(id);
    addToast('Courrier supprimé.', 'success');
  };

  // Callbacks pour MailTable
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
  // Ajout d'un courrier avec effet "Nouveau"
  const handleAddMail = (mail) => {
    addMail(mail);
    setLastAddedId(mail.id);
    setShowForm(false);
    addToast('Nouveau courrier ajouté !', 'success');
  };

  const filteredMails = mails.filter(mail => {
    const q = search.toLowerCase();
    return (
      (mail.objet || mail.subject || '').toLowerCase().includes(q) ||
      (mail.expediteur || mail.sender || '').toLowerCase().includes(q) ||
      (mail.destinataire || '').toLowerCase().includes(q)
    );
  });

  return (
    <div ref={containerRef} className={`relative w-full h-[100dvh] flex flex-col bg-main text-main${isFullscreen ? ' z-[9999]' : ''}`}>
      {/* Bouton flottant en bas à droite */}
      <AddCourierButton onClick={() => setShowForm(f => !f)} open={showForm} />
      <div className="flex items-center justify-between mb-2 md:mb-4 px-4 pt-2 flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent drop-shadow-lg tracking-tight select-none flex items-center gap-2 title-accent">
          📩 Courriers Arrivés
        </h1>
        <button onClick={handleFullscreen} className="ml-2 p-2 rounded hover:bg-gray-700/40 transition" title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}>
          {isFullscreen ? <ArrowsPointingInIcon className="w-6 h-6 text-primary" /> : <ArrowsPointingOutIcon className="w-6 h-6 text-primary" />}
        </button>
      </div>
      {/* Modales */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div 
            className="w-full max-w-3xl max-h-[90vh] bg-[#181818] rounded-2xl shadow-2xl overflow-y-auto border border-primary"
            style={{minHeight:'320px'}}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader label="Ouverture du formulaire..." />
              </div>
            ) : (
              <div 
                tabIndex={-1} 
                ref={formRef} 
                aria-label="Formulaire d'ajout de courrier" 
                className="overflow-visible max-h-[70vh] p-2 md:p-4 w-full"
              >
                <CourrierForm 
                  type="ARRIVE" 
                  onClose={() => setShowForm(false)} 
                  onAddMail={handleAddMail} 
                />
              </div>
            )}
          </div>
        </div>
      )}
      {modalType === 'view' && selectedMail && (
        <MailDetailModal mail={selectedMail} onClose={handleCloseModal} />
      )}
      {modalType === 'edit' && selectedMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md mx-auto max-h-[90vh] bg-[#181818] rounded-2xl shadow-2xl p-4 overflow-y-auto border border-primary relative" style={{minHeight:'320px'}}>
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-400 hover:text-primary text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-primary">Éditer le courrier</h2>
            <CourrierForm type="ARRIVE" onClose={handleCloseModal} onAddMail={handleUpdateMail} initialValues={selectedMail} />
          </div>
        </div>
      )}
      {/*       {/* Conteneur du tableau qui occupe tout l'espace restant */}
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
  ); // Fermeture de la fonction CourrierArrive
}