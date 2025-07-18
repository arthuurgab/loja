import user from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

// função listar usuários
async function listar(req, res) {
  const { nome_razao_social, email, cpf_cnpj, status } = req.query;
  const whereClause = {};

  if (nome_razao_social) {
    whereClause.nome_razao_social = { [Op.like]: `%${nome_razao_social}%` };
  }
  if (email) {
    whereClause.email = { [Op.like]: `%${email}%` };
  }
  if (cpf_cnpj) {
    whereClause.cpf_cnpj = { [Op.like]: `%${cpf_cnpj}%` };
  }
  if (status) {
    whereClause.status = status === "ativo";
  }

  try {
    const resData = await user.findAll({
      where: whereClause,
      attributes: [
        "nome_razao_social",
        "email",
        "telefone",
        "status",
        "data_criacao",
        "data_atualizacao",
        "cpf_cnpj",
      ],
    });
    res.json(resData);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).send("Erro interno ao listar usuários.");
  }
}

// função cadastrar usuários
async function inserir(req, res) {
  const { nome_razao_social, cpf_cnpj, email, senha_hash, telefone } = req.body;

  try {
    const senha_com_hash = await bcrypt.hash(senha_hash, 10);

    const novoUsuario = await user.create({
      nome_razao_social,
      cpf_cnpj,
      email,
      senha_hash: senha_com_hash,
      telefone,
    });

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: {
        id: novoUsuario.id,
        nome_razao_social,
        email,
        cpf_cnpj,
        telefone,
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ erro: "Erro ao cadastrar usuário." });
  }
}

// função editar usuário
async function alterar(req, res) {
  const { nome_razao_social, email, telefone, senha_nova, senha_atual } =
    req.body;
  const cpf_cnpj = req.cpf_cnpj;

  try {
    const usuario = await user.findOne({ where: { cpf_cnpj } });

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    // Verifica senha atual
    const senhaValida = await bcrypt.compare(senha_atual, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).send("Senha atual inválida.");
    }

    // Validações Nome/Razão Social
    if (!nome_razao_social) {
      return res.status(422).send("Nome/Razão Social é obrigatório.");
    }

    // Validações email
    if (!email) {
      return res.status(422).send("Email é obrigatório.");
    }

    // Validações telefone
    if (!telefone) {
      return res.status(422).send("Telefone é obrigatório.");
    }

    // Verifica se email já existe e não é o do próprio usuário
    const verificarEmail = await user.findOne({ where: { email } });
    if (verificarEmail && verificarEmail.cpf_cnpj !== cpf_cnpj) {
      return res.status(409).send("Email já cadastrado por outro usuário.");
    }

    // Hash da nova senha
    let novaSenhaHash = usuario.senha_hash;
    if (senha_nova) {
      if (senha_nova.length < 8) {
        return res
          .status(422)
          .send("A nova senha deve ter no mínimo 8 caracteres.");
      }
      novaSenhaHash = await bcrypt.hash(senha_nova, 10);
    }

    await user.update(
      {
        nome_razao_social,
        email,
        telefone,
        senha_hash: novaSenhaHash,
      },
      { where: { cpf_cnpj } }
    );

    res.json({ mensagem: "Dados atualizados com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar usuário:", error);
    res.status(500).send("Erro no servidor ao alterar usuário.");
  }
}

async function desativar(req, res) {
  const cpf_cnpj = req.cpf_cnpj;
  try {
    const usuario = await user.findOne({ where: { cpf_cnpj } });

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    await user.update({ status: false }, { where: { cpf_cnpj } });

    res.json({ mensagem: "Usuário desativado com sucesso." });
  } catch (error) {
    console.error("Erro ao desativar usuário:", error);
    res.status(500).send("Erro interno ao desativar o usuário.");
  }
}

async function ativar(req, res) {
  const { cpf_cnpj } = req.body;
  try {
    const usuario = await user.findOne({ where: { cpf_cnpj } });

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    await user.update({ status: true }, { where: { cpf_cnpj } });

    res.json({ mensagem: "Usuário ativado com sucesso." });
  } catch (error) {
    console.error("Erro ao ativar usuário:", error);
    res.status(500).send("Erro interno ao ativar o usuário.");
  }
}

export default { listar, inserir, alterar, desativar, ativar };
