import { DataTypes } from "sequelize";
import database from "../server/database.js";

// Mapeando os campos item_pedido.
export default database.define("pagamento", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  metodo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  data_pagamento: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  valor_pago: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});
