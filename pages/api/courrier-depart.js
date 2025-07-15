

const db = require('../../models');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    console.log('API courrier-depart appelée avec méthode:', req.method);
    
    // Vérifier la connexion à la base de données
    await db.sequelize.authenticate();
    
    // Vérifier que le modèle Courrier existe
    if (!db.Courrier) {
      console.error('Modèle Courrier non trouvé. Modèles disponibles:', Object.keys(db));
      return res.status(500).json({ error: 'Modèle Courrier non trouvé' });
    }

    switch (req.method) {
      case 'GET':
        try {
          const courriers = await db.Courrier.findAll({
            where: { type: 'DEPART' },
            order: [['createdAt', 'DESC']]
          });
          
          // Formater les données pour l'affichage
          const formattedCourriers = courriers.map(courrier => ({
            ...courrier.toJSON(),
            date: courrier.dateReception ? new Date(courrier.dateReception).toLocaleDateString('fr-FR') : 
                  courrier.dateSignature ? new Date(courrier.dateSignature).toLocaleDateString('fr-FR') : 
                  new Date(courrier.createdAt).toLocaleDateString('fr-FR'),
            fichiers: courrier.files ? JSON.parse(courrier.files) : []
          }));
          
          console.log('Courriers départ trouvés:', formattedCourriers.length);
          return res.status(200).json(formattedCourriers);
        } catch (error) {
          console.error('Erreur lors de la récupération:', error);
          return res.status(500).json({ error: 'Erreur lors de la récupération des courriers' });
        }

      case 'POST':
        try {
          const form = formidable({
            uploadDir: path.join(process.cwd(), 'public', 'courrier_uploads'),
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB
          });

          // Créer le dossier s'il n'existe pas
          const uploadDir = path.join(process.cwd(), 'public', 'courrier_uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const [fields, files] = await form.parse(req);
          
          const objet = Array.isArray(fields.objet) ? fields.objet[0] : fields.objet;
          const destinataire = Array.isArray(fields.destinataire) ? fields.destinataire[0] : fields.destinataire;
          const reference = Array.isArray(fields.reference) ? fields.reference[0] : fields.reference;
          const observations = Array.isArray(fields.observations) ? fields.observations[0] : fields.observations;
          const delai = Array.isArray(fields.delai) ? fields.delai[0] : fields.delai;
          const dateSignature = Array.isArray(fields.dateSignature) ? fields.dateSignature[0] : fields.dateSignature;

          // Traitement des fichiers
          let savedFiles = [];
          if (files.files) {
            const fileArray = Array.isArray(files.files) ? files.files : [files.files];
            savedFiles = fileArray.map(file => ({
              name: file.originalFilename,
              path: `/courrier_uploads/${path.basename(file.filepath)}`,
              size: file.size
            }));
          }

          const nouveauCourrier = await db.Courrier.create({
            type: 'DEPART',
            objet: objet || '',
            destinataire: destinataire || '',
            reference: reference || '',
            observations: observations || '',
            delai: delai || '',
            dateSignature: dateSignature ? new Date(dateSignature) : new Date(),
            statut: 'En attente',
            files: savedFiles.length > 0 ? JSON.stringify(savedFiles) : null
          });

          const formattedCourrier = {
            ...nouveauCourrier.toJSON(),
            date: nouveauCourrier.dateSignature ? new Date(nouveauCourrier.dateSignature).toLocaleDateString('fr-FR') : 
                  new Date(nouveauCourrier.createdAt).toLocaleDateString('fr-FR'),
            fichiers: savedFiles
          };

          console.log('Nouveau courrier départ créé:', nouveauCourrier.id);
          return res.status(201).json(formattedCourrier);
        } catch (error) {
          console.error('Erreur lors de la création:', error);
          return res.status(500).json({ error: 'Erreur lors de la création du courrier' });
        }

      case 'DELETE':
        try {
          const { id } = req.query;
          
          if (!id) {
            return res.status(400).json({ error: 'ID manquant' });
          }

          const deleted = await db.Courrier.destroy({
            where: { id, type: 'DEPART' }
          });

          if (deleted) {
            console.log('Courrier départ supprimé:', id);
            return res.status(200).json({ message: 'Courrier supprimé avec succès' });
          } else {
            return res.status(404).json({ error: 'Courrier non trouvé' });
          }
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          return res.status(500).json({ error: 'Erreur lors de la suppression du courrier' });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
    }
  } catch (error) {
    console.error('Erreur de base de données:', error);
    return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
  }
}

