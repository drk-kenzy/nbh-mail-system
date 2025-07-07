import { useState } from 'react';
import MainLayout from '../components/MainLayout.jsx';
import AddCourierButton from '../components/AddCourierButton.jsx';
import CourrierForm from '../components/CourrierForm.jsx';
import MOCK_MAILS from '../data/mails.js';

export default function CourrierArrivePage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  // Filtrer uniquement les courriers arrivés (numero commence par ARR)
  const mails = MOCK_MAILS.filter(m => m.numero.startsWith('ARR'));
  const filteredMails = mails.filter(mail => {
    const q = search.toLowerCase();
    return (
      (mail.objet || '').toLowerCase().includes(q) ||
      (mail.partenaire || '').toLowerCase().includes(q)
    );
  });
  return (
    <MainLayout>
      <div className="relative max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-primary to-indigo-700 bg-clip-text text-transparent drop-shadow-lg tracking-tight select-none">
          📩 Courriers Arrivés
        </h1>
        <AddCourierButton onClick={() => setOpen(o => !o)} open={open} />
        {open && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl mx-auto">
              <CourrierForm type="ARRIVE" onClose={() => setOpen(false)} />
            </div>
          </div>
        )}
        <input
          type="text"
          className="w-full mb-6 px-4 py-2 rounded-xl bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner backdrop-blur-md transition-all duration-200"
          placeholder="Rechercher par objet ou partenaire..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Rechercher un courrier"
        />
        <div className="mt-6 rounded-2xl shadow-2xl bg-gradient-to-br from-[#181818] via-[#232347] to-[#181818] border border-gray-800 backdrop-blur-lg p-6">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 to-transparent border-b border-gray-700">
                <th className="px-3 py-2 font-semibold text-primary">N°</th>
                <th className="px-3 py-2 font-semibold text-primary">Objet</th>
                <th className="px-3 py-2 font-semibold text-primary">Partenaire</th>
                <th className="px-3 py-2 font-semibold text-primary">Statut</th>
                <th className="px-3 py-2 font-semibold text-primary">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredMails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6 italic">Aucun courrier arrivé.</td>
                </tr>
              ) : filteredMails.map(mail => (
                <tr key={mail.id} className="border-b border-gray-800 hover:bg-primary/5 transition group">
                  <td className="px-3 py-2 font-mono text-xs text-gray-300 group-hover:text-primary">{mail.numero}</td>
                  <td className="px-3 py-2 font-semibold text-gray-100 group-hover:text-primary">{mail.objet}</td>
                  <td className="px-3 py-2 text-gray-200 group-hover:text-primary">{mail.partenaire}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${
                      mail.statut === 'Traité' ? 'bg-green-700/80 text-green-200' :
                      mail.statut === 'En attente' ? 'bg-yellow-700/80 text-yellow-200' :
                      mail.statut === 'En cours' ? 'bg-blue-700/80 text-blue-200' :
                      'bg-gray-700/80 text-gray-300'
                    }`}>
                      {mail.statut}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-400 group-hover:text-primary">{mail.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
