import Layout from '../../components/Layout';
import MailToolbar from '../../components/MailToolbar';
import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { FiArchive } from 'react-icons/fi';
import { useMailList } from '../../hooks/useMailList';

const MailTable = dynamic(() => import('../../components/MailTable'), { ssr: false, loading: () => <div className="text-center py-8 text-gray-400">Chargement du tableau...</div> });

export default function Archives() {
  const { mails: arrives } = useMailList('arrive');
  const { mails: departs } = useMailList('depart');
  const [search, setSearch] = useState('');
  const archives = useMemo(() => [
    ...arrives.filter(m => m.statut === 'Archivé'),
    ...departs.filter(m => m.statut === 'Archivé')
  ].filter(mail =>
    (!search || (mail.objet || '').toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => new Date(b.date) - new Date(a.date)), [arrives, departs, search]);

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto py-6 px-2 md:px-0">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
          <FiArchive className="text-indigo-400" /> Archives
        </h1>
        <input
          type="text"
          className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner backdrop-blur-md transition-all duration-200 text-sm"
          placeholder="Rechercher par objet..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Rechercher une archive"
        />
        {archives.length === 0 ? (
          <div className="text-gray-400">Aucune archive pour le moment.</div>
        ) : (
          <MailTable mails={archives} />
        )}
      </div>
    </Layout>
  );
}
