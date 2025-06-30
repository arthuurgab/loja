import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET =
  "AuYxgZR7MsWJSKZBAk2nAWhuRbXY5elsEtbJktkd0R5Tw2GXkFfjjoV8gWS4fF8p";

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(422).send("O parâmetro Email e Senha são obrigatórios.");
  }

  try {
    // Validações Email
    const usuario = await user.findOne({ where: { email } });

    // Validações usuário.
    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    // Validações senha
    const verificaSenha = await bcrypt.compare(senha, usuario.senha_hash);

    if (!verificaSenha) {
      return res.status(401).send("Senha inválida.");
    }

    // Validações status
    if (!usuario.status) {
      return res.status(422).send("Usuario está inativo.");
    }

    // Cria token com CPF/CNPJ
    const token = jwt.sign(
      {
        cpf_cnpj: usuario.cpf_cnpj,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Envia token e Nome/Razão Social
    res.json({
      token,
      mensagem: `Login efetuado com sucesso! Bem vindo ${usuario.nome_razao_social}`,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ erro: "Erro ao tentar fazer login." });
  }
}

export default login;
