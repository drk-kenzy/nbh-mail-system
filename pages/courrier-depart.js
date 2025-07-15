
import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout.jsx';
import AddCourierButton from '../components/AddCourierButton.jsx';
import CourrierForm from '../components/CourrierForm.jsx';
import MailTable from '../components/MailTable.js';

export default function CourrierDepartPage() {
  const [open, setOpen] = useState(false);
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [displayedMails, setDisplayedMails] = useState([]);
  const [isProgressiveLoad, setIsProgressiveLoad] = useState(false);

  // Charger les courriers depuis localStorage
  useEffect(() => {
    loadMailsFromStorage();
  }, []);

  const loadMailsFromStorage = () => {
    try {
      const storedMails = JSON.parse(localStorage.getItem('courriers') || '[]');
      const departMails = storedMails.filter(mail => mail.type === 'DEPART');
      
      setMails(departMails);
      
      if (departMails.length > 0) {
        setIsProgressiveLoad(true);
        setDisplayedMails([]);
        
        // Affichage progressif des courriers
        departMails.forEach((mail, index) => {
          setTimeout(() => {
            setDisplayedMails(prev => [...prev, mail]);
            
            // Fin du chargement progressif
            if (index === departMails.length - 1) {
              setTimeout(() => {
                setIsProgressiveLoad(false);
                setLoading(false);
              }, 300);
            }
          }, index * 200); // Délai de 200ms entre chaque courrier
        });
      } else {
        setDisplayedMails([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des courriers:', error);
      setMails([]);
      setDisplayedMails([]);
      setLoading(false);
    }
  };

  const handleAddMail = (newMail) => {
    setMails(prev => [newMail, ...prev]);
    setDisplayedMails(prev => [newMail, ...prev]);
    setOpen(false);
  };

  const handleRemove = (id) => {
    try {
      // Supprimer du localStorage
      const storedMails = JSON.parse(localStorage.getItem('courriers') || '[]');
      const updatedMails = storedMails.filter(mail => mail.id !== id);
      localStorage.setItem('courriers', JSON.stringify(updatedMails));
      
      // Mettre à jour l'état
      setMails(prev => prev.filter(mail => mail.id !== id));
      setDisplayedMails(prev => prev.filter(mail => mail.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleView = (mail) => {
    console.log('Voir courrier:', mail);
  };

  const handleEdit = (mail) => {
    console.log('Éditer courrier:', mail);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">Courriers Départ</h1>
          <div className="text-center text-gray-400 py-4">
            {isProgressiveLoad ? 'Chargement progressif des courriers...' : 'Chargement des courriers...'}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Courriers Départ</h1>
        <AddCourierButton onClick={() => setOpen(o => !o)} open={open} />
        
        {open && (
          <CourrierForm 
            type="DEPART" 
            onClose={() => setOpen(false)}
            onAddMail={handleAddMail}
          />
        )}
        
        <div className="mt-8">
          <MailTable
            mails={displayedMails}
            onRemove={handleRemove}
            search={search}
            setSearch={setSearch}
            onView={handleView}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </MainLayout>
  );
}
