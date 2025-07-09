
import { useState } from 'react';
import { PlusIcon, UserGroupIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const PARTENAIRES_MOCK = [
  { id: 1, nom: 'Direction Générale', type: 'Partenaire', email: 'dg@entreprise.com', statut: 'Actif', secteur: 'Administration', contact: 'Mme Martin', tel: '+33 1 23 45 67 89', ville: 'Paris', pays: 'France', notes: '', courriers: 12, dernierContact: '2025-06-30' },
  { id: 2, nom: 'Fournisseur ABC Informatique', type: 'Fournisseur', email: 'contact@abc.com', statut: 'Actif', secteur: 'Informatique', contact: 'M. Dupont', tel: '+33 6 12 34 56 78', ville: 'Lyon', pays: 'France', notes: '', courriers: 5, dernierContact: '2025-06-28' },
  { id: 3, nom: 'Client Premium SARL', type: 'Client', email: 'premium@client.com', statut: 'Inactif', secteur: 'Services', contact: 'Mme Leroy', tel: '+33 7 98 76 54 32', ville: 'Marseille', pays: 'France', notes: '', courriers: 8, dernierContact: '2025-06-15' },
];

const TYPES = ['Client', 'Fournisseur', 'Consultant', 'Partenaire'];
const STATUTS = ['Actif', 'Inactif', 'Suspendu'];

export default function Partenaires() {
  const [partenaires, setPartenaires] = useState(PARTENAIRES_MOCK);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: '', type: TYPES[0], secteur: '', contact: '', email: '', tel: '', adresse: '', ville: '', codePostal: '', pays: '', statut: STATUTS[0], notes: '', courriers: 0, dernierContact: ''
  });

  const filtered = partenaires.filter(p =>
    (p.nom.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || p.statut === filter)
  );

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ ...p });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('Confirmer la suppression de ce partenaire ?'))
      setPartenaires(ps => ps.filter(p => p.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.type) return;
    if (editId) {
      setPartenaires(ps => ps.map(p => p.id === editId ? { ...form, id: editId } : p));
    } else {
      setPartenaires(ps => [...ps, { ...form, id: Date.now() }]);
    }
    setShowForm(false); 
    setEditId(null); 
    setForm({ nom: '', type: TYPES[0], secteur: '', contact: '', email: '', tel: '', adresse: '', ville: '', codePostal: '', pays: '', statut: STATUTS[0], notes: '', courriers: 0, dernierContact: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header avec titre et bouton */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#15514f] flex items-center gap-3">
              <UserGroupIcon className="w-8 h-8" />
              Partenaires
            </h1>
            <button
              onClick={() => { setShowForm(f => !f); setEditId(null); setForm({ nom: '', type: TYPES[0], secteur: '', contact: '', email: '', tel: '', adresse: '', ville: '', codePostal: '', pays: '', statut: STATUTS[0], notes: '', courriers: 0, dernierContact: '' }); }}
              className="flex items-center gap-2 bg-[#15514f] hover:bg-[#0f3e3c] text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
            >
              <PlusIcon className="w-5 h-5" />
              Nouveau Partenaire
            </button>
          </div>

          {/* Séparateur */}
          <hr className="border-gray-200 mb-6" />

          {/* Zone de recherche et filtre */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="md:w-48">
              <select
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Formulaire d'ajout/édition */}
          {showForm && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#15514f] mb-4">
                {editId ? 'Modifier le partenaire' : 'Nouveau partenaire'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent" 
                  placeholder="Nom/Raison sociale" 
                  value={form.nom} 
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} 
                  required 
                />
                <input 
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent" 
                  placeholder="Contact principal" 
                  value={form.contact} 
                  onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} 
                />
                <select 
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent" 
                  value={form.type} 
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))} 
                  required
                >
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input 
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent" 
                  placeholder="Email" 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                  required 
                />
                <select 
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent" 
                  value={form.statut} 
                  onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}
                >
                  {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input 
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent" 
                  placeholder="Téléphone" 
                  value={form.tel} 
                  onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} 
                />
                <textarea 
                  className="md:col-span-2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent" 
                  placeholder="Notes et commentaires..." 
                  value={form.notes} 
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} 
                  rows={3}
                />
                <div className="md:col-span-2 flex gap-3">
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 bg-[#15514f] hover:bg-[#0f3e3c] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    {editId ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-[#E7FAEB] transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{p.nom}</div>
                        <div className="text-sm text-gray-500">{p.type}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{p.email}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        p.statut === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : p.statut === 'Inactif'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {p.statut}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 text-gray-500 hover:text-[#15514f] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Message si aucun résultat */}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun partenaire trouvé</p>
              <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
