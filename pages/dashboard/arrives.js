import { useMemo, useState } from 'react';
import { useMailList } from '../../hooks/useMailList';
import MailTable from '../../components/MailTable';
import { FiArrowDownCircle } from 'react-icons/fi';

export default function CourriersArrivesPage() {
  const { mails, removeMail } = useMailList('arrive');
  const [search, setSearch] = useState('');
  const [selectedMail, setSelectedMail] = useState(null);
  const [modalType, setModalType] = useState(null);

  const filtered = useMemo(() => mails.filter(mail =>
    (!search || (mail.objet || '').toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => new Date(b.date) - new Date(a.date)), [mails, search]);

  const handleView = mail => { setSelectedMail(mail); setModalType('view'); };
  const handleEdit = mail => { setSelectedMail(mail); setModalType('edit'); };
  const handleCloseModal = () => { setSelectedMail(null); setModalType(null); };
  const handleRemove = id => removeMail(id);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-2 md:px-0">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
        <FiArrowDownCircle className="text-primary" /> Courriers Arrivés
      </h1>
      <input
        type="text"
        className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner backdrop-blur-md transition-all duration-200 text-sm"
        placeholder="Rechercher par objet..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Rechercher un courrier arrivé"
      />
      <MailTable
        mails={filtered}
        onRemove={handleRemove}
        search={search}
        setSearch={setSearch}
        onView={handleView}
        onEdit={handleEdit}
      />
      {/* Modale de détail/édition à ajouter si besoin */}
    </div>
  );
}
