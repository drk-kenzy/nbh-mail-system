import { useEffect, useState } from 'react';
import FileUploader from './FileUploader.jsx';
import FilePreviewList from './FilePreviewList.jsx';
import { useToast } from './ToastContext';

const STATUTS = ['En attente', 'Traité', 'En cours', 'Archivé'];

export default function ModalCourrierComplet({ type = 'ARRIVE', onClose, onAddMail }) {
  const [objet, setObjet] = useState('');
  const [date, setDate] = useState('');
  const [canal, setCanal] = useState('Physique');
  const [expediteur, setExpediteur] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [statut, setStatut] = useState('En attente');
  const [planif, setPlanif] = useState('');
  const [delai, setDelai] = useState('');
  const [reference, setReference] = useState('');
  const [service, setService] = useState('');
  const [observations, setObservations] = useState('');
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(1);
  const { addToast } = useToast();

  const numero = type === 'ARRIVE'
    ? 'ARR-' + Math.floor(100000 + Math.random() * 900000)
    : 'DEP-' + Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleRemoveFile = idx => setFiles(files => files.filter((_, i) => i !== idx));
  const handleUpload = (newFiles) => setFiles(prev => [...prev, ...newFiles]);

  const handleNextStep = () => {
    if (!objet || !date || !destinataire || (type === 'ARRIVE' && !expediteur)) {
      addToast('Merci de remplir tous les champs obligatoires.', 'error');
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    const newMail = {
      id: Date.now(),
      objet,
      date,
      canal,
      expediteur,
      destinataire,
      statut,
      planif,
      delai,
      reference,
      service,
      observations,
      files,
      numero,
      type,
    };

    if (onAddMail) onAddMail(newMail);
    addToast('Courrier enregistré avec succès !', 'success');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-gray-50 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="h-full overflow-y-auto px-4 sm:px-5 py-3 space-y-3">

          <h2 className="text-lg font-bold mb-2 text-black">Ajouter un nouveau courrier</h2>

          {/* Étapes */}
          <div className="flex justify-center mb-3">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${step === 1 ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-600'} text-sm`}>1</div>
              <div className={`w-8 h-1 ${step === 1 ? 'bg-gray-300' : 'bg-emerald-800'}`} />
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${step === 2 ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-600'} text-sm`}>2</div>
            </div>
          </div>

          {/* Étape 1 */}
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2">
              <div>
                <label className="block font-semibold mb-1 text-sm text-black">Expéditeur</label>
                <input
                  type="text"
                  value={expediteur}
                  onChange={(e) => setExpediteur(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Saisir l'expéditeur"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-gray-900">Destinataire</label>
                <input
                  type="text"
                  value={destinataire}
                  onChange={(e) => setDestinataire(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Saisir le destinataire"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-black">Objet</label>
                <input
                  type="text"
                  value={objet}
                  onChange={(e) => setObjet(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-black"
                  placeholder="Saisir l'objet du courrier"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-black">Date</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-black"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-black">Canal</label>
                <select
                  value={canal}
                  onChange={(e) => setCanal(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-black"
                >
                  <option value="Physique">Physique</option>
                  <option value="Email">Email</option>
                  <option value="Téléphone">Téléphone</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-black">Statut</label>
                <select
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-black"
                >
                  {STATUTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            // Étape 2
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2">
              <div>
                <label className="block font-semibold mb-1 text-sm text-black">Planification</label>
                <input
                  type="datetime-local"
                  value={planif}
                  onChange={(e) => setPlanif(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-black"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-black">Délai</label>
                <input
                  type="datetime-local"
                  value={delai}
                  onChange={(e) => setDelai(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-black"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-black">Référence</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-black"
                  placeholder="Saisir la référence"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-black">Service</label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-black"
                  placeholder="Saisir le service concerné"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-sm text-black">Observations</label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-black"
                  rows="2"
                  placeholder="Ajouter des observations (optionnel)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-black">Pièces jointes</label>
                <div className="flex flex-col gap-1">
                  <FileUploader onUpload={handleUpload} />
                  <FilePreviewList files={files} onRemove={handleRemoveFile} />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-3">
            {step === 2 ? (
              <button
                type="button"
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-sm"
                onClick={() => setStep(1)}
              >
                Retour
              </button>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-sm"
                onClick={onClose}
              >
                Annuler
              </button>

              <button
                type="button"
                className="px-3 py-1 rounded-md bg-emerald-800 text-white font-semibold hover:bg-emerald-900 text-sm"
                onClick={step === 1 ? handleNextStep : handleSubmit}
              >
                {step === 1 ? 'Suivant' : 'Enregistrer'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}