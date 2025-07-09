
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function InviteMemberModal({ isOpen, onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await onInvite(email);
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay semi-transparent flouté */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal centrée */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header avec titre et bouton fermeture */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Inviter un membre
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email du membre"
                className="w-full px-4 py-4 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#15514f] focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                required
                disabled={loading}
              />
            </div>

            {/* Bouton d'invitation */}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-4 px-6 bg-[#15514f] hover:bg-[#0f3e3c] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
