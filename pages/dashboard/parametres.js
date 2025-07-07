import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Toggle from '../../components/Toggle';
import Switch from '../../components/Switch';
import Select from '../../components/Select';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';

const MOCK_USER = {
  nom: 'Jean Dupont',
  email: 'jean.dupont@email.com',
  role: 'Admin',
  avatar: '',
};
const ROLES = {
  Admin: { color: 'bg-primary', permissions: ['lecture', 'édition', 'suppression'] },
  Agent: { color: 'bg-green-500', permissions: ['lecture', 'édition'] },
  Lecteur: { color: 'bg-gray-500', permissions: ['lecture'] },
};
const MOCK_VERSION = 'v0.1 - Front Only';

export default function Parametres() {
  // Apparence
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [density, setDensity] = useState(() => localStorage.getItem('density') || 'normal');
  const [font, setFont] = useState(() => localStorage.getItem('font') || 'sans');
  // Notifications
  const [notifMail, setNotifMail] = useState(() => JSON.parse(localStorage.getItem('notifMail') ?? 'true'));
  const [notifDelai, setNotifDelai] = useState(() => JSON.parse(localStorage.getItem('notifDelai') ?? 'true'));
  const [dnd, setDnd] = useState(() => JSON.parse(localStorage.getItem('dnd') ?? 'false'));
  // Courriers
  const [delai, setDelai] = useState(() => localStorage.getItem('delai') || '72');
  const [canal, setCanal] = useState(() => localStorage.getItem('canal') || 'email');
  const [modele, setModele] = useState(() => localStorage.getItem('modele') || '');
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('categories') ?? '[]'));
  const [catInput, setCatInput] = useState('');
  // Système
  const [network, setNetwork] = useState(navigator.onLine);
  // User
  const [user] = useState(MOCK_USER);

  // Effets de persistance
  useEffect(() => { localStorage.setItem('density', density); }, [density]);
  useEffect(() => { localStorage.setItem('font', font); }, [font]);
  useEffect(() => { localStorage.setItem('notifMail', notifMail); }, [notifMail]);
  useEffect(() => { localStorage.setItem('notifDelai', notifDelai); }, [notifDelai]);
  useEffect(() => { localStorage.setItem('dnd', dnd); }, [dnd]);
  useEffect(() => { localStorage.setItem('delai', delai); }, [delai]);
  useEffect(() => { localStorage.setItem('canal', canal); }, [canal]);
  useEffect(() => { localStorage.setItem('modele', modele); }, [modele]);
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => {
    const updateNetwork = () => setNetwork(navigator.onLine);
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
    };
  }, []);
  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Reset
  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };
  // Export
  const handleExport = () => {
    const data = {
      density, font, notifMail, notifDelai, dnd, delai, canal, modele, categories
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parametres.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className={`max-w-3xl mx-auto py-8 px-2 ${density === 'compact' ? 'space-y-4' : 'space-y-8'} font-${font}`}>
        {/* 1. Profil utilisateur */}
        <Card title="Profil utilisateur">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center text-3xl font-bold">
              {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" /> : user.nom.split(' ').map(n=>n[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold">{user.nom}</div>
              <div className="text-gray-400 text-sm">{user.email}</div>
              <Badge color={ROLES[user.role].color}>{user.role}</Badge>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/80 transition-all">Modifier</button>
          </div>
        </Card>
        {/* 2. Apparence */}
        <Card title="Apparence">
          <div className="flex flex-col md:flex-row gap-6">
            <Toggle checked={dark} onChange={setDark} label="Mode sombre" />
            <Select
              options={[
                { value: 'normal', label: 'Densité normale' },
                { value: 'compact', label: 'Compact' },
                { value: 'spaced', label: 'Espacé' },
              ]}
              value={density}
              onChange={setDensity}
              className="w-44"
            />
            <Select
              options={[
                { value: 'sans', label: 'Sans Serif' },
                { value: 'serif', label: 'Serif' },
                { value: 'mono', label: 'Mono' },
              ]}
              value={font}
              onChange={setFont}
              className="w-44"
            />
          </div>
        </Card>
        {/* 3. Notifications */}
        <Card title="Notifications">
          <div className="flex flex-col md:flex-row gap-6">
            <Switch checked={notifMail} onChange={setNotifMail} label="Notification à la réception d’un courrier" />
            <Switch checked={notifDelai} onChange={setNotifDelai} label="Alerte avant les délais de réponse" />
            <Switch checked={dnd} onChange={setDnd} label="Mode ne pas déranger" />
          </div>
        </Card>
        {/* 4. Rôles et permissions */}
        <Card title="Rôles et permissions">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Badge color={ROLES[user.role].color}>{user.role}</Badge>
            <div className="flex gap-2 flex-wrap">
              {ROLES[user.role].permissions.map(p => (
                <Badge key={p} color="bg-gray-700">{p}</Badge>
              ))}
            </div>
          </div>
        </Card>
        {/* 5. Paramètres des courriers */}
        <Card title="Paramètres des courriers">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-wrap">
              <Input
                type="number"
                min={1}
                value={delai}
                onChange={setDelai}
                className="w-32"
                placeholder="Délai (h)"
              />
              <Select
                options={[
                  { value: 'email', label: 'Email' },
                  { value: 'papier', label: 'Papier' },
                  { value: 'autre', label: 'Autre' },
                ]}
                value={canal}
                onChange={setCanal}
                className="w-44"
              />
            </div>
            <Textarea
              value={modele}
              onChange={setModele}
              placeholder="Modèle de courrier standard..."
              className="w-full"
            />
            <div className="flex gap-2 items-center">
              <Input
                value={catInput}
                onChange={setCatInput}
                placeholder="Nouvelle catégorie"
                className="w-64"
              />
              <button
                type="button"
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/80 transition-all"
                onClick={() => { if (catInput && !categories.includes(catInput)) { setCategories([...categories, catInput]); setCatInput(''); } }}
              >Ajouter</button>
              {categories.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {categories.map(cat => (
                    <Badge key={cat} color="bg-gray-700">{cat}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
        {/* 6. Système */}
        <Card title="Système">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-gray-400">Version&nbsp;: <span className="text-primary font-semibold">{MOCK_VERSION}</span></div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${network ? 'bg-green-500' : 'bg-red-500'} inline-block`}></span>
              <span className="text-sm">{network ? 'Connecté' : 'Déconnecté'}</span>
            </div>
            <button
              type="button"
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/80 transition-all"
              onClick={handleExport}
            >Exporter mes données</button>
            <button
              type="button"
              className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-600 transition-all"
              onClick={handleReset}
            >Restaurer les paramètres par défaut</button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
