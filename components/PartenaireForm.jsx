import { useState } from 'react';
import useTranslation from '../hooks/useTranslation';
import { useToast } from './ToastContext';

export default function PartenaireForm({ onAdd }) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({ nom: '', type: 'Interne' });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom) {
      setMessage(t('fillRequiredFields'));
      showToast(t('fillRequiredFields'), 'error');
      return;
    }
    setMessage(t('successPartner'));
    showToast(t('successPartner'), 'success');
    if (onAdd) onAdd({ ...form, id: Date.now() });
    setForm({ nom: '', type: 'Interne' });
  };

  return (
    <form className="bg-gray-900 dark:bg-surface rounded-xl shadow-lg p-6 space-y-4 mb-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-2">{t('addPartner')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">{t('partnerName')}</label>
          <input type="text" className="w-full bg-muted/30 text-gray-300 rounded px-3 py-2" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required aria-required="true" />
        </div>
        <div>
          <label className="block text-sm mb-1">{t('partnerType')}</label>
          <select className="w-full bg-muted/30 text-gray-300 rounded px-3 py-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option>Interne</option>
            <option>Externe</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded transition">{t('save')}</button>
        <button type="button" className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded transition" onClick={() => setForm({ nom: '', type: 'Interne' })}>{t('reset')}</button>
      </div>
      {message && (
        <div className={`mt-2 text-center text-sm text-green-400 animate-fade-in`}>{message}</div>
      )}
    </form>
  );
}
