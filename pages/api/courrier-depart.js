
const db = require('../../models');

export default async function handler(req, res) {
  try {
    console.log('API courrier-depart appelée avec méthode:', req.method);
    
    // Vérifier la connexion à la base de données
    await db.sequelize.authenticate();
    
    // Debug : afficher les modèles disponibles
    console.log('Modèles disponibles:', Object.keys(db));
    
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
          
          console.log('Courriers départ trouvés:', courriers.length);
          return res.status(200).json(courriers);
        } catch (error) {
          console.error('Erreur lors de la récupération:', error);
          return res.status(500).json({ error: 'Erreur lors de la récupération des courriers' });
        }

      case 'POST':
        try {
          const { objet, destinataire, reference, observations, delai } = req.body;
          
          const nouveauCourrier = await db.Courrier.create({
            type: 'DEPART',
            objet: objet || '',
            destinataire: destinataire || '',
            reference: reference || '',
            observations: observations || '',
            delai: delai || '',
            dateSignature: new Date(),
            statut: 'En attente'
          });

          console.log('Nouveau courrier départ créé:', nouveauCourrier.id);
          return res.status(201).json(nouveauCourrier);
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
