const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Courrier = sequelize.define('Courrier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('ARRIVE', 'DEPART'),
      allowNull: false
    },
    objet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expediteur: {
      type: DataTypes.STRING,
      allowNull: true
    },
    destinataire: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateReception: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateEnvoi: {
      type: DataTypes.DATE,
      allowNull: true
    },
    statut: {
      type: DataTypes.ENUM('EN_ATTENTE', 'TRAITE', 'ARCHIVE'),
      defaultValue: 'EN_ATTENTE'
    },
    priorite: {
      type: DataTypes.ENUM('BASSE', 'NORMALE', 'HAUTE', 'URGENTE'),
      defaultValue: 'NORMALE'
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pieceJointe: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Courrier',
    timestamps: true
  });

  return Courrier;
};