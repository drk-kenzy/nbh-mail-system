
import { useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import FileUploader from './FileUploader';

const STATUTS = ['En attente', 'En cours', 'Traité', 'Archivé'];

export default function CourrierForm({ type = 'ARRIVE', onClose, onAddMail, initialValues }) {
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [numero, setNumero] = useState('');
  const [dateReception, setDateReception] = useState('');
  const [dateSignature, setDateSignature] = useState('');
  const [objet, setObjet] = useState('');
  const [canal, setCanal] = useState('Physique');
  const [expediteur, setExpediteur] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [statut, setStatut] = useState('En attente');
  const [delai, setDelai] = useState('');
  const [reference, setReference] = useState('');
  const [observations, setObservations] = useState('');
  const [files, setFiles] = useState([]);
  const [activePartners, setActivePartners] = useState([]);

  // Récupérer les partenaires actifs
  useEffect(() => {
    const getActivePartners = async () => {
      try {
        const response = await fetch('/api/partenaires');
        if (response.ok) {
          const partenaires = await response.json();
          setActivePartners(partenaires.filter(p => p.statut === 'Actif').map(p => p.nom));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des partenaires:', error);
        setActivePartners([]);
      }
    };
    getActivePartners();
  }, []);

  // Génération automatique du numéro
  useEffect(() => {
    if (!initialValues?.numero) {
      generateAutoNumber();
    }
  }, [type, initialValues]);

  const generateAutoNumber = async () => {
    try {
      const prefix = type === 'ARRIVE' ? 'ARR' : 'DEP';
      const response = await fetch(`/api/courrier?type=${type}`);
      
      if (response.ok) {
        const existingCourriers = await response.json();
        
        const existingNumbers = existingCourriers
          .map(c => c.numero)
          .filter(n => n && n.startsWith(prefix + '-'))
          .map(n => parseInt(n.split('-')[1]))
          .filter(n => !isNaN(n));

        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        setNumero(`${prefix}-${String(nextNumber).padStart(5, '0')}`);
      } else {
        throw new Error('Erreur réseau');
      }
    } catch (error) {
      console.error('Erreur génération numéro:', error);
      const prefix = type === 'ARRIVE' ? 'ARR' : 'DEP';
      setNumero(`${prefix}-00001`);
    }
  };

  // Initialisation avec les valeurs existantes
  useEffect(() => {
    if (initialValues) {
      setNumero(initialValues.numero || '');
      setDateReception(initialValues.dateReception || initialValues.date || '');
      setDateSignature(initialValues.dateSignature || '');
      setObjet(initialValues.objet || '');
      setCanal(initialValues.canal || 'Physique');
      setExpediteur(initialValues.expediteur || '');
      setDestinataire(initialValues.destinataire || '');
      setStatut(initialValues.statut || 'En attente');
      setDelai(initialValues.delai || '');
      setReference(initialValues.reference || '');
      setObservations(initialValues.observations || '');
      setFiles(initialValues.files || []);
    }
  }, [initialValues]);

  const handleRemoveFile = idx => setFiles(files => files.filter((_, i) => i !== idx));
  const handleUpload = (newFiles) => setFiles(prev => [...prev, ...newFiles]);

  const handleNextStep = () => {
    if (!objet || !dateReception) {
      addToast('Merci de remplir tous les champs obligatoires de la première étape.', 'error');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!expediteur || !destinataire) {
      addToast('Merci de remplir tous les champs obligatoires de la deuxième étape.', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('numero', numero);
      formData.append('dateReception', dateReception);
      formData.append('dateSignature', dateSignature);
      formData.append('objet', objet);
      formData.append('canal', canal);
      formData.append('expediteur', expediteur);
      formData.append('destinataire', destinataire);
      formData.append('reference', reference);
      formData.append('delai', delai);
      formData.append('statut', statut);
      formData.append('observations', observations);
      formData.append('type', type);

      files.forEach((file) => {
        if (file instanceof File) {
          formData.append('files', file);
        }
      });

      const method = initialValues ? 'PUT' : 'POST';
      if (initialValues) {
        formData.append('id', initialValues.id);
      }

      const response = await fetch('/api/courrier', {
        method,
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement');
      }

      const savedCourrier = await response.json();
      
      if (onAddMail) onAddMail(savedCourrier);
      addToast(initialValues ? 'Courrier modifié avec succès !' : 'Courrier enregistré avec succès !', 'success');
      if (onClose) onClose();
    } catch (error) {
      console.error('Erreur:', error);
      addToast('Erreur lors de l\'enregistrement du courrier', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-xl shadow-lg w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-3">
          <h2 className="text-lg font-bold mb-2 text-black">
            {initialValues ? 'Modifier le courrier' : `Ajouter un nouveau courrier ${type === 'ARRIVE' ? 'arrivé' : 'départ'}`}
          </h2>

          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro d'enregistrement
                  </label>
                  <input
                    type="text"
                    value={numero}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de réception *
                  </label>
                  <input
                    type="datetime-local"
                    value={dateReception}
                    onChange={(e) => setDateReception(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de signature
                  </label>
                  <input
                    type="datetime-local"
                    value={dateSignature}
                    onChange={(e) => setDateSignature(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Canal de réception
                  </label>
                  <select
                    value={canal}
                    onChange={(e) => setCanal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                  >
                    <option value="Physique">Physique</option>
                    <option value="E-mail">E-mail</option>
                    <option value="En ligne">En ligne</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Objet du courrier *
                  </label>
                  <input
                    type="text"
                    value={objet}
                    onChange={(e) => setObjet(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    placeholder="Objet du courrier"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                  >
                    {STATUTS.map(stat => (
                      <option key={stat} value={stat}>{stat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expéditeur *
                  </label>
                  <select
                    value={expediteur}
                    onChange={(e) => setExpediteur(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un expéditeur</option>
                    {activePartners.map(partner => (
                      <option key={partner} value={partner}>{partner}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinataire *
                  </label>
                  <select
                    value={destinataire}
                    onChange={(e) => setDestinataire(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un destinataire</option>
                    {activePartners.map(partner => (
                      <option key={partner} value={partner}>{partner}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Référence courrier
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                    placeholder="Référence interne"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai de réponse
                  </label>
                  <input
                    type="date"
                    value={delai}
                    onChange={(e) => setDelai(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observation
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#15514f] focus:border-transparent resize-none"
                  placeholder="Commentaires ou observations..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pièces jointes
                </label>
                <FileUploader onFiles={handleUpload} />
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-100 rounded text-sm">
                        <span className="text-gray-700">{file.name || file}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between px-4 sm:px-5 py-3 border-t bg-gray-50">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="w-full mr-2 px-4 py-3 text-gray-600 bg-[#e6e6e6] rounded-md hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full ml-2 px-4 py-3 bg-[#15514f] text-white rounded-md hover:bg-[#0f3e3c] transition-colors"
              >
                Suivant
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mr-2 px-4 py-3 text-gray-600 bg-[#e6e6e6] rounded-md hover:bg-gray-200 transition-colors"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full ml-2 px-4 py-3 bg-[#15514f] text-white rounded-md hover:bg-[#0f3e3c] transition-colors"
              >
                {initialValues ? 'Modifier' : 'Enregistrer'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
