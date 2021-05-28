import { QueryInterface, DataTypes } from "sequelize";
module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    return await queryInterface.createTable("cards", {
      id: {
        type: DataTypes.STRING(250),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      cardId: { type: DataTypes.STRING(250), allowNull: false },
      listId: { type: DataTypes.STRING(250), allowNull: false },
      cardName: { type: DataTypes.STRING(250), allowNull: false },
      dateCreate: { type: DataTypes.STRING(250), allowNull: false },
      dateUpdate: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      shortlinkCard: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface: QueryInterface) => {
    return await queryInterface.dropTable("cards");
  },
};
