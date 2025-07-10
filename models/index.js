
const { Sequelize } = require('sequelize');
const path = require('path');

// Configuration de la base de données SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }
});

// Importation des modèles
const Partenaire = require('./Partenaire')(sequelize);

// Définition des associations (pour plus tard)
// Partenaire.hasMany(Mail, { foreignKey: 'partenaireId', as: 'courriers' });

const db = {
  sequelize,
  Sequelize,
  Partenaire
};

// Synchronisation automatique de la base de données
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');
    
    // Synchronisation des modèles (création des tables)
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées avec succès.');
    
    // Vérification si des données d'exemple existent
    const count = await Partenaire.count();
    if (count === 0) {
      console.log('📝 Insertion des données d\'exemple...');
      await insertSampleData();
    }
  } catch (error) {
    console.error('❌ Impossible de se connecter à la base de données:', error);
  }
};

// Insertion des données d'exemple
const insertSampleData = async () => {
  const samplePartenaires = [
    {
      nom: 'Direction Générale',
      type: 'Partenaire',
      email: 'dg@entreprise.com',
      statut: 'Actif',
      secteur: 'Administration',
      contact: 'Mme Martin',
      tel: '+33 1 23 45 67 89',
      ville: 'Paris',
      pays: 'France',
      courriers: 12,
      dernierContact: '2025-06-30'
    },
    {
      nom: 'Fournisseur ABC Informatique',
      type: 'Fournisseur',
      email: 'contact@abc.com',
      statut: 'Actif',
      secteur: 'Informatique',
      contact: 'M. Dupont',
      tel: '+33 6 12 34 56 78',
      ville: 'Lyon',
      pays: 'France',
      courriers: 5,
      dernierContact: '2025-06-28'
    },
    {
      nom: 'Client Premium SARL',
      type: 'Client',
      email: 'premium@client.com',
      statut: 'Inactif',
      secteur: 'Services',
      contact: 'Mme Leroy',
      tel: '+33 7 98 76 54 32',
      ville: 'Marseille',
      pays: 'France',
      courriers: 8,
      dernierContact: '2025-06-15'
    }
  ];

  try {
    await Partenaire.bulkCreate(samplePartenaires);
    console.log('✅ Données d\'exemple insérées avec succès.');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données d\'exemple:', error);
  }
};

// Initialisation automatique
syncDatabase();

module.exports = db;
