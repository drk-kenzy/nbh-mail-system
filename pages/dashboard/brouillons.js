import { useMemo } from 'react';
import { useMailList } from '../../hooks/useMailList';
import { FiEdit2 } from 'react-icons/fi';

export default function BrouillonsPage() {
  const { mails: arrives } = useMailList('arrive');
  const { mails: departs } = useMailList('depart');
  const brouillons = useMemo(() => [
    ...arrives.filter(m => m.statut === 'Brouillon'),
    ...departs.filter(m => m.statut === 'Brouillon')
  ].sort((a, b) => new Date(b.date) - new Date(a.date)), [arrives, departs]);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-2 md:px-0">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 flex items-center gap-2 bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
        <FiEdit2 className="text-yellow-400" /> Brouillons
      </h1>
      {brouillons.length === 0 ? (
        <div className="text-gray-400">Aucun brouillon pour le moment.</div>
      ) : (
        <table className="w-full text-sm text-left bg-[#181818] rounded-xl shadow-lg">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-3 py-2">N°</th>
              <th className="px-3 py-2">Objet</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Partenaire</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {brouillons.map(mail => (
              <tr key={mail.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                <td className="px-3 py-2">{mail.numero}</td>
                <td className="px-3 py-2">{mail.objet}</td>
                <td className="px-3 py-2">{mail.type || (mail.numero?.startsWith('ARR') ? 'ARRIVE' : 'DEPART')}</td>
                <td className="px-3 py-2">{mail.expediteur || mail.destinataire}</td>
                <td className="px-3 py-2">{mail.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
