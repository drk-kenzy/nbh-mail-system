import { useState } from 'react';
import { PlusIcon, UserGroupIcon, PencilSquareIcon, TrashIcon, CheckCircleIcon, UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { FiBriefcase, FiUsers, FiUserCheck, FiMail, FiPhone, FiMapPin, FiMessageCircle, FiEye } from 'react-icons/fi';

const PARTENAIRES_MOCK = [
  { id: 1, nom: 'Direction Générale', type: 'Partenaire', email: 'dg@entreprise.com', statut: 'Actif', secteur: 'Administration', contact: 'Mme Martin', tel: '+33 1 23 45 67 89', ville: 'Paris', pays: 'France', notes: '', courriers: 12, dernierContact: '2025-06-30' },
  { id: 2, nom: 'Fournisseur ABC Informatique', type: 'Fournisseur', email: 'contact@abc.com', statut: 'Actif', secteur: 'Informatique', contact: 'M. Dupont', tel: '+33 6 12 34 56 78', ville: 'Lyon', pays: 'France', notes: '', courriers: 5, dernierContact: '2025-06-28' },
  { id: 3, nom: 'Client Premium SARL', type: 'Client', email: 'premium@client.com', statut: 'Inactif', secteur: 'Services', contact: 'Mme Leroy', tel: '+33 7 98 76 54 32', ville: 'Marseille', pays: 'France', notes: '', courriers: 8, dernierContact: '2025-06-15' },
];
const TYPES = ['Client', 'Fournisseur', 'Consultant', 'Partenaire'];
const STATUTS = ['Actif', 'Inactif', 'Suspendu'];
const TYPE_COLORS = {
  'Client': 'bg-blue-600 text-white',
  'Fournisseur': 'bg-green-600 text-white',
  'Consultant': 'bg-yellow-500 text-white',
  'Partenaire': 'bg-indigo-600 text-white',
};
const STATUT_COLORS = {
  'Actif': 'bg-green-700/80 text-green-200',
  'Inactif': 'bg-gray-700/80 text-gray-300',
  'Suspendu': 'bg-red-700/80 text-red-200',
};

function getInitials(nom) {
  return nom.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

export default function Partenaires() {
  const [partenaires, setPartenaires] = useState(PARTENAIRES_MOCK);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [form, setForm] = useState({
    nom: '', type: TYPES[0], secteur: '', contact: '', email: '', tel: '', adresse: '', ville: '', codePostal: '', pays: '', statut: STATUTS[0], notes: '', courriers: 0, dernierContact: ''
  });

  const filtered = partenaires.filter(p =>
    (p.nom.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || p.type === filter)
  );

  // Statistiques
  const total = partenaires.length;
  const clients = partenaires.filter(p => p.type === 'Client').length;
  const fournisseurs = partenaires.filter(p => p.type === 'Fournisseur').length;
  const actifs = partenaires.filter(p => p.statut === 'Actif').length;

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
    setShowForm(false); setEditId(null); setForm({ nom: '', type: TYPES[0], secteur: '', contact: '', email: '', tel: '', adresse: '', ville: '', codePostal: '', pays: '', statut: STATUTS[0], notes: '', courriers: 0, dernierContact: '' });
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><UserGroupIcon className="w-7 h-7 text-primary" />Partenaires</h1>
      {/* Statistiques */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-[#232347] rounded-xl p-4 flex flex-col items-center min-w-[120px]">
          <span className="text-2xl font-bold text-primary">{total}</span>
          <span className="text-xs text-gray-400">Total</span>
        </div>
        <div className="bg-blue-900 rounded-xl p-4 flex flex-col items-center min-w-[120px]">
          <span className="text-2xl font-bold text-blue-400">{clients}</span>
          <span className="text-xs text-blue-200">Clients</span>
        </div>
        <div className="bg-green-900 rounded-xl p-4 flex flex-col items-center min-w-[120px]">
          <span className="text-2xl font-bold text-green-400">{fournisseurs}</span>
          <span className="text-xs text-green-200">Fournisseurs</span>
        </div>
        <div className="bg-green-800 rounded-xl p-4 flex flex-col items-center min-w-[120px]">
          <span className="text-2xl font-bold text-green-200">{actifs}</span>
          <span className="text-xs text-green-100">Actifs</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          className="px-3 py-2 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-primary"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">Tous types</option>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <button
          className="flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-primary/80 transition-all"
          onClick={() => { setShowForm(f => !f); setEditId(null); setForm({ nom: '', type: TYPES[0], secteur: '', contact: '', email: '', tel: '', adresse: '', ville: '', codePostal: '', pays: '', statut: STATUTS[0], notes: '', courriers: 0, dernierContact: '' }); }}
        >
          <PlusIcon className="w-5 h-5" /> {showForm ? 'Fermer' : 'Ajouter'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-[#181818] via-[#232347] to-[#181818] p-6 rounded-2xl shadow-xl mb-6 border border-gray-800">
          <input className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" placeholder="Nom/Raison sociale" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required />
          <input className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" placeholder="Contact principal" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
          <select className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
          <input className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" placeholder="Secteur d'activité" value={form.secteur} onChange={e => setForm(f => ({ ...f, secteur: e.target.value }))} />
          <input className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <input className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" placeholder="Téléphone" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} />
          <input className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" placeholder="Adresse complète" value={form.adresse} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} />
          <div className="flex gap-2">
            <input className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary w-1/2" placeholder="Ville" value={form.ville} onChange={e => setForm(f => ({ ...f, ville: e.target.value }))} />
            <input className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary w-1/2" placeholder="Code postal" value={form.codePostal} onChange={e => setForm(f => ({ ...f, codePostal: e.target.value }))} />
          </div>
          <input className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" placeholder="Pays" value={form.pays} onChange={e => setForm(f => ({ ...f, pays: e.target.value }))} />
          <select className="px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}>{STATUTS.map(s => <option key={s}>{s}</option>)}</select>
          <textarea className="md:col-span-2 px-3 py-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-primary" placeholder="Notes et commentaires..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <button type="submit" className="md:col-span-2 bg-green-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-green-700 transition-all flex items-center gap-2 justify-center">
            <CheckCircleIcon className="w-5 h-5" /> {editId ? 'Modifier' : 'Ajouter'}
          </button>
        </form>
      )}
      {/* Affichage en cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-gradient-to-br from-[#232347] to-[#181818] rounded-2xl shadow-lg p-4 flex flex-col gap-2 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${TYPE_COLORS[p.type] || 'bg-gray-700 text-white'}`}>{getInitials(p.nom)}</div>
              <div className="flex-1">
                <div className="font-bold text-lg text-white">{p.nom}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1"><FiUserCheck /> {p.contact || <span className="italic text-gray-500">Non renseigné</span>}</div>
              </div>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${TYPE_COLORS[p.type] || 'bg-gray-700 text-white'}`}>{p.type}</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${STATUT_COLORS[p.statut]}`}>{p.statut}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs mt-2">
              <span className="flex items-center gap-1"><FiMail /> {p.email}</span>
              {p.tel && <span className="flex items-center gap-1"><FiPhone /> {p.tel}</span>}
              {p.ville && <span className="flex items-center gap-1"><FiMapPin /> {p.ville}, {p.pays}</span>}
              {p.secteur && <span className="flex items-center gap-1"><FiBriefcase /> {p.secteur}</span>}
            </div>
            <div className="flex flex-wrap gap-4 text-xs mt-2">
              <span className="flex items-center gap-1"><FiMessageCircle /> {p.courriers || 0} courriers</span>
              <span className="flex items-center gap-1"><FiUsers /> Dernier contact : {p.dernierContact || <span className="italic text-gray-500">N/A</span>}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex items-center gap-1 text-primary hover:underline" onClick={() => setShowDetail(p)}><FiEye className="w-4 h-4" />Voir</button>
              <button className="flex items-center gap-1 text-yellow-400 hover:underline" onClick={() => handleEdit(p)}><PencilSquareIcon className="w-4 h-4" />Éditer</button>
              <button className="flex items-center gap-1 text-red-500 hover:underline" onClick={() => handleDelete(p.id)}><TrashIcon className="w-4 h-4" />Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      {/* Modale de détail partenaire */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md mx-auto bg-[#181818] rounded-2xl shadow-2xl p-6 border border-primary relative">
            <button onClick={() => setShowDetail(null)} className="absolute top-2 right-2 text-gray-400 hover:text-primary text-xl">✕</button>
            <h2 className="text-lg font-bold mb-4 text-primary">Détail du partenaire</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${TYPE_COLORS[showDetail.type] || 'bg-gray-700 text-white'}`}>{getInitials(showDetail.nom)}</div>
              <div>
                <div className="font-bold text-lg text-white">{showDetail.nom}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1"><FiUserCheck /> {showDetail.contact || <span className="italic text-gray-500">Non renseigné</span>}</div>
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${TYPE_COLORS[showDetail.type] || 'bg-gray-700 text-white'}`}>{showDetail.type}</span>
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${STATUT_COLORS[showDetail.statut]}`}>{showDetail.statut}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-2"><FiMail /> <span className="font-mono">{showDetail.email}</span></span>
              {showDetail.tel && <span className="flex items-center gap-2"><FiPhone /> {showDetail.tel}</span>}
              {showDetail.adresse && <span className="flex items-center gap-2"><FiMapPin /> {showDetail.adresse}, {showDetail.ville} {showDetail.codePostal}, {showDetail.pays}</span>}
              {showDetail.secteur && <span className="flex items-center gap-2"><FiBriefcase /> {showDetail.secteur}</span>}
              {showDetail.notes && <span className="flex items-center gap-2"><FiMessageCircle /> {showDetail.notes}</span>}
            </div>
            <div className="flex flex-wrap gap-4 text-xs mt-4">
              <span className="flex items-center gap-1"><FiMessageCircle /> {showDetail.courriers || 0} courriers</span>
              <span className="flex items-center gap-1"><FiUsers /> Dernier contact : {showDetail.dernierContact || <span className="italic text-gray-500">N/A</span>}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
