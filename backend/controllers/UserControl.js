import user from "../models/UserModel.js";
import bcrypt from "bcrypt";

// função listar usuários
async function listar(req, res) {
  const resData = await user.findAll();
  res.json(resData);
}

// função cadastrar usuários
async function inserir(req, res) {
  const { nome_razao_social, cpf_cnpj, email, senha_hash, telefone } = req.body;

  // Validações Nome/Razão Social
  if (!nome_razao_social) {
    return res.status(422).send("O parâmetro Nome/Razão Social é obrigatório.");
  }

  // Validações CPF/CNPJ
  if (!cpf_cnpj) {
    return res.status(422).send("O parâmetro CPF/CNPJ é obrigatório.");
  }

  const verificarCPF = await user.findOne({ where: { cpf_cnpj } });
  if (verificarCPF) {
    return res.status(409).send("CPF/CNPJ já cadastrado.");
  }

  // Validações Email
  if (!email) {
    return res.status(422).send("O parâmetro Email é obrigatório.");
  }

  const verificarEmail = await user.findOne({ where: { email } });
  if (verificarEmail) {
    return res.status(409).send("Email já cadastrado.");
  }

  // Validações Senha
  if (!senha_hash) {
    return res.status(422).send("O parâmetro Senha é obrigatório.");
  }

  if (senha_hash.length < 8) {
    return res.status(422).send("A senha deve conter no mínimo 8 caracteres.");
  }

  const senha_com_hash = await bcrypt.hash(senha_hash, 10);

  // Validações Telefone
  if (!telefone) {
    return res.status(422).send("O parâmetro Telefone é obrigatório.");
  }

  const resData = await user.create({
    nome_razao_social,
    cpf_cnpj,
    email,
    senha_hash: senha_com_hash,
    telefone,
  });
  res.json({
    mensagem:
      "Usuário criado!! Faça login para aproveitar todos os benefícios da loja!",
  });
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

export default { listar, inserir, alterar, desativar };
