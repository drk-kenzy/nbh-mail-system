
const { Partenaire } = require('../../models');
const { Op } = require('sequelize');

export default async function handler(req, res) {
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      case 'PUT':
        await handlePut(req, res);
        break;
      case 'DELETE':
        await handleDelete(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ 
          error: 'Méthode non autorisée',
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
        });
    }
  } catch (error) {
    console.error('Erreur API Partenaires:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur interne',
      message: error.message 
    });
  }
}

// GET - Récupérer tous les partenaires ou un partenaire spécifique
async function handleGet(req, res) {
  const { id, search, statut, type, page = 1, limit = 20 } = req.query;

  try {
    // Récupération d'un partenaire spécifique
    if (id) {
      const partenaire = await Partenaire.findByPk(id);
      if (!partenaire) {
        return res.status(404).json({ error: 'Partenaire non trouvé' });
      }
      return res.status(200).json({ data: partenaire });
    }

    // Construction des conditions de recherche
    const whereConditions = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { nom: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { contact: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (statut) {
      whereConditions.statut = statut;
    }
    
    if (type) {
      whereConditions.type = type;
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupération avec pagination
    const result = await Partenaire.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: offset,
      order: [['updatedAt', 'DESC']]
    });

    return res.status(200).json({
      data: result.rows,
      pagination: {
        total: result.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur GET Partenaires:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des partenaires' });
  }
}

// POST - Créer un nouveau partenaire
async function handlePost(req, res) {
  const { nom, type, email, statut, secteur, contact, tel, adresse, ville, codePostal, pays, notes, dernierContact } = req.body;

  // Validation des champs requis
  if (!nom || !email || !type) {
    return res.status(400).json({ 
      error: 'Champs requis manquants',
      required: ['nom', 'email', 'type']
    });
  }

  try {
    // Vérification de l'unicité de l'email
    const existingPartenaire = await Partenaire.findOne({ where: { email } });
    if (existingPartenaire) {
      return res.status(409).json({ error: 'Un partenaire avec cet email existe déjà' });
    }

    // Création du nouveau partenaire
    const nouveauPartenaire = await Partenaire.create({
      nom,
      type,
      email,
      statut: statut || 'Actif',
      secteur,
      contact,
      tel,
      adresse,
      ville,
      codePostal,
      pays: pays || 'France',
      notes,
      dernierContact: dernierContact || new Date().toISOString().split('T')[0]
    });

    return res.status(201).json({ 
      message: 'Partenaire créé avec succès',
      data: nouveauPartenaire 
    });
  } catch (error) {
    console.error('Erreur POST Partenaires:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Erreur de validation',
        details: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    return res.status(500).json({ error: 'Erreur lors de la création du partenaire' });
  }
}

// PUT - Mettre à jour un partenaire
async function handlePut(req, res) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID du partenaire requis' });
  }

  try {
    const partenaire = await Partenaire.findByPk(id);
    if (!partenaire) {
      return res.status(404).json({ error: 'Partenaire non trouvé' });
    }

    // Vérification de l'unicité de l'email si modifié
    if (updateData.email && updateData.email !== partenaire.email) {
      const existingPartenaire = await Partenaire.findOne({ 
        where: { 
          email: updateData.email,
          id: { [Op.ne]: id }
        }
      });
      if (existingPartenaire) {
        return res.status(409).json({ error: 'Un partenaire avec cet email existe déjà' });
      }
    }

    // Mise à jour
    await partenaire.update(updateData);

    return res.status(200).json({ 
      message: 'Partenaire mis à jour avec succès',
      data: partenaire 
    });
  } catch (error) {
    console.error('Erreur PUT Partenaires:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Erreur de validation',
        details: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du partenaire' });
  }
}

// DELETE - Supprimer un partenaire
async function handleDelete(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID du partenaire requis' });
  }

  try {
    const partenaire = await Partenaire.findByPk(id);
    if (!partenaire) {
      return res.status(404).json({ error: 'Partenaire non trouvé' });
    }

    await partenaire.destroy();

    return res.status(200).json({ 
      message: 'Partenaire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur DELETE Partenaires:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression du partenaire' });
  }
}
