import cartModel from "../models/CartModel.js";
import item_cart from "../models/CartItemModel.js";
import user from "../models/UserModel.js";
import axios from "axios";

async function listar(req, res) {
  const resData = await item_cart.findAll();
  res.json(resData);
}

async function adicionar(req, res) {
  const { id_produto, quantidade } = req.body;
  const cpf_cnpj = req.cpf_cnpj;

  try {
    const usuario = await user.findOne({ where: { cpf_cnpj } });

    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    const response = await axios.get(
      `https://loja-virtual-produtos.onrender.com/api/produtos/${id_produto}`
    );

    const produto = response.data;

    if (!produto || !produto.ativo) {
      return res
        .status(400)
        .json({ erro: "Produto não encontrado ou inativo" });
    }

    let carrinho = await cartModel.findOne({
      where: { usuario_id: usuario.id, status: true },
    });

    if (!carrinho) {
      carrinho = await cartModel.create({
        usuario_id: usuario.id,
        status: true,
        data_criacao: new Date(),
        valor_total: 0,
        peso_total: 0,
      });
    }

    const preco = parseFloat(produto.preco);
    const subtotal = preco * quantidade;

    await item_cart.create({
      carrinho_id: carrinho.id,
      produto_id: produto.idProduto,
      nome_produto: produto.nomeProduto,
      preco_unitario: preco,
      peso_unitario: produto.peso || 0,
      quantidade,
      subtotal,
    });

    carrinho.valor_total += subtotal;
    carrinho.peso_total += (produto.peso || 0) * quantidade;
    await carrinho.save();

    return res.json({
      mensagem: "Produto adicionado ao carrinho com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao adicionar produto:", error.message);
    return res.status(500).json({ erro: "Erro ao buscar produto" });
  }
}

async function alterar(req, res) {
  const { produto_id, quantidade } = req.body;
  const cpf_cnpj = req.cpf_cnpj;

  try {
    const usuario = await user.findOne({ where: { cpf_cnpj } });

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    const carrinho = await cartModel.findOne({
      where: { usuario_id: usuario.id, status: true },
    });

    if (!carrinho) {
      return res.status(404).send("Carrinho não encontrado.");
    }

    const item = await item_cart.findOne({
      where: {
        carrinho_id: carrinho.id,
        produto_id,
      },
    });

    if (!item) {
      return res.status(404).send("Produto não encontrado no carrinho.");
    }

    const novoSubtotal = item.preco_unitario * quantidade;
    const novaPesoTotal = item.peso_unitario * quantidade;

    await item_cart.update(
      {
        quantidade,
        subtotal: novoSubtotal,
      },
      {
        where: {
          carrinho_id: carrinho.id,
          produto_id,
        },
      }
    );

    const itens = await item_cart.findAll({
      where: { carrinho_id: carrinho.id },
    });

    const novoValorTotal = itens.reduce(
      (acc, i) => acc + parseFloat(i.subtotal),
      0
    );
    const novoPesoTotalCarrinho = itens.reduce(
      (acc, i) => acc + parseFloat(i.peso_unitario) * i.quantidade,
      0
    );

    carrinho.valor_total = novoValorTotal;
    carrinho.peso_total = novoPesoTotalCarrinho;
    await carrinho.save();

    return res.json({ mensagem: "Item atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao alterar a quantidade do produto:", error.message);
    return res
      .status(500)
      .json({ erro: "Erro ao atualizar item do carrinho." });
  }
}

async function remover(req, res) {
  const produto_id = req.params.produto_id;
  const cpf_cnpj = req.cpf_cnpj;

  try {
    const usuario = await user.findOne({ where: { cpf_cnpj } });
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });

    const carrinho = await cartModel.findOne({
      where: { usuario_id: usuario.id, status: true },
    });
    if (!carrinho)
      return res.status(404).json({ erro: "Carrinho não encontrado." });

    const item = await item_cart.findOne({
      where: {
        carrinho_id: carrinho.id,
        produto_id,
      },
    });
    if (!item)
      return res
        .status(404)
        .json({ erro: "Produto não encontrado no carrinho." });

    await item.destroy();

    const itensRestantes = await item_cart.findAll({
      where: { carrinho_id: carrinho.id },
    });
    const novoValorTotal = itensRestantes.reduce(
      (acc, item) => acc + parseFloat(item.subtotal),
      0
    );
    const novoPesoTotal = itensRestantes.reduce(
      (acc, item) => acc + item.peso_unitario * item.quantidade,
      0
    );

    await carrinho.update({
      valor_total: novoValorTotal,
      peso_total: novoPesoTotal,
    });

    return res.json({ mensagem: "Produto removido do carrinho." });
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error.message);
    return res.status(500).json({ erro: "Erro ao remover item." });
  }
}

async function remover_all(req, res) {
  const cpf_cnpj = req.cpf_cnpj;

  try {
    const usuario = await user.findOne({ where: { cpf_cnpj } });
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });

    const carrinho = await cartModel.findOne({
      where: { usuario_id: usuario.id, status: true },
    });
    if (!carrinho)
      return res.status(404).json({ erro: "Carrinho não encontrado." });

    await item_cart.destroy({ where: { carrinho_id: carrinho.id } });

    await carrinho.update({ valor_total: 0, peso_total: 0 });

    return res.json({ mensagem: "Carrinho limpo com sucesso." });
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error.message);
    return res.status(500).json({ erro: "Erro ao limpar carrinho." });
  }
}

export default { listar, adicionar, alterar, remover, remover_all };
