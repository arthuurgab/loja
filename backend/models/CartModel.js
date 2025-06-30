import { DataTypes } from "sequelize";
import database from "../server/database.js";

// Mapeando os campos carrinho.
export default database.define("carrinho", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
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
  endereco: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  valor_total: {
    type: DataTypes.NUMBER(10, 2),
    allowNull: true,
  },
  peso_total: {
    type: DataTypes.NUMBER(10, 2),
    allowNull: true,
  },
});
