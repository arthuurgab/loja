import express from "express";
import cors from "cors";

import database from "./database.js";

import userRoutes from "../routes/UserRoutes.js";

import authRoutes from "../routes/AuthRoutes.js";

import cartRoutes from "../routes/CartRoutes.js";

import pedidoRoutes from "../routes/PedidoRoutes.js";

// try catch para verificar a conexão do banco.
try {
  await database.authenticate();
  console.log("Conexão com o banco de dados realizada com sucesso.");
} catch (error) {
  console.error("Erro ao conectar com o banco de dados:", error);
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas usuários.
app.use("/api/usuarios", userRoutes);

// Rota Login
app.use("/api", authRoutes);

// Rota carrinho
app.use("/api/carrinho", cartRoutes);

app.use("/api/pedido", pedidoRoutes);

// Ouve a porta.
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
