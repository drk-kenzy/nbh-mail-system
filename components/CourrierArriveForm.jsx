import { useState } from 'react';
import useTranslation from '../hooks/useTranslation';
import FileUpload from './FileUpload';
import { useToast } from './ToastContext';

const PARTENAIRES = [
  "Ministère de l'Intérieur",
  "Préfecture de Paris",
  "Ville de Lyon",
  "Association X",
];
const DESTINATAIRES = [
  "Service RH",
  "Direction Générale",
  "Service Technique",
  "M. Dupont",
];
const STATUTS = [
  'À traiter',
  'En cours',
  'Traité',
  'Planifié',
  'Archivé',
  'Corbeille',
];

const MOCK_COURRIERS = [
  {
    id: 1,
    numero: 'ARR-000123',
    date: '2025-07-01T09:00',
    expediteur: "Ville de Lyon",
    objet: 'Demande de subvention',
    canal: 'E-mail',
    destinataire: 'Service RH',
    statut: 'À traiter',
    planif: '',
    delai: '',
  },
  {
    id: 2,
    numero: 'ARR-000124',
    date: '2025-07-02T10:30',
    expediteur: "Association X",
    objet: 'Invitation réunion',
    canal: 'Physique',
    destinataire: 'M. Dupont',
    statut: 'En cours',
    planif: '',
    delai: '',
  },
];

export default function CourrierArriveForm() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    numero: 'ARR-' + Date.now().toString().slice(-6),
    date: '',
    heure: '',
    expediteur: '',
    objet: '',
    canal: 'Physique',
    fichiers: [],
    destinataire: '',
    statut: 'À traiter',
    planif: '',
    delai: '',
  });
  const [message, setMessage] = useState('');
  const [courriers, setCourriers] = useState(MOCK_COURRIERS);
  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState('');

  const handleFileChange = (files) => {
    setForm({ ...form, fichiers: files });
  };

  const handleRemoveFile = (idx) => {
    setForm({ ...form, fichiers: form.fichiers.filter((_, i) => i !== idx) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.objet || !form.expediteur || !form.destinataire) {
      setMessage(t('fillRequiredFields'));
      showToast(t('fillRequiredFields'), 'error');
      return;
    }
    setCourriers([
      {
        ...form,
        id: Date.now(),
      },
      ...courriers,
    ]);
    setMessage(t('successInMail'));
    showToast(t('successInMail'), 'success');
    setForm({
      ...form,
      numero: 'ARR-' + (Date.now() + 1).toString().slice(-6),
      objet: '',
      fichiers: [],
      planif: '',
      delai: '',
    });
  };
  const filteredCourriers = courriers.filter(c =>
    (!search || c.objet.toLowerCase().includes(search.toLowerCase())) &&
    (!statutFilter || c.statut === statutFilter)
  );

  return (
    <div className="space-y-8">
      <form className="bg-surface border border-primary/20 rounded-xl shadow-lg p-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-2 text-primary">{t('registerInMail')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('registerNumber')}</label>
            <input type="text" value={form.numero} disabled className="w-full bg-surface/50 text-gray-100 rounded-lg px-3 py-2 border border-primary/30" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('receiveDate')}</label>
            <input type="datetime-local" className="w-full bg-surface/50 text-gray-100 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-surface/70" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required aria-required="true" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('expediteur')}</label>
            <select className="w-full bg-surface/50 text-gray-100 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-surface/70" value={form.expediteur} onChange={e => setForm({ ...form, expediteur: e.target.value })} required aria-required="true">
              <option value="">{t('select')}</option>
              {PARTENAIRES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('mailSubject')}</label>
            <input type="text" className="w-full bg-surface/50 text-gray-100 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-surface/70" value={form.objet} onChange={e => setForm({ ...form, objet: e.target.value })} required aria-required="true" />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('canal')}</label>
            <div className="flex gap-4 mt-1">
              {['Physique', 'E-mail', 'En ligne'].map(canal => (
                <label key={canal} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="canal" value={canal} checked={form.canal === canal} onChange={e => setForm({ ...form, canal: e.target.value })} />
                  <span>{canal}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-main font-medium" htmlFor="fichiers">{t('attachments')}</label>
            <FileUpload id="fichiers" aria-label={t('attachments')} onFiles={handleFileChange} />
            <div className="text-xs text-gray-300 mt-1 flex flex-wrap gap-2">
              {form.fichiers.length > 0 && form.fichiers.map((f, idx) => (
                <span key={f.name + idx} className="bg-primary/20 text-primary px-2 py-1 rounded flex items-center gap-1">
                  {f.name}
                  <button type="button" aria-label={t('removeFile')} className="ml-1 text-red-400 hover:text-red-600" onClick={() => handleRemoveFile(idx)}>&times;</button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('destinataire')}</label>
            <select className="w-full bg-surface/50 text-gray-100 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-surface/70" value={form.destinataire} onChange={e => setForm({ ...form, destinataire: e.target.value })} required aria-required="true">
              <option value="">{t('select')}</option>
              {DESTINATAIRES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('statut')}</label>
            <select className="w-full bg-surface/50 text-gray-100 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-surface/70" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
              {STATUTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('planif')}</label>
            <input type="datetime-local" className="w-full bg-surface/50 text-gray-100 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-surface/70" value={form.planif} onChange={e => setForm({ ...form, planif: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('delai')}</label>
            <input type="datetime-local" className="w-full bg-surface/50 text-gray-100 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-surface/70" value={form.delai} onChange={e => setForm({ ...form, delai: e.target.value })} />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg transition shadow-md">{t('save')}</button>
          <button type="button" className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition shadow-md" onClick={() => setForm({ ...form, objet: '', fichiers: [], planif: '', delai: '' })}>{t('reset')}</button>
        </div>
        {message && (
          <div className={`mt-2 text-center text-sm ${message.includes('succès') ? 'text-green-400' : 'text-red-400'} animate-fade-in`}>{message}</div>
        )}
      </form>
      {/* Tableau/Liste des courriers enregistrés */}
      <div className="bg-surface border border-primary/20 rounded-xl shadow-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row gap-2 md:items-center mb-4">
          <input
            type="text"
            placeholder={t('searchBySubject')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-surface/50 text-gray-100 rounded-lg px-3 py-2 w-full md:w-1/2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-surface/70 placeholder-gray-400"
            aria-label={t('searchBySubject')}
          />
          <select
            value={statutFilter}
            onChange={e => setStatutFilter(e.target.value)}
            className="bg-surface/50 text-gray-100 rounded-lg px-3 py-2 w-full md:w-1/4 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-surface/70"
            aria-label={t('processingStatus')}
          >
            <option value="">{t('allStatus')}</option>
            {STATUTS.map(s => <option key={s}>{t(s)}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-3 py-2">{t('registerNumber')}</th>
                <th className="px-3 py-2">{t('receiveDateTime')}</th>
                <th className="px-3 py-2">{t('senderPartner')}</th>
                <th className="px-3 py-2">{t('mailSubject')}</th>
                <th className="px-3 py-2">{t('processingStatus')}</th>
                <th className="px-3 py-2">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourriers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-4">{t('noMailFound')}</td>
                </tr>
              ) : filteredCourriers.map(c => (
                <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="px-3 py-2">{c.numero}</td>
                  <td className="px-3 py-2">{c.date.replace('T', ' ')}</td>
                  <td className="px-3 py-2">{c.expediteur}</td>
                  <td className="px-3 py-2">{c.objet}</td>
                  <td className="px-3 py-2">{t(c.statut)}</td>
                  <td className="px-3 py-2">
                    <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">{t(c.statut)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
