import { DataTypes } from "sequelize";
import database from "../server/database.js";

// Mapeando os campos usuario.
export default database.define("usuario", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_razao_social: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cpf_cnpj: {
    type: DataTypes.STRING(18),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  senha_hash: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(17),
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  data_criacao: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  data_atualizacao: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});
