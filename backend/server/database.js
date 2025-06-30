import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Configuração da conexão com o banco
const sequelize = new Sequelize("loja", "postgres", "oqjf?", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  define: {
    timestamps: false,
    freezeTableName: true,
  },
});

export default sequelize;
