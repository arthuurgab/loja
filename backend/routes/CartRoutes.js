import express from "express";
import cart from "../controllers/CartControl.js";
import autenticarToken from "../middlewares/AutenticarToken.js";

const router = express.Router();

router.get("/listar", autenticarToken, cart.listar);
router.post("/adicionar", autenticarToken, cart.adicionar);
router.put("/alterar", autenticarToken, cart.alterar);
router.delete("/remover/:produto_id", autenticarToken, cart.remover);
router.delete("/limpar", autenticarToken, cart.remover_all);

export default router;
