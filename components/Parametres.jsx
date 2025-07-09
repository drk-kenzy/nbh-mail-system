import { useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { Cog6ToothIcon, ArrowPathIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, UserIcon, BellIcon, LockClosedIcon, ComputerDesktopIcon, UsersIcon, DatabaseIcon, EyeIcon, PencilSquareIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const FONTS = ['base', 'large', 'x-large'];
const DENSITIES = ['normal', 'compact', 'spacious'];

const LANGUES = ['Français', 'English', 'Español'];
const FUSEAUX = ['Paris', 'Londres', 'New York'];
const FORMATS_DATE = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const PAGINATIONS = [10, 25, 50, 100];
const SERVICES = ['Secrétariat', 'Direction', 'Commercial', 'Comptabilité'];
const ROLES = ['Admin', 'Éditeur', 'Lecture'];
const SESSIONS = [15, 30, 60, 120];

const MOCK_USERS = [
  { id: 1, nom: 'Jean Dupont', email: 'jean.dupont@mail.com', role: 'Admin', statut: 'Actif' },
  { id: 2, nom: 'Alice Martin', email: 'alice.martin@mail.com', role: 'Éditeur', statut: 'Actif' },
  { id: 3, nom: 'Paul Durand', email: 'paul.durand@mail.com', role: 'Lecture', statut: 'Inactif' },
];

export default function Parametres() {
  const { addToast } = useToast();
  const [tab, setTab] = useState(() => Number(localStorage.getItem('param-tab')) || 0);
  const [profil, setProfil] = useState(() => JSON.parse(localStorage.getItem('param-profil')) || { prenom: 'Jean', nom: 'Dupont', email: 'jean.dupont@mail.com', telephone: '', fonction: '', service: SERVICES[0] });
  const [notifs, setNotifs] = useState(() => JSON.parse(localStorage.getItem('param-notifs')) || { email: true, sms: false, push: true, rappels: true, rapports: false });
  const [securite, setSecurite] = useState(() => JSON.parse(localStorage.getItem('param-securite')) || { deuxFA: false, session: 30, historique: true, chiffrement: true });
  const [mdp, setMdp] = useState('');
  const [systeme, setSysteme] = useState(() => JSON.parse(localStorage.getItem('param-systeme')) || { langue: LANGUES[0], fuseau: FUSEAUX[0], formatDate: FORMATS_DATE[0], pagination: PAGINATIONS[0], archivage: true, sauvegarde: true, fontSize: 'base', density: 'normal', order: [0,1,2,3,4,5] });
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('param-users')) || MOCK_USERS);
  const [newUser, setNewUser] = useState({ nom: '', email: '', role: ROLES[1], statut: 'Actif' });
  const [importFile, setImportFile] = useState(null);
  const [stats] = useState({ courriers: 1247, partenaires: 156, stockage: '2.4 GB' });
  const [showDanger, setShowDanger] = useState(false);
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('param-logs')) || []);
  const [faqOpen, setFaqOpen] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => { 
    localStorage.setItem('param-profil', JSON.stringify(profil)); 
    setUnsaved(false); 
  }, [profil]);
  useEffect(() => { 
    localStorage.setItem('param-notifs', JSON.stringify(notifs)); 
    setUnsaved(false); 
  }, [notifs]);
  useEffect(() => { 
    localStorage.setItem('param-securite', JSON.stringify(securite)); 
    setUnsaved(false); 
  }, [securite]);
  useEffect(() => { 
    localStorage.setItem('param-systeme', JSON.stringify(systeme)); 
    setUnsaved(false); 
  }, [systeme]);
  useEffect(() => { localStorage.setItem('param-users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('param-logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('param-tab', tab); }, [tab]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', systeme.theme);
    document.documentElement.style.fontSize = systeme.fontSize === 'base' ? '' : systeme.fontSize === 'large' ? '18px' : '20px';
  }, [systeme.theme, systeme.fontSize]);

  // Gestion dynamique du thème clair/sombre/auto
  useEffect(() => {
    if (systeme.theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      document.documentElement.classList.toggle('dark', mq.matches);
      document.documentElement.classList.toggle('light', !mq.matches);
      const handler = e => {
        document.documentElement.classList.toggle('dark', e.matches);
        document.documentElement.classList.toggle('light', !e.matches);
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      document.documentElement.classList.toggle('dark', systeme.theme === 'sombre');
      document.documentElement.classList.toggle('light', systeme.theme === 'clair');
    }
  }, [systeme.theme]);

  useEffect(() => { setUnsaved(true); }, [profil, notifs, securite, systeme]);
  useEffect(() => {
    const handler = e => {
      if(e.altKey && e.key >= '1' && e.key <= '6') setTab(Number(e.key)-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const notify = (msg, type = 'success') => addToast(msg, type);

  const handleEditUser = (id, data) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, ...data } : u));
    notify('Utilisateur modifié');
  };
  const handleDeleteUser = id => {
    if(window.confirm('Confirmer la suppression de cet utilisateur ?')) {
      setUsers(us => us.filter(u => u.id !== id));
      notify('Utilisateur supprimé', 'info');
    }
  };
  const handleInviteUser = user => {
    notify(`Invitation envoyée à ${user.email}`, 'info');
    setLogs(l => [...l, { date: new Date().toISOString(), action: `Invitation envoyée à ${user.email}` }]);
  };

  const confirmSensitive = (cb) => {
    const pwd = prompt('Confirmez avec votre mot de passe :');
    if(pwd === 'demo' || pwd === mdp) cb();
    else notify('Mot de passe incorrect', 'error');
  };

  const addLog = (action) => setLogs(l => [...l, { date: new Date().toISOString(), action }]);

  const handleImport = e => {
    setImportFile(e.target.files[0]);
    setImportProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setImportProgress(prog);
      if(prog >= 100) clearInterval(interval);
    }, 300);
    notify('Import en cours...', 'info');
  };
  const handleExport = (type = 'all') => {
    notify(`Export ${type === 'all' ? 'complet' : type} lancé`, 'info');
    addLog(`Export ${type}`);
  };

  const FAQ = [
    { q: 'Comment changer mon mot de passe ?', a: 'Allez dans l’onglet Sécurité et suivez la procédure.' },
    { q: 'Comment activer les notifications ?', a: 'Onglet Notifications, activez les commutateurs souhaités.' },
    { q: 'Comment exporter mes données ?', a: 'Onglet Données, cliquez sur Exporter.' },
  ];

  // Utilitaire pour fond de carte selon le thème
  const cardBg = systeme.theme === 'sombre' || (systeme.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'bg-[#232347] text-white'
    : 'bg-white text-gray-900';

  return (
    <div className="max-w-3xl mx-auto py-8 bg-main text-main border-main">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Cog6ToothIcon className="w-7 h-7 text-primary" />Paramètres</h1>
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {['👤 Profil', '🔔 Notifications', '🔒 Sécurité', '🖥️ Système', '👥 Utilisateurs', '💾 Données'].map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`px-4 py-2 font-semibold rounded-t-lg transition-all ${tab===i ? 'bg-[#232347] text-primary' : 'text-gray-400 hover:text-primary'}`} aria-current={tab===i} aria-label={t} tabIndex={0}>{t}</button>
        ))}
        <button onClick={() => setFaqOpen(f=>!f)} className="ml-auto text-xs text-gray-400 hover:text-primary">Aide / FAQ</button>
      </div>
      {faqOpen && (
        <div className="mb-6 bg-[#232347] rounded-xl p-4 text-sm text-gray-200">
          <div className="font-bold mb-2">FAQ</div>
          <ul className="list-disc ml-6">
            {FAQ.map(f => <li key={f.q}><span className="font-semibold">{f.q}</span> <span className="text-gray-400">{f.a}</span></li>)}
          </ul>
        </div>
      )}
      {tab === 0 && (
        <section className={`${cardBg} rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 mb-8 transition-colors`}> 
          <h2 className="font-bold text-lg mb-4 text-primary">Profil utilisateur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" name="prenom" placeholder="Prénom" value={profil.prenom} onChange={e => setProfil(f => ({ ...f, prenom: e.target.value }))} />
            <input className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" name="nom" placeholder="Nom" value={profil.nom} onChange={e => setProfil(f => ({ ...f, nom: e.target.value }))} />
            <input className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" name="email" placeholder="Email" value={profil.email} onChange={e => setProfil(f => ({ ...f, email: e.target.value }))} />
            <input className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" name="telephone" placeholder="Téléphone" value={profil.telephone} onChange={e => setProfil(f => ({ ...f, telephone: e.target.value }))} />
            <input className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" name="fonction" placeholder="Fonction" value={profil.fonction} onChange={e => setProfil(f => ({ ...f, fonction: e.target.value }))} />
            <select className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" value={profil.service} onChange={e => setProfil(f => ({ ...f, service: e.target.value }))}>{SERVICES.map(s => <option key={s}>{s}</option>)}</select>
          </div>
        </section>
      )}
      {tab === 1 && (
        <section className={`${cardBg} rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 mb-8 transition-colors`}> 
          <h2 className="font-bold text-lg mb-4 text-primary">Notifications</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={notifs.email} onChange={e => setNotifs(f => ({ ...f, email: e.target.checked }))} /> Email</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={notifs.sms} onChange={e => setNotifs(f => ({ ...f, sms: e.target.checked }))} /> SMS</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={notifs.push} onChange={e => setNotifs(f => ({ ...f, push: e.target.checked }))} /> Notifications push</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={notifs.rappels} onChange={e => setNotifs(f => ({ ...f, rappels: e.target.checked }))} /> Rappels automatiques</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={notifs.rapports} onChange={e => setNotifs(f => ({ ...f, rapports: e.target.checked }))} /> Rapports périodiques</label>
          </div>
        </section>
      )}
      {tab === 2 && (
        <section className={`${cardBg} rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 mb-8 transition-colors`}> 
          <h2 className="font-bold text-lg mb-4 text-primary">Sécurité</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={securite.deuxFA} onChange={e => setSecurite(f => ({ ...f, deuxFA: e.target.checked }))} /> Authentification à deux facteurs (2FA)</label>
            <label className="flex items-center gap-2">Délai d&apos;expiration de session&nbsp;
              <select value={securite.session} onChange={e => setSecurite(f => ({ ...f, session: Number(e.target.value) }))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-inherit">
                {SESSIONS.map(s => <option key={s} value={s}>{s} min</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={securite.historique} onChange={e => setSecurite(f => ({ ...f, historique: e.target.checked }))} /> Historique des connexions</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={securite.chiffrement} onChange={e => setSecurite(f => ({ ...f, chiffrement: e.target.checked }))} /> Chiffrement automatique des documents sensibles</label>
            <div className="flex gap-2 mt-2">
              <input type="password" placeholder="Nouveau mot de passe" value={mdp} onChange={e => setMdp(e.target.value)} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" />
              <button onClick={() => { setMdp(''); addToast('Mot de passe changé !', 'success'); }} className="bg-yellow-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-yellow-700 transition-all flex items-center gap-2"><ArrowPathIcon className="w-5 h-5" />Changer</button>
            </div>
          </div>
        </section>
      )}
      {tab === 3 && (
        <section className={`${cardBg} rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 mb-8 transition-colors`}> 
          <h2 className="font-bold text-lg mb-4 text-primary">Système</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>Thème<select value={systeme.theme} onChange={e => setSysteme(f => ({ ...f, theme: e.target.value }))} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-inherit">{THEMES.map(l => <option key={l}>{l}</option>)}</select></label>
            <label>Taille de police<select value={systeme.fontSize} onChange={e => setSysteme(f => ({ ...f, fontSize: e.target.value }))} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-inherit">{FONTS.map(f => <option key={f}>{f}</option>)}</select></label>
            <label>Densité<select value={systeme.density} onChange={e => setSysteme(f => ({ ...f, density: e.target.value }))} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-inherit">{DENSITIES.map(d => <option key={d}>{d}</option>)}</select></label>
            <label>Langue<select value={systeme.langue} onChange={e => setSysteme(f => ({ ...f, langue: e.target.value }))} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-inherit">{LANGUES.map(l => <option key={l}>{l}</option>)}</select></label>
            <label>Fuseau horaire<select value={systeme.fuseau} onChange={e => setSysteme(f => ({ ...f, fuseau: e.target.value }))} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-inherit">{FUSEAUX.map(f => <option key={f}>{f}</option>)}</select></label>
            <label>Format de date<select value={systeme.formatDate} onChange={e => setSysteme(f => ({ ...f, formatDate: e.target.value }))} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-inherit">{FORMATS_DATE.map(f => <option key={f}>{f}</option>)}</select></label>
            <label>Pagination<select value={systeme.pagination} onChange={e => setSysteme(f => ({ ...f, pagination: Number(e.target.value) }))} className="w-full px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-inherit">{PAGINATIONS.map(p => <option key={p}>{p}</option>)}</select></label>
            <label className="flex items-center gap-2">Archivage automatique<input type="checkbox" checked={systeme.archivage} onChange={e => setSysteme(f => ({ ...f, archivage: e.target.checked }))} /></label>
            <label className="flex items-center gap-2">Sauvegarde automatique<input type="checkbox" checked={systeme.sauvegarde} onChange={e => setSysteme(f => ({ ...f, sauvegarde: e.target.checked }))} /></label>
          </div>
        </section>
      )}
      {tab === 4 && (
        <section className={`${cardBg} rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 mb-8 transition-colors`}> 
          <h2 className="font-bold text-lg mb-4 text-primary">Utilisateurs</h2>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map(u => (
              <div key={u.id} className="bg-gray-100 dark:bg-[#232347] rounded-xl p-4 flex flex-col gap-1 border border-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-2"><UserIcon className="w-5 h-5 text-primary" /><span className="font-bold text-inherit">{u.nom}</span></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><EyeIcon className="w-4 h-4" />{u.email}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><PencilSquareIcon className="w-4 h-4" />{u.role}</div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.statut==='Actif'?'bg-green-700/80 text-green-200':'bg-gray-700/80 text-gray-300'}`}>{u.statut}</span>
                <div className="flex gap-2 mt-2">
                  <button className="text-yellow-600 dark:text-yellow-400 hover:underline" onClick={() => handleEditUser(u.id, { role: prompt('Nouveau rôle', u.role) || u.role })}>Éditer</button>
                  <button className="text-red-600 dark:text-red-500 hover:underline" onClick={() => handleDeleteUser(u.id)}>Supprimer</button>
                  <button className="text-primary hover:underline" onClick={() => handleInviteUser(u)}>Inviter</button>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={e => {e.preventDefault(); setUsers(us => [...us, { ...newUser, id: Date.now() }]); setNewUser({ nom: '', email: '', role: ROLES[1], statut: 'Actif' }); notify('Utilisateur créé');}} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 dark:bg-[#232347] p-4 rounded-xl border border-gray-300 dark:border-gray-700">
            <input className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" placeholder="Nom" value={newUser.nom} onChange={e => setNewUser(f => ({ ...f, nom: e.target.value }))} required />
            <input className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" placeholder="Email" value={newUser.email} onChange={e => setNewUser(f => ({ ...f, email: e.target.value }))} required />
            <select className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" value={newUser.role} onChange={e => setNewUser(f => ({ ...f, role: e.target.value }))}>{ROLES.map(r => <option key={r}>{r}</option>)}</select>
            <select className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 text-inherit border border-gray-300 dark:border-gray-700" value={newUser.statut} onChange={e => setNewUser(f => ({ ...f, statut: e.target.value }))}><option>Actif</option><option>Inactif</option></select>
            <button type="submit" className="md:col-span-2 bg-green-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-green-700 transition-all flex items-center gap-2 justify-center"><CheckCircleIcon className="w-5 h-5" />Créer</button>
          </form>
        </section>
      )}
      {tab === 5 && (
        <section className={`${cardBg} rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 mb-8 transition-colors`}> 
          <h2 className="font-bold text-lg mb-4 text-primary">Données</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <button onClick={() => handleExport('all')} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-primary/80 transition-all"><ArrowDownTrayIcon className="w-5 h-5" />Exporter</button>
            <button onClick={() => handleExport('courriers')} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-800 transition-all">Courriers</button>
            <button onClick={() => handleExport('partenaires')} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-green-800 transition-all">Partenaires</button>
            <label className="flex items-center gap-2 bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-indigo-800 transition-all cursor-pointer">
              <ArrowUpTrayIcon className="w-5 h-5" />Importer
              <input type="file" className="hidden" onChange={handleImport} />
            </label>
          </div>
          {importFile && <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Fichier sélectionné : {importFile.name} {importProgress > 0 && <span>({importProgress}%)</span>}</div>}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 dark:bg-[#232347] rounded-xl p-4 flex flex-col items-center"><span className="text-2xl font-bold text-primary">{stats.courriers}</span><span className="text-xs text-gray-500 dark:text-gray-400">Courriers</span></div>
            <div className="bg-blue-100 dark:bg-blue-900 rounded-xl p-4 flex flex-col items-center"><span className="text-2xl font-bold text-blue-400">{stats.partenaires}</span><span className="text-xs text-blue-600 dark:text-blue-200">Partenaires</span></div>
            <div className="bg-green-100 dark:bg-green-900 rounded-xl p-4 flex flex-col items-center"><span className="text-2xl font-bold text-green-400">{stats.stockage}</span><span className="text-xs text-green-600 dark:text-green-200">Stockage utilisé</span></div>
          </div>
          <div className="mt-6">
            <button onClick={() => setShowDanger(v => !v)} className="bg-red-700 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-red-800 transition-all">Zone de Danger</button>
            {showDanger && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/80 rounded-xl text-red-800 dark:text-red-200">
                <div className="font-bold mb-2">Réinitialisation complète des données</div>
                <button onClick={() => confirmSensitive(() => { localStorage.clear(); addToast('Toutes les données ont été supprimées.', 'success'); })} className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-red-800 transition-all">Réinitialiser</button>
              </div>
            )}
          </div>
          <div className="mt-8">
            <div className="font-bold text-primary mb-2">Historique des actions</div>
            <ul className="text-xs text-gray-500 dark:text-gray-400 max-h-40 overflow-y-auto">
              {logs.slice().reverse().map((l,i) => <li key={i}>{new Date(l.date).toLocaleString()} — {l.action}</li>)}
            </ul>
          </div>
        </section>
      )}
      {unsaved && <div className="fixed bottom-20 right-4 bg-yellow-600 text-white px-4 py-2 rounded-xl shadow-lg animate-pulse z-50">Modifications non sauvegardées</div>}
    </div>
  );
}
