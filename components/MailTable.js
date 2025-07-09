import { useState, useMemo } from 'react';
import { FiSearch, FiMail, FiEye, FiEdit2, FiTrash2, FiInbox, FiCircle } from 'react-icons/fi';

const STATUS_COLORS = {
  'en cours': 'bg-yellow-500/20 text-yellow-400',
  'traité': 'bg-green-500/20 text-green-400',
  'rejeté': 'bg-red-500/20 text-red-400',
  'archivé': 'bg-gray-500/20 text-gray-300',
  'nouveau': 'bg-blue-500/20 text-blue-400',
};

function safeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) return val.map(safeString).join(', ');
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch {
      return '';
    }
  }
  return '';
}

function getStatusClass(status) {
  const str = safeString(status);
  return typeof str === 'string' && STATUS_COLORS[str.toLowerCase()]
    ? STATUS_COLORS[str.toLowerCase()]
    : 'bg-gray-700 text-gray-200';
}

export default function MailTable({ 
  mails = [], 
  onRemove, 
  search, 
  setSearch, 
  onView, 
  onEdit, 
  lastAddedId 
}) {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredMails = useMemo(() => {
    if (!search) return mails;
    const searchTerm = search.toLowerCase();
    return mails.filter(mail =>
      Object.values(mail).some(val => {
        const str = safeString(val);
        return typeof str === 'string' && str.toLowerCase().includes(searchTerm);
      })
    );
  }, [mails, search]);

  const sortedMails = useMemo(() => {
    const sorted = [...filteredMails].sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';

      if (sortOrder === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
    return sorted;
  }, [filteredMails, sortBy, sortOrder]);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(sortedMails.length / pageSize));
  const pagedMails = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedMails.slice(start, start + pageSize);
  }, [sortedMails, page, pageSize]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">

      {/* Tableau principal - Version Desktop */}
      <div className="hidden md:block flex-1 border border-gray-700 rounded-lg overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left w-[12%] border-b border-gray-600">N° d'enregistrement</th>
                <th 
                  className="px-4 py-3 text-left w-[12%] border-b border-gray-600 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('date')}
                >
                  Date d'arrivée {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left w-[18%] border-b border-gray-600 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('expediteur')}
                >
                  Expéditeur {sortBy === 'expediteur' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left w-[18%] border-b border-gray-600 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('destinataire')}
                >
                  Destinataire {sortBy === 'destinataire' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left flex-1 min-w-[200px] border-b border-gray-600 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('objet')}
                >
                  Objet {sortBy === 'objet' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left w-[12%] border-b border-gray-600">Canal</th>
                <th 
                  className="px-4 py-3 text-left w-[12%] border-b border-gray-600 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('statut')}
                >
                  Statut {sortBy === 'statut' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left w-[16%] border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedMails.length > 0 ? (
                pagedMails.map((mail) => (
                  <tr key={mail.id} className="hover:bg-gray-800/30 border-b border-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap">{safeString(mail.numero)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(mail.date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap truncate max-w-[180px]">{safeString(mail.expediteur || mail.sender)}</td>
                    <td className="px-4 py-3 whitespace-nowrap truncate max-w-[180px]">{safeString(mail.destinataire || mail.recipient)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FiMail className="text-primary w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{safeString(mail.objet || mail.subject)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{safeString(mail.canal || mail.channel)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(mail.statut || mail.status)}`}>
                        <FiCircle className="mr-1.5 h-2 w-2" />
                        {safeString(mail.statut || mail.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        <button 
                          onClick={() => onView?.(mail)}
                          className="p-1.5 hover:bg-gray-700/50 rounded transition"
                          title="Voir"
                        >
                          <FiEye className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => onEdit?.(mail)}
                          className="p-1.5 hover:bg-gray-700/50 rounded transition"
                          title="Éditer"
                        >
                          <FiEdit2 className="w-4 h-4 text-yellow-400" />
                        </button>
                        {onRemove && (
                          <button
                            onClick={() => onRemove(mail.id)}
                            className="p-1.5 hover:bg-gray-700/50 rounded transition"
                            title="Supprimer"
                          >
                            <FiTrash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
                      <FiInbox className="w-12 h-12 text-primary animate-pulse" />
                      <p className="text-lg font-medium">Aucun courrier trouvé</p>
                      <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="mt-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                      >
                        Ajouter un courrier
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Version Mobile */}
      <div className="md:hidden space-y-3">
        {pagedMails.length > 0 ? (
          pagedMails.map((mail) => (
            <div key={mail.id} className="border border-gray-700 p-4 rounded-lg bg-gray-800/50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <FiMail className="text-primary w-4 h-4" />
                  <span className="font-medium truncate">{safeString(mail.objet || mail.subject)}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusClass(mail.statut || mail.status)}`}>
                  {safeString(mail.statut || mail.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                <div>
                  <p className="text-gray-400">Expéditeur</p>
                  <p className="truncate">{safeString(mail.expediteur || mail.sender)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Date</p>
                  <p>{formatDate(mail.date)}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => onView?.(mail)} className="p-1.5 text-blue-400">
                  <FiEye className="w-4 h-4" />
                </button>
                <button onClick={() => onEdit?.(mail)} className="p-1.5 text-yellow-400">
                  <FiEdit2 className="w-4 h-4" />
                </button>
                {onRemove && (
                  <button onClick={() => onRemove(mail.id)} className="p-1.5 text-red-400">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <FiInbox className="w-12 h-12 mx-auto text-primary mb-4" />
            <p className="text-lg font-medium">Aucun courrier trouvé</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {sortedMails.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <div className="text-sm text-gray-400">
            {pageSize * (page - 1) + 1}-{Math.min(page * pageSize, sortedMails.length)} sur {sortedMails.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition"
            >
              Précédent
            </button>
            <span className="px-4 py-2 text-sm">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-800 transition"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}