import { localStorage } from '../../utils/localStorage.js';
import { formidable } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (id) {
        const courriers = localStorage.getCourriers();
        const courrier = courriers.find(c => c.id == id);
        if (!courrier) {
          return res.status(404).json({ error: 'Courrier non trouvé' });
        }
        return res.status(200).json(courrier);
      }

      const courriers = localStorage.getCourriers('DEPART');
      console.log('Courriers DEPART trouvés:', courriers.length); // Debug log
      return res.status(200).json(courriers);
    } catch (error) {
      console.error('Erreur GET:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  if (req.method === 'POST') {
    try {
      const form = formidable({
        uploadDir: './public/courrier_uploads',
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024,
      });

      if (!fs.existsSync('./public/courrier_uploads')) {
        fs.mkdirSync('./public/courrier_uploads', { recursive: true });
      }

      const [fields, files] = await form.parse(req);

      const courrierData = {};
      Object.keys(fields).forEach(key => {
        courrierData[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      });

      let fichiers = [];
      if (files.fichiers) {
        const fileArray = Array.isArray(files.fichiers) ? files.fichiers : [files.fichiers];
        fichiers = fileArray.map(file => ({
          name: file.originalFilename,
          path: file.filepath,
          size: file.size
        }));
      }

      const courrier = localStorage.addCourrier({
        ...courrierData,
        fichiers: JSON.stringify(fichiers),
        type: 'DEPART'
      });

      return res.status(201).json(courrier);
    } catch (error) {
      console.error('Erreur POST:', error);
      return res.status(500).json({ error: 'Erreur lors de la création' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id } = req.query;

      const form = formidable({
        uploadDir: './public/courrier_uploads',
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024,
      });

      const [fields, files] = await form.parse(req);

      const courrierData = {};
      Object.keys(fields).forEach(key => {
        courrierData[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
      });

      let fichiers = [];
      if (files.fichiers) {
        const fileArray = Array.isArray(files.fichiers) ? files.fichiers : [files.fichiers];
        fichiers = fileArray.map(file => ({
          name: file.originalFilename,
          path: file.filepath,
          size: file.size
        }));
      }

      const updateData = {
        ...courrierData,
        ...(fichiers.length > 0 && { fichiers: JSON.stringify(fichiers) })
      };

      const courrier = localStorage.updateCourrier(id, updateData);
      return res.status(200).json(courrier);
    } catch (error) {
      console.error('Erreur PUT:', error);
      return res.status(500).json({ error: 'Erreur lors de la modification' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      localStorage.deleteCourrier(id);
      return res.status(200).json({ message: 'Courrier supprimé' });
    } catch (error) {
      console.error('Erreur DELETE:', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }

  return res.status(405).json({ error: 'Méthode non autorisée' });
}