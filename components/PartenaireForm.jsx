import { useState } from 'react';
import useTranslation from '../hooks/useTranslation';
import { useToast } from './ToastContext';

export default function PartenaireForm({ onAdd, editingPartenaire, onUpdate, onCancel }) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({ nom: '', type: 'Interne', contact: '' });
  const [message, setMessage] = useState('');

  // Mettre à jour le formulaire quand on édite un partenaire
  useState(() => {
    if (editingPartenaire) {
      setForm({
        nom: editingPartenaire.nom || '',
        type: editingPartenaire.type || 'Interne',
        contact: editingPartenaire.contact || ''
      });
    } else {
      setForm({ nom: '', type: 'Interne', contact: '' });
    }
  }, [editingPartenaire]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom) {
      setMessage(t('fillRequiredFields'));
      showToast(t('fillRequiredFields'), 'error');
      return;
    }
    
    if (editingPartenaire) {
      // Mode édition
      if (onUpdate) onUpdate(form);
      setMessage(t('partnerUpdated'));
    } else {
      // Mode ajout
      if (onAdd) onAdd({ ...form, id: Date.now() });
      setMessage(t('successPartner'));
      showToast(t('successPartner'), 'success');
    }
    
    setForm({ nom: '', type: 'Interne', contact: '' });
  };

  return (
    <form className="bg-gray-900 dark:bg-surface rounded-xl shadow-lg p-6 space-y-4 mb-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-2">
        {editingPartenaire ? t('editPartner') : t('addPartner')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">{t('partnerName')}</label>
          <input type="text" className="w-full bg-muted/30 text-gray-300 rounded px-3 py-2" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required aria-required="true" />
        </div>
        <div>
          <label className="block text-sm mb-1">{t('partnerType')}</label>
          <select className="w-full bg-muted/30 text-gray-300 rounded px-3 py-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="Public">Public</option>
            <option value="Privé">Privé</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">{t('contact')}</label>
          <input type="email" className="w-full bg-muted/30 text-gray-300 rounded px-3 py-2" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2 rounded transition">
          {editingPartenaire ? t('update') : t('save')}
        </button>
        {editingPartenaire ? (
          <button type="button" className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded transition" onClick={onCancel}>
            {t('cancel')}
          </button>
        ) : (
          <button type="button" className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded transition" onClick={() => setForm({ nom: '', type: 'Public', contact: '' })}>
            {t('reset')}
          </button>
        )}
      </div>
      {message && (
        <div className={`mt-2 text-center text-sm text-green-400 animate-fade-in`}>{message}</div>
      )}
    </form>
  );
}
