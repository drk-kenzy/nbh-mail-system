import { useState, useMemo } from 'react';
import { FiSearch, FiMail, FiEye, FiEdit2, FiTrash2, FiInbox, FiDownload } from 'react-icons/fi';

const STATUS_COLORS = {
  'en cours': 'bg-yellow-500/20 text-yellow-400',
  'traité': 'bg-green-500/20 text-green-400',
  'rejeté': 'bg-red-500/20 text-red-400',
  'archivé': 'bg-gray-500/20 text-gray-300',
  'nouveau': 'bg-blue-500/20 text-blue-400',
  // Ajoutez d'autres statuts si besoin
};

// Fonction utilitaire pour afficher proprement n'importe quelle valeur
function safeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' || typeof val === 'number') return val;
  if (Array.isArray(val)) return val.join(', ');
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

export default function MailTable({ mails, onRemove, search, setSearch, onView, onEdit, lastAddedId }) {
  // Pagination et tri
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Tri et filtrage (exemple simple)
  const sorted = useMemo(() => {
    // Ici, vous pouvez ajouter une logique de tri si besoin
    return mails.filter(mail => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        (mail.objet && mail.objet.toLowerCase().includes(s)) ||
        (mail.subject && mail.subject.toLowerCase().includes(s)) ||
        (mail.expediteur && mail.expediteur.toLowerCase().includes(s)) ||
        (mail.sender && mail.sender.toLowerCase().includes(s)) ||
        (mail.destinataire && mail.destinataire.toLowerCase().includes(s))
      );
    });
  }, [mails, search]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Barre de recherche + Export */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="relative w-full md:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner backdrop-blur-md transition-all duration-200"
            placeholder="Rechercher par objet, expéditeur ou destinataire..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg font-semibold shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition"
          onClick={() => exportToCSV(sorted)}
        >
          <FiDownload className="w-5 h-5" />
          Exporter CSV
        </button>
      </div>

      {/* Tableau étendu avec bordures visibles */}
      <div className="flex-1 overflow-hidden border-2 border-gray-700 rounded-xl">
        <div className="h-full overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left border-b-2 border-gray-700 min-w-[250px]">Objet</th>
                <th className="px-6 py-4 text-left border-b-2 border-gray-700 min-w-[200px]">Expéditeur</th>
                <th className="px-6 py-4 text-left border-b-2 border-gray-700 w-[150px]">Date</th>
                <th className="px-6 py-4 text-left border-b-2 border-gray-700 w-[150px]">Statut</th>
                <th className="px-6 py-4 text-left border-b-2 border-gray-700 w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-400">
                    <div className="flex flex-col items-center gap-4">
                      <FiInbox className="w-12 h-12 text-primary animate-bounce" />
                      <span className="text-xl font-semibold">Aucun courrier trouvé</span>
                      <button 
                        className="mt-4 px-6 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-dark transition font-bold"
                        onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
                      >
                        Ajouter un courrier
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((mail, idx) => (
                  <tr 
                    key={mail.id} 
                    className={`border-b-2 border-gray-700 hover:bg-gray-800/50 transition ${idx % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FiMail className="text-primary w-6 h-6 flex-shrink-0" />
                        <span className="truncate">{safeString(mail.objet || mail.subject)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 truncate">{safeString(mail.expediteur || mail.sender)}</td>
                    <td className="px-6 py-4">{safeString(mail.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[(safeString(mail.statut || mail.status).toLowerCase())] || 'bg-gray-700 text-gray-200'}`}>
                        {safeString(mail.statut || mail.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button 
                          className="text-primary hover:bg-primary/10 p-2 rounded-full transition hover:scale-110"
                          onClick={() => onView && onView(mail)}
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button 
                          className="text-yellow-400 hover:bg-yellow-400/10 p-2 rounded-full transition hover:scale-110"
                          onClick={() => onEdit && onEdit(mail)}
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        {onRemove && (
                          <button
                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-full transition hover:scale-110"
                            onClick={() => onRemove(mail.id)}
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination améliorée */}
      {paged.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4">
          <div className="text-gray-400">
            Affichage {pageSize * (page - 1) + 1}-{Math.min(pageSize * page, mails.length)} sur {mails.length}
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg border-2 border-gray-700 bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700 transition"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Précédent
            </button>
            <div className="flex items-center px-4 py-2 bg-gray-800 rounded-lg border-2 border-gray-700">
              Page {page} / {totalPages}
            </div>
            <button
              className="px-4 py-2 rounded-lg border-2 border-gray-700 bg-gray-800 text-white disabled:opacity-50 hover:bg-gray-700 transition"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}