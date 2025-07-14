
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import db from '../../models';
const { Courrier } = db;

const uploadDir = path.join(process.cwd(), "public", "courrier_uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { type } = req.query;
      const whereClause = type ? { type } : {};
      const courriers = await Courrier.findAll({ 
        where: whereClause,
        order: [["createdAt", "DESC"]] 
      });
      
      const courriersWithFiles = courriers.map(c => ({
        ...c.toJSON(),
        files: c.files ? JSON.parse(c.files) : []
      }));
      
      res.status(200).json(courriersWithFiles);
    } catch (error) {
      console.error('Erreur GET:', error);
      res.status(500).json({ error: "Erreur lors de la récupération des courriers" });
    }
    return;
  }

  if (req.method === "POST") {
    const form = formidable({ 
      multiples: true, 
      uploadDir, 
      keepExtensions: true, 
      maxFileSize: 10 * 1024 * 1024 
    });
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Erreur upload:', err);
        return res.status(500).json({ error: "Erreur upload fichier" });
      }
      
      try {
        let fichiers = [];
        if (files.files) {
          if (Array.isArray(files.files)) {
            fichiers = files.files.map(f => ({ 
              name: f.originalFilename, 
              url: "/courrier_uploads/" + path.basename(f.filepath) 
            }));
          } else {
            fichiers = [{ 
              name: files.files.originalFilename, 
              url: "/courrier_uploads/" + path.basename(files.files.filepath) 
            }];
          }
        }

        const getFieldValue = (field) => {
          return Array.isArray(field) ? field[0] : field;
        };

        const type = getFieldValue(fields.type) || 'ARRIVE';
        const numero = await generateAutoNumber(type);

        const nouveauCourrier = await Courrier.create({
          numero,
          dateReception: getFieldValue(fields.dateReception),
          dateSignature: getFieldValue(fields.dateSignature),
          objet: getFieldValue(fields.objet),
          canal: getFieldValue(fields.canal) || 'Physique',
          expediteur: getFieldValue(fields.expediteur),
          destinataire: getFieldValue(fields.destinataire),
          reference: getFieldValue(fields.reference),
          delai: getFieldValue(fields.delai),
          statut: getFieldValue(fields.statut) || 'En attente',
          observations: getFieldValue(fields.observations),
          files: JSON.stringify(fichiers),
          type
        });

        const courrierResponse = {
          ...nouveauCourrier.toJSON(),
          files: fichiers
        };

        res.status(201).json(courrierResponse);
      } catch (error) {
        console.error('Erreur création courrier:', error);
        res.status(500).json({ error: "Erreur lors de la création du courrier" });
      }
    });
    return;
  }

  if (req.method === "PUT") {
    const form = formidable({ 
      multiples: true, 
      uploadDir, 
      keepExtensions: true, 
      maxFileSize: 10 * 1024 * 1024 
    });
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Erreur upload:', err);
        return res.status(500).json({ error: "Erreur upload fichier" });
      }
      
      try {
        const getFieldValue = (field) => {
          return Array.isArray(field) ? field[0] : field;
        };

        const id = getFieldValue(fields.id);
        if (!id) {
          return res.status(400).json({ error: "ID manquant" });
        }

        let fichiers = [];
        if (files.files) {
          if (Array.isArray(files.files)) {
            fichiers = files.files.map(f => ({ 
              name: f.originalFilename, 
              url: "/courrier_uploads/" + path.basename(f.filepath) 
            }));
          } else {
            fichiers = [{ 
              name: files.files.originalFilename, 
              url: "/courrier_uploads/" + path.basename(files.files.filepath) 
            }];
          }
        }

        const [updatedRows] = await Courrier.update({
          dateReception: getFieldValue(fields.dateReception),
          dateSignature: getFieldValue(fields.dateSignature),
          objet: getFieldValue(fields.objet),
          canal: getFieldValue(fields.canal),
          expediteur: getFieldValue(fields.expediteur),
          destinataire: getFieldValue(fields.destinataire),
          reference: getFieldValue(fields.reference),
          delai: getFieldValue(fields.delai),
          statut: getFieldValue(fields.statut),
          observations: getFieldValue(fields.observations),
          files: JSON.stringify(fichiers)
        }, {
          where: { id }
        });

        if (updatedRows === 0) {
          return res.status(404).json({ error: "Courrier non trouvé" });
        }

        const courrierMisAJour = await Courrier.findByPk(id);
        const courrierResponse = {
          ...courrierMisAJour.toJSON(),
          files: fichiers
        };

        res.status(200).json(courrierResponse);
      } catch (error) {
        console.error('Erreur mise à jour courrier:', error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du courrier" });
      }
    });
    return;
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID manquant" });
      }

      const deletedRows = await Courrier.destroy({
        where: { id }
      });

      if (deletedRows === 0) {
        return res.status(404).json({ error: "Courrier non trouvé" });
      }

      res.status(200).json({ message: "Courrier supprimé avec succès" });
    } catch (error) {
      console.error('Erreur suppression courrier:', error);
      res.status(500).json({ error: "Erreur lors de la suppression du courrier" });
    }
    return;
  }

  res.status(405).json({ error: "Méthode non autorisée" });
}

async function generateAutoNumber(type) {
  try {
    // Synchroniser la base de données d'abord
    await db.sequelize.sync();
    
    const prefix = type === 'ARRIVE' ? 'ARR-' : 'DEP-';
    
    const existingCourriers = await Courrier.findAll({
      where: { type },
      attributes: ['numero'],
      order: [['id', 'ASC']]
    });
    
    const existingNumbers = existingCourriers
      .map(c => c.numero)
      .filter(n => n && n.startsWith(prefix))
      .map(n => n.replace(prefix, ''))
      .filter(n => n.match(/^\d{5}$/))
      .map(n => parseInt(n))
      .filter(n => !isNaN(n));

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    
    return prefix + String(nextNumber).padStart(5, '0');
  } catch (error) {
    console.error('Erreur génération numéro:', error);
    const prefix = type === 'ARRIVE' ? 'ARR-' : 'DEP-';
    return prefix + '00001';
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
