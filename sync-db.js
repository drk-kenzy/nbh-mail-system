
const db = require('./models');

async function syncDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
    
    await db.sequelize.sync({ force: false, alter: true });
    console.log('Base de données synchronisée avec succès.');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
    process.exit(1);
  }
}

syncDatabase();
