import formidable from "formidable";
import fs from "fs";
import path from "path";
import db from "../../models"; // ← d'abord on importe db
console.log("DB Keys:", Object.keys(db));
const Courrier = db.Courrier;
console.log("Model Courrier:", Courrier);


export const config = {
  api: { bodyParser: false }
};



// Crée un dossier pour les uploads si besoin
const uploadDir = path.join(process.cwd(), "public", "courrier_uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Mock database - in production, this would be a real database
let courriers = [
  {
    id: 1,
    numero: 'ARR-00001',
    date: '2025-01-15',
    expediteur: "Ministère de l'Intérieur",
    destinataire: 'Service RH',
    objet: 'Dossier administratif',
    reference: 'REF-001',
    canal: 'Physique',
    fichiers: [],
    observations: 'Urgent',
    statut: 'En cours',
    type: 'ARRIVE'
  }
];

let nextId = 2;

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Récupérer tous les courriers (GET /api/courriers)
    const courriers = await Courrier.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json(courriers);
    return;
  }

  if (req.method === "POST") {
    // Créer un courrier (POST /api/courriers)
    const form = formidable({ multiples: true, uploadDir, keepExtensions: true, maxFileSize: 10 * 1024 * 1024 });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Erreur upload fichier" });
      try {
        // Gérer les fichiers : formatte en tableau d’objets
        let fichiers = [];
        if (files.files) {
          if (Array.isArray(files.files)) {
            fichiers = files.files.map(f => ({ name: f.originalFilename, url: "/courrier_uploads/" + path.basename(f.filepath) }));
          } else {
            fichiers = [{ name: files.files.originalFilename, url: "/courrier_uploads/" + path.basename(files.files.filepath) }];
          }
        }

        // Création en base
        const newCourrier = await Courrier.create({
          numero: fields.numero,
          dateReception: fields.dateReception,
          dateSignature: fields.dateSignature,
          objet: fields.objet,
          canal: fields.canal,
          expediteur: fields.expediteur,
          destinataire: fields.destinataire,
          reference: fields.reference,
          delai: fields.delai,
          statut: fields.statut,
          observations: fields.observations,
          files: JSON.stringify(fichiers),
          type: fields.type,
        });

        res.status(201).json(newCourrier);
      } catch (e) {
        res.status(500).json({ error: "Erreur lors de la création" });
      }
    });
    return;
  }

  if (req.method === "PUT") {
    // Modifier un courrier (PUT /api/courriers?id=123)
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID manquant" });
    const form = formidable({ multiples: true, uploadDir, keepExtensions: true, maxFileSize: 10 * 1024 * 1024 });
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Erreur upload fichier" });
      try {
        let fichiers = [];
        if (files.files) {
          if (Array.isArray(files.files)) {
            fichiers = files.files.map(f => ({ name: f.originalFilename, url: "/courrier_uploads/" + path.basename(f.filepath) }));
          } else {
            fichiers = [{ name: files.files.originalFilename, url: "/courrier_uploads/" + path.basename(files.files.filepath) }];
          }
        } else if (fields.existingFiles) {
          // Pour garder les anciens fichiers si pas d'upload
          fichiers = JSON.parse(fields.existingFiles);
        }

        const updated = await Courrier.update({
          ...fields,
          files: JSON.stringify(fichiers),
        }, { where: { id } });

        const courrier = await Courrier.findByPk(id);
        res.status(200).json(courrier);
      } catch (e) {
        res.status(500).json({ error: "Erreur modification" });
      }
    });
    return;
  }

  if (req.method === "DELETE") {
    // Supprimer (DELETE /api/courriers?id=123)
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID manquant" });
    try {
      await Courrier.destroy({ where: { id } });
      res.status(204).end();
    } catch {
      res.status(500).json({ error: "Erreur suppression" });
    }
    return;
  }

  res.status(405).json({ error: "Méthode non autorisée" });
}

function generateAutoNumber(type) {
  const prefix = type === 'ARRIVE' ? 'ARR' : 'DEP';
  const existingNumbers = courriers
    .filter(c => c.type === type)
    .map(c => c.numero)
    .filter(n => n && n.startsWith(prefix))
    .map(n => parseInt(n.split('-')[1]))
    .filter(n => !isNaN(n));

  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  return `${prefix}-${String(nextNumber).padStart(5, '0')}`;
}