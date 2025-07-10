
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Partenaire = sequelize.define('Partenaire', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('Client', 'Fournisseur', 'Consultant', 'Partenaire', 'Invité'),
      allowNull: false,
      defaultValue: 'Partenaire'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    statut: {
      type: DataTypes.ENUM('Actif', 'Inactif', 'Suspendu', 'En attente'),
      allowNull: false,
      defaultValue: 'Actif'
    },
    secteur: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    adresse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ville: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codePostal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pays: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'France'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    courriers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    dernierContact: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'partenaires',
    timestamps: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['statut']
      },
      {
        fields: ['type']
      }
    ]
  });

  return Partenaire;
};
