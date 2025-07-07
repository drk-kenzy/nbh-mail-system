import { useState } from 'react';
import MainLayout from '../components/MainLayout.jsx';
import AddCourierButton from '../components/AddCourierButton.jsx';
import CourrierForm from '../components/CourrierForm.jsx';
import MOCK_MAILS from '../data/mails.js';

export default function CourrierDepartPage() {
  const [open, setOpen] = useState(false);
  // Filtrer uniquement les courriers départ (numero commence par DEP)
  const mails = MOCK_MAILS.filter(m => m.numero.startsWith('DEP'));
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Courriers Départ</h1>
        <AddCourierButton onClick={() => setOpen(o => !o)} open={open} />
        {open && <CourrierForm type="DEPART" onClose={() => setOpen(false)} />}
        <div className="mt-8 bg-surface rounded-2xl shadow-card p-4">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-3 py-2">N°</th>
                <th className="px-3 py-2">Objet</th>
                <th className="px-3 py-2">Partenaire</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {mails.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-4">Aucun courrier départ.</td>
                </tr>
              ) : mails.map(mail => (
                <tr key={mail.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="px-3 py-2">{mail.numero}</td>
                  <td className="px-3 py-2">{mail.objet}</td>
                  <td className="px-3 py-2">{mail.partenaire}</td>
                  <td className="px-3 py-2">{mail.statut}</td>
                  <td className="px-3 py-2">{mail.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
