import { useState, useRef, useEffect } from 'react';
import CourrierForm from './CourrierForm.jsx';
import MailTable from './MailTable';
import { useToast } from './ToastContext';
import AddCourierButton from './AddCourierButton';

export default function CourrierArriveForm() {
  const [courriers, setCourriers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourrier, setEditingCourrier] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Charger les courriers depuis l'API
  useEffect(() => {
    loadCourriers();
  }, []);

  const loadCourriers = async () => {
    try {
      const response = await fetch('/api/courrier?type=ARRIVE');
      if (response.ok) {
        const data = await response.json();
        setCourriers(data);
      }
    } catch (error) {
      console.error('Erreur chargement courriers:', error);
      addToast('Erreur lors du chargement des courriers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourrier = (newCourrier) => {
    setCourriers(prev => [newCourrier, ...prev]);
    setShowForm(false);
    setEditingCourrier(null);
  };

  const handleEditCourrier = (courrier) => {
    setEditingCourrier(courrier);
    setShowForm(true);
  };

  const handleDeleteCourrier = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce courrier ?')) return;
    
    try {
      const response = await fetch(`/api/courrier?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setCourriers(prev => prev.filter(c => c.id !== id));
        addToast('Courrier supprimé avec succès', 'success');
      }
    } catch (error) {
      addToast('Erreur lors de la suppression', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courriers Arrivés</h1>
        <AddCourierButton 
          onClick={() => {
            setEditingCourrier(null);
            setShowForm(true);
          }} 
          open={showForm} 
        />
      </div>

      {showForm && (
        <CourrierForm
          type="ARRIVE"
          initialValues={editingCourrier}
          onAddMail={handleAddCourrier}
          onClose={() => {
            setShowForm(false);
            setEditingCourrier(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow">
        <MailTable
          mails={courriers}
          onEdit={handleEditCourrier}
          onDelete={handleDeleteCourrier}
          loading={loading}
        />
      </div>
    </div>
  );
}

function MailDetailModal({ mail, onClose }) {
  if (!mail) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md mx-auto max-h-[90vh] bg-[#FCFCFC] rounded-xl shadow-lg p-5 overflow-y-auto border border-primary relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-primary text-xl">✕</button>
        <h2 className="text-lg font-bold mb-4 text-primary">Détail du courrier</h2>
        <div className="space-y-2 text-sm text-gray-800">
          <div><span className="font-semibold text-gray-900">Expéditeur :</span> {mail.expediteur}</div>
          <div><span className="font-semibold text-gray-900">Destinataire :</span> {mail.destinataire}</div>
          <div><span className="font-semibold text-gray-900">Date :</span> {mail.date}</div>
          <div><span className="font-semibold text-gray-900">Statut :</span> {mail.statut}</div>
          {mail.reference && <div><span className="font-semibold text-gray-900">Référence :</span> {mail.reference}</div>}
          {mail.observations && <div><span className="font-semibold text-gray-900">Observations :</span> {mail.observations}</div>}
          {mail.fichiers?.length > 0 && (
            <div>
              <span className="font-semibold text-gray-900">Fichiers :</span>
              <ul className="list-disc ml-5">
                {mail.fichiers.map((f, i) => <li key={i}>{f.name || f}</li>)}
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
  const formRef = useRef(null);
  const [search, setSearch] = useState('');
  const [mails, setMails] = useState([]);
  const { addToast } = useToast();
  const containerRef = useRef(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  // Charger tous les courriers
  useEffect(() => {
    fetch('/api/courrier-arrive')
      .then(res => res.json())
      .then(data => setMails(data))
      .catch(() => addToast("Erreur lors du chargement", "error"));
  }, []);

  // Ajouter un courrier
  const handleAddMail = async (mail) => {
    try {
      const res = await fetch('/api/courrier-arrive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mail)
      });
      const newMail = await res.json();
      setMails(mails => [newMail, ...mails]);
      setLastAddedId(newMail.id);
      setShowForm(false);
      addToast('Nouveau courrier ajouté !', 'success');
    } catch (err) {
      addToast("Erreur lors de l'ajout", 'error');
    }
  };

  // Supprimer un courrier
  const handleRemove = async (id) => {
    try {
      await fetch(`/api/courrier-arrive?id=${id}`, { method: 'DELETE' });
      setMails(mails => mails.filter(mail => mail.id !== id));
      addToast('Courrier supprimé.', 'success');
    } catch (err) {
      addToast("Erreur lors de la suppression", 'error');
    }
  };

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
    setMails(mails => mails.map(mail => mail.id === updatedMail.id ? updatedMail : mail));
    addToast('Courrier modifié.', 'success');
    handleCloseModal();
  };

  const filteredMails = mails.filter(mail => {
    const q = search.toLowerCase();
    return (
      (mail.objet || '').toLowerCase().includes(q) ||
      (mail.expediteur || '').toLowerCase().includes(q) ||
      (mail.destinataire || '').toLowerCase().includes(q)
    );
  });

  // Récupérer les partenaires actifs depuis la base de données
const getActivePartners = async () => {
  try {
    const response = await fetch('/api/partenaires');
    const partenaires = await response.json();
    return partenaires.filter(p => p.statut === 'Actif').map(p => p.nom);
  } catch (error) {
    console.error('Erreur lors de la récupération des partenaires:', error);
    return [];
  }
};

  return (
    <div ref={containerRef} className="relative w-full h-[100dvh] flex flex-col bg-main text-main">
      {/* Titre avec logo */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-[#15514f] flex items-center gap-3">
          <span className="text-3xl">📥</span>
          Courrier Arrivée
        </h1>
      </div>

      {/* Barre d'outils */}
      <div className="flex items-center gap-4 mb-4 px-2">
        <input
          type="text"
          placeholder="Rechercher par objet, expéditeur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 bg-[#FCFCFC] border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#15514f] shadow-sm"
          style={{ marginLeft: '0' }}
        />
        <select className="px-4 py-3 bg-[#FCFCFC] border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#15514f] shadow-sm min-w-[140px]">
          <option value="">Trier par</option>
          <option value="date">Date</option>
          <option value="expediteur">Expéditeur</option>
          <option value="objet">Objet</option>
          <option value="statut">Statut</option>
        </select>
        <button
          onClick={() => setShowForm(f => !f)}
          className="px-6 py-3 bg-[#15514f] text-white rounded-lg hover:bg-[#0f3e3c] transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
        >
          <span>➕</span>
          Ajouter un nouveau courrier arrivé
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2">
          <div className="w-full max-w-md bg-[#FCFCFC] rounded-xl shadow-lg overflow-y-auto border border-primary" style={{ minHeight: '250px', maxHeight: '80vh' }}>
            <div tabIndex={-1} ref={formRef} aria-label="Formulaire d'ajout de courrier" className="p-3">
              <CourrierForm
                type="ARRIVE"
                onClose={() => setShowForm(false)}
                onAddMail={handleAddMail}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal vue */}
      {modalType === 'view' && selectedMail && (
        <MailDetailModal mail={selectedMail} onClose={handleCloseModal} />
      )}

      {/* Modal édition */}
      {modalType === 'edit' && selectedMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#FCFCFC] rounded-xl shadow-lg p-4 overflow-y-auto border border-primary relative" style={{ minHeight: '320px', maxHeight: '85vh' }}>
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-600 hover:text-primary text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-primary">Éditer le courrier</h2>
            <CourrierForm
              type="ARRIVE"
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