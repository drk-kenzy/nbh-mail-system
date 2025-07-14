'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Courrier extends Model {
    static associate(models) {
      // associations à ajouter plus tard si besoin
    }
  }
  Courrier.init({
    numero: DataTypes.STRING,
    dateReception: DataTypes.DATE,
    dateSignature: DataTypes.DATE,
    objet: DataTypes.STRING,
    canal: DataTypes.STRING,
    expediteur: DataTypes.STRING,
    destinataire: DataTypes.STRING,
    reference: DataTypes.STRING,
    delai: DataTypes.STRING,
    statut: DataTypes.STRING,
    observations: DataTypes.TEXT,
    files: DataTypes.TEXT,    // On stockera ici du JSON.stringify
    type: DataTypes.STRING    // "ARRIVE" ou "DEP"
  }, {
    sequelize,
    modelName: 'Courrier',
  });
  return Courrier;
};
