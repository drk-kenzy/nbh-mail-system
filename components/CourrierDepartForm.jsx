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
const EMETTEURS = [
  "Service RH",
  "Direction Générale",
  "Service Technique",
  "Mme Martin",
];
const MOCK_COURRIERS = [
  {
    id: 1,
    numero: 'DEP-000123',
    date: '2025-07-01',
    destinataire: "Ministère de l'Intérieur",
    objet: 'Envoi dossier',
    reference: 'REF-001',
    canal: 'Physique',
    fichiers: [],
    emetteur: 'Service RH',
    observations: 'Urgent',
  },
  {
    id: 2,
    numero: 'DEP-000124',
    date: '2025-07-02',
    destinataire: 'Ville de Lyon',
    objet: 'Lettre recommandée',
    reference: 'REF-002',
    canal: 'E-mail',
    fichiers: [],
    emetteur: 'Mme Martin',
    observations: '',
  },
];

export default function CourrierDepartForm() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    numero: 'DEP-' + Date.now().toString().slice(-6),
    date: '',
    destinataire: '',
    objet: '',
    reference: '',
    canal: 'Physique',
    fichiers: [],
    emetteur: '',
    observations: '',
  });
  const [courriers, setCourriers] = useState(MOCK_COURRIERS);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (files) => {
    setForm({ ...form, fichiers: files });
  };
  const handleRemoveFile = (idx) => {
    setForm({ ...form, fichiers: form.fichiers.filter((_, i) => i !== idx) });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.objet || !form.destinataire || !form.emetteur) {
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
    setMessage(t('successOutMail'));
    showToast(t('successOutMail'), 'success');
    setForm({
      ...form,
      numero: 'DEP-' + (Date.now() + 1).toString().slice(-6),
      objet: '',
      fichiers: [],
      observations: '',
    });
  };
  const filteredCourriers = courriers.filter(c =>
    (!search || c.objet.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="space-y-8">
      <form className="bg-surface border border-primary/20 rounded-xl shadow-lg p-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-2 text-primary">{t('registerOutMail')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('registerNumber')}</label>
            <input type="text" value={form.numero} disabled className="w-full bg-white/90 text-gray-900 rounded-lg px-3 py-2 border border-primary/30" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('sendDate')}</label>
            <input type="date" className="w-full bg-white/90 text-gray-900 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required aria-required="true" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('recipientPartner')}</label>
            <select className="w-full bg-white/90 text-gray-900 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white" value={form.destinataire} onChange={e => setForm({ ...form, destinataire: e.target.value })} required aria-required="true">
              <option value="">{t('select')}</option>
              {PARTENAIRES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('mailSubject')}</label>
            <input type="text" className="w-full bg-white/90 text-gray-900 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white" value={form.objet} onChange={e => setForm({ ...form, objet: e.target.value })} required aria-required="true" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('internalReference')}</label>
            <input type="text" className="w-full bg-white/90 text-gray-900 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-main font-medium">{t('sendChannel')}</label>
            <select className="w-full bg-white/90 text-gray-900 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white" value={form.canal} onChange={e => setForm({ ...form, canal: e.target.value })}>
              <option>Physique</option>
              <option>E-mail</option>
              <option>En ligne</option>
            </select>
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
            <label className="block text-sm mb-1 text-main font-medium">{t('senderService')}</label>
            <select className="w-full bg-white/90 text-gray-900 rounded-lg px-3 py-2 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white" value={form.emetteur} onChange={e => setForm({ ...form, emetteur: e.target.value })} required aria-required="true">
              <option value="">{t('select')}</option>
              {EMETTEURS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-main font-medium">{t('observations')}</label>
            <textarea className="w-full bg-white/90 text-gray-900 rounded-lg px-3 py-2 min-h-[60px] border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white resize-none placeholder-gray-600" value={form.observations} onChange={e => setForm({ ...form, observations: e.target.value })} placeholder="Ajoutez vos observations ici..." />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded-lg transition shadow-md">{t('save')}</button>
          <button type="button" className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition shadow-md" onClick={() => setForm({ ...form, objet: '', fichiers: [], observations: '' })}>{t('reset')}</button>
        </div>
        {message && (
          <div className={`mt-2 text-center text-sm ${message.includes('succès') ? 'text-green-400' : 'text-red-400'} animate-fade-in`}>{message}</div>
        )}
      </form>
      <div className="bg-surface border border-primary/20 rounded-xl shadow-lg p-6 mt-8">
        <input
          type="text"
          placeholder={t('searchBySubject')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/90 text-gray-900 rounded-lg px-3 py-2 w-full md:w-1/2 mb-4 border border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:bg-white placeholder-gray-600"
          aria-label={t('searchBySubject')}
        />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-3 py-2">{t('registerNumber')}</th>
                <th className="px-3 py-2">{t('sendDate')}</th>
                <th className="px-3 py-2">{t('recipientPartner')}</th>
                <th className="px-3 py-2">{t('mailSubject')}</th>
                <th className="px-3 py-2">{t('internalReference')}</th>
                <th className="px-3 py-2">{t('sendChannel')}</th>
                <th className="px-3 py-2">{t('senderService')}</th>
                <th className="px-3 py-2">{t('observations')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourriers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 py-4">{t('noMailFound')}</td>
                </tr>
              ) : filteredCourriers.map(c => (
                <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="px-3 py-2">{c.numero}</td>
                  <td className="px-3 py-2">{c.date}</td>
                  <td className="px-3 py-2">{c.destinataire}</td>
                  <td className="px-3 py-2">{c.objet}</td>
                  <td className="px-3 py-2">{c.reference}</td>
                  <td className="px-3 py-2">{c.canal}</td>
                  <td className="px-3 py-2">{c.emetteur}</td>
                  <td className="px-3 py-2">{c.observations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
