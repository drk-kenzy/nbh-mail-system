
import { useState, useRef, useEffect } from 'react';
import CourrierForm from './CourrierForm.jsx';
import MailTable from './MailTable';
import { useToast } from './ToastContext';
import AddCourierButton from './AddCourierButton';

export default function CourrierDepartForm() {
  const [courriers, setCourriers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourrier, setEditingCourrier] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Charger les courriers depuis l'API
  useEffect(() => {
    loadCourriers();
    
    // Écouter les événements de mise à jour
    const handleStorageUpdate = () => {
      loadCourriers();
    };
    
    window.addEventListener('courriersUpdated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    
    return () => {
      window.removeEventListener('courriersUpdated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const loadCourriers = async () => {
    try {
      const response = await fetch('/api/courrier-depart');
      if (response.ok) {
        const data = await response.json();
        setCourriers(data || []);
        console.log('Courriers départs chargés:', data);
      }
    } catch (error) {
      console.error('Erreur chargement courriers:', error);
      addToast('Erreur lors du chargement des courriers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourrier = async (newCourrier) => {
    setCourriers(prev => [newCourrier, ...prev]);
    setShowForm(false);
    setEditingCourrier(null);
    addToast('Courrier ajouté avec succès', 'success');
    
    // Déclencher l'événement pour synchroniser avec les autres composants
    window.dispatchEvent(new CustomEvent('courriersUpdated', { detail: { type: 'depart' } }));
  };

  const handleEditCourrier = (courrier) => {
    setEditingCourrier(courrier);
    setShowForm(true);
  };

  const handleUpdateCourrier = async (updatedCourrier) => {
    setCourriers(prev => prev.map(c => c.id === updatedCourrier.id ? updatedCourrier : c));
    setShowForm(false);
    setEditingCourrier(null);
    addToast('Courrier modifié avec succès', 'success');
    
    // Déclencher l'événement pour synchroniser
    window.dispatchEvent(new CustomEvent('courriersUpdated', { detail: { type: 'depart' } }));
  };

  const handleDeleteCourrier = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce courrier ?')) return;

    try {
      const response = await fetch(`/api/courrier-depart?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setCourriers(prev => prev.filter(c => c.id !== id));
        addToast('Courrier supprimé avec succès', 'success');
        
        // Déclencher l'événement pour synchroniser
        window.dispatchEvent(new CustomEvent('courriersUpdated', { detail: { type: 'depart' } }));
      }
    } catch (error) {
      addToast('Erreur lors de la suppression', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courriers Départ</h1>
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
          type="DEPART"
          initialValues={editingCourrier}
          onAddMail={editingCourrier ? handleUpdateCourrier : handleAddCourrier}
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
