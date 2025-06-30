import express from "express";
import user from "../controllers/UserControl.js";
import autenticarToken from "../middlewares/AutenticarToken.js";

const router = express.Router();

router.get("/listar", autenticarToken, user.listar);
router.post("/inserir", user.inserir);
router.put("/alterar", autenticarToken, user.alterar);
router.put("/desativar", autenticarToken, user.desativar);

export default router;
