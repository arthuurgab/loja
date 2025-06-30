import { DataTypes } from "sequelize";
import database from "../server/database.js";

// Mapeando os campos item carrinho.
export default database.define("item_carrinho", {
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
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nome_produto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  preco_unitario: {
    type: DataTypes.NUMBER(10, 2),
    allowNull: true,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  peso_unitario: {
    type: DataTypes.NUMBER(10, 2),
    allowNull: true,
  },
  subtotal: {
    type: DataTypes.NUMBER(10, 2),
    allowNull: true,
  },
});
