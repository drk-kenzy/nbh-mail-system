
module.exports = (sequelize, DataTypes) => {
  const Courrier = sequelize.define('Courrier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    dateReception: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateSignature: {
      type: DataTypes.DATE,
      allowNull: true
    },
    objet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    canal: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Physique'
    },
    expediteur: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destinataire: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    delai: {
      type: DataTypes.STRING,
      allowNull: true
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'En attente'
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    files: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ARRIVE'
    }
  }, {
    tableName: 'Courriers',
    timestamps: true
  });

  return Courrier;
};
