import express from "express";
import pedido from "../controllers/PedidoControl.js";
import autenticarToken from "../middlewares/AutenticarToken.js";

const router = express.Router();

router.post("/finalizar", autenticarToken, pedido.finalizar);
router.post("/simular/:id", pedido.simular);
export default router;
