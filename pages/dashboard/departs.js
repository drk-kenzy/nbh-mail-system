
import { useState, useEffect } from 'react';
import { FiArrowUpCircle } from 'react-icons/fi';
import { useMailList } from '../../hooks/useMailList';
import MailTable from '../../components/MailTable';

function handleRemove(id) {
  console.log('Supprimer courrier:', id);
}

function handleView(mail) {
  console.log('Voir courrier:', mail);
}

function handleEdit(mail) {
  console.log('Éditer courrier:', mail);
}

export default function Departs() {
  const { mails, loading } = useMailList('depart');
  const [search, setSearch] = useState('');

  const filteredMails = mails.filter(mail => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      mail.objet?.toLowerCase().includes(searchLower) ||
      mail.destinataire?.toLowerCase().includes(searchLower) ||
      mail.numero?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-6 px-2 md:px-0">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des courriers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-2 md:px-0">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 flex items-center gap-2 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
        <FiArrowUpCircle className="text-green-400" /> Courriers Départs
      </h1>
      <div className="mb-4 text-sm text-gray-400">
        {mails.length} courrier(s) départ(s)
      </div>
      <input
        type="text"
        className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner backdrop-blur-md transition-all duration-200 text-sm"
        placeholder="Rechercher par objet..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Rechercher un courrier départ"
      />
      <MailTable
        mails={filteredMails}
        onRemove={handleRemove}
        search={search}
        setSearch={setSearch}
        onView={handleView}
        onEdit={handleEdit}
      />
    </div>
  );
}
