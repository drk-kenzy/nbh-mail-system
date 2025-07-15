const db = require('../../models');

export default async function handler(req, res) {
  try {
    // Vérifier la connexion à la base de données
    await db.sequelize.authenticate();
    
    // Vérifier que le modèle Courrier existe
    if (!db.Courrier) {
      throw new Error('Modèle Courrier non trouvé');
    }

    switch (req.method) {
      case 'GET':
        const courriers = await db.Courrier.findAll({
          where: req.query.type ? { type: req.query.type } : {},
          order: [['createdAt', 'DESC']]
        });
        res.status(200).json(courriers);
        break;

      case 'POST':
        const newCourrier = await db.Courrier.create(req.body);
        res.status(201).json(newCourrier);
        break;

      case 'PUT':
        const { id } = req.query;
        const updatedCourrier = await db.Courrier.update(req.body, {
          where: { id },
          returning: true
        });
        res.status(200).json(updatedCourrier);
        break;

      case 'DELETE':
        const { id: deleteId } = req.query;
        await db.Courrier.destroy({ where: { id: deleteId } });
        res.status(200).json({ message: 'Courrier supprimé' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}