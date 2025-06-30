import { DataTypes } from "sequelize";
import database from "../server/database.js";

// Mapeando os campos carrinho.
export default database.define("pedido", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  carrinho_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  data_criacao: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});
