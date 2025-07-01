import axios from "axios";
import { Carrinho, ItemCarrinho } from "../models/Index.js";
import Pedido from "../models/PedidoModel.js";
import Pagamento from "../models/PagamentoModel.js";
import User from "../models/UserModel.js";

async function finalizar(req, res) {
  const { metodo_pagamento, dados_cartao, parcelas } = req.body;

  console.log("Método de pagamento:", metodo_pagamento);

  const cpf_cnpj = req.cpf_cnpj;
  const usuario = await User.findOne({ where: { cpf_cnpj } });

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  const carrinho = await Carrinho.findOne({
    where: { usuario_id: usuario.id },
    include: [{ model: ItemCarrinho, as: "itens" }],
  });

  if (!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
    return res
      .status(400)
      .json({ erro: "Carrinho vazio ou itens não encontrados" });
  }

  const valorTotal = carrinho.itens.reduce((acc, item) => {
    return acc + parseFloat(item.subtotal);
  }, 0);

  const pedido = await Pedido.create({
    usuario_id: usuario.id,
    carrinho_id: carrinho.id,
    status: "Em processamento",
    total: valorTotal,
  });

  // PIX
  if (metodo_pagamento === "pix") {
    // const gerarPix = await axios.post("https://viga-bank.onrender.com/gerar/pix", payload);

    await Pagamento.create({
      pedido_id: pedido.id,
      usuario_id: usuario.id,
      metodo: "pix",
      status: "Aguardando pagamento",
      valor_pago: valorTotal,
    });

    return res.status(200).json({
      mensagem: "Pagamento PIX gerado com sucesso",
      pedido_id: pedido.id,
      valor_total: valorTotal,
      qr_code: "",
      copia_cola: "",
      pix_id: 1,
    });
  }

  // Cartão de Crédito ou Débito
  if (metodo_pagamento === "cartao" || metodo_pagamento === "cartao_debito") {
    if (
      !dados_cartao ||
      !dados_cartao.numero ||
      !dados_cartao.nome ||
      !dados_cartao.validade ||
      !dados_cartao.cvv
    ) {
      return res.status(400).json({ erro: "Dados do cartão incompletos" });
    }

    await Pagamento.create({
      pedido_id: pedido.id,
      usuario_id: usuario.id,
      metodo: metodo_pagamento,
      status: "Pago",
      valor_pago: valorTotal,
    });

    return res.status(200).json({
      mensagem: "Pagamento com cartão processado com sucesso",
      pedido_id: pedido.id,
      valor_total: valorTotal,
      parcelas: metodo_pagamento === "cartao" ? parcelas : 1,
    });
  }
  return res.status(400).json({ erro: "Método de pagamento inválido" });
}

async function simular(req, res) {
  const { id } = req.params;

  try {
    const pagamento = await Pagamento.findByPk(id);
    if (!pagamento) {
      return res.status(404).json({ erro: "Pagamento não encontrado" });
    }

    pagamento.status = "Pago";
    pagamento.data_pagamento = new Date();
    await pagamento.save();

    const pedido = await Pedido.findByPk(pagamento.pedido_id);
    if (pedido) {
      pedido.status = "Pago";
      await pedido.save();
    }

    const carrinho = await Carrinho.findOne({
      where: { usuario_id: pagamento.usuario_id },
    });

    if (carrinho) {
      await ItemCarrinho.destroy({
        where: { carrinho_id: carrinho.id },
      });
    }

    return res.status(200).json({
      mensagem: "Pagamento confirmado com sucesso",
      pagamento,
      pedido,
    });
  } catch (error) {
    console.error("Erro ao simular pagamento:", error);
    return res.status(500).json({ erro: "Erro ao simular pagamento" });
  }
}

export default { finalizar, simular };
