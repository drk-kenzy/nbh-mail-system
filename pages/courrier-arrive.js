
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

  // Charger les courriers depuis l'API
  useEffect(() => {
    fetchMails();
  }, []);

  const fetchMails = async () => {
    try {
      const response = await fetch('/api/courrier-arrive');
      if (response.ok) {
        const data = await response.json();
        console.log('Courriers chargés:', data); // Debug log
        setMails(data || []);
      } else {
        console.error('Erreur lors du chargement des courriers:', response.status);
        setMails([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des courriers:', error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMail = (newMail) => {
    setMails(prev => [newMail, ...prev]);
    setOpen(false);
  };

  const handleRemove = (id) => {
    setMails(prev => prev.filter(mail => mail.id !== id));
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
          <h1 className="text-2xl font-bold mb-6">Courriers Arrivés</h1>
          <div className="text-center text-gray-400 py-4">Chargement des courriers...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Courriers Arrivés</h1>
        <AddCourierButton onClick={() => setOpen(o => !o)} open={open} />
        
        {open && (
          <CourrierForm 
            type="ARRIVE" 
            onClose={() => setOpen(false)}
            onAddMail={handleAddMail}
          />
        )}
        
        <div className="mt-8">
          <MailTable
            mails={mails}
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
