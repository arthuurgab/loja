import axios from "axios";
import { Carrinho, ItemCarrinho } from "../models/Index.js";
import Pedido from "../models/PedidoModel.js";
import Pagamento from "../models/PagamentoModel.js";
import User from "../models/UserModel.js";

async function finalizar(req, res) {
  const { metodo_pagamento, dados_cartao, parcelas } = req.body;

  const cpf_cnpj = req.cpf_cnpj;
  const usuario = await User.findOne({ where: { cpf_cnpj } });

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  const carrinho = await Carrinho.findOne({
    where: { usuario_id: usuario.id, status: true },
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

  let pedido;
  try {
    pedido = await Pedido.create({
      usuario_id: usuario.id,
      carrinho_id: carrinho.id,
      status: "Em processamento",
      total: valorTotal,
      data_criacao: new Date(),
      data_atualizacao: new Date(),
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ erro: "Erro ao finalizar compra." });
  }

  let pagamentoStatus = "Pendente";
  let mensagemPagamento = "";

  try {
    // Criar o pagamento já aqui para usar o ID depois
    let pagamento;

    if (metodo_pagamento === "pix") {
      pagamentoStatus = "Aguardando pagamento";
      mensagemPagamento = "Pagamento PIX gerado com sucesso! (Simulado)";
    } else if (
      metodo_pagamento === "cartao" ||
      metodo_pagamento === "cartao_debito"
    ) {
      if (
        !dados_cartao ||
        !dados_cartao.numero ||
        !dados_cartao.nome ||
        !dados_cartao.validade ||
        !dados_cartao.cvv
      ) {
        await pedido.update({
          status: "Cancelado",
          data_atualizacao: new Date(),
        });
        return res.status(400).json({ erro: "Dados do cartão incompletos" });
      }

      // Simulação de pagamento com cartão
      pagamentoStatus = "Pago"; // Simulado
      mensagemPagamento =
        "Pagamento com cartão processado com sucesso! (Simulado)";
    } else if (metodo_pagamento === "boleto") {
      pagamentoStatus = "Aguardando pagamento";
      mensagemPagamento = "Boleto gerado com sucesso! (Simulado)";
    } else {
      await pedido.update({
        status: "Cancelado",
        data_atualizacao: new Date(),
      });
      return res.status(400).json({ erro: "Método de pagamento inválido" });
    }

    pagamento = await Pagamento.create({
      pedido_id: pedido.id,
      usuario_id: usuario.id,
      metodo: metodo_pagamento,
      status: pagamentoStatus,
      valor_pago: valorTotal,
      data_pagamento: new Date(),
    });

    // Atualizar status do pedido conforme pagamento
    await pedido.update({
      status: pagamentoStatus,
      data_atualizacao: new Date(),
    });

    // Simulação redução estoque
    for (const item of carrinho.itens) {
      console.log(
        `Simulando diminuição de estoque para produto ${item.produto_id}, quantidade ${item.quantidade}`
      );
    }

    // Simulação envio para transportadora
    console.log("Simulando envio de dados para transportadora.");

    // Limpar carrinho
    await ItemCarrinho.destroy({ where: { carrinho_id: carrinho.id } });
    await carrinho.update({ status: false, valor_total: 0, peso_total: 0 });

    // Retornar pix_id somente para pagamento PIX
    return res.status(200).json({
      mensagem: mensagemPagamento,
      pedido_id: pedido.id,
      valor_total: valorTotal,
      status_pedido: pagamentoStatus,
      pix_id: metodo_pagamento === "pix" ? pagamento.id : null,
    });
  } catch (error) {
    console.error(
      "Erro ao processar pagamento ou integrar com APIs externas:",
      error
    );
    await pedido.update({ status: "Falha", data_atualizacao: new Date() });
    return res.status(500).json({
      erro: "Erro ao processar pagamento ou integrar com serviços externos.",
    });
  }
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
      await pedido.update({ data_atualizacao: new Date() });
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

async function listarPedidosPagos(req, res) {
  const cpf_cnpj = req.cpf_cnpj;

  try {
    const usuario = await User.findOne({ where: { cpf_cnpj } });
    if (!usuario)
      return res.status(404).json({ erro: "Usuário não encontrado." });

    const carrinho = await User.findOne({ where: { cpf_cnpj } });
    if (!carrinho)
      return res.status(404).json({ erro: "Usuário não encontrado." });

    console.log(carrinho);
    const pedidos = await Pagamento.findAll({
      where: {
        usuario_id: usuario.id,
        status: "Pago",
      },
    });
    console.log(pedidos);

    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos pagos:", error);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
}

async function solicitarEstorno(req, res) {
  const { pedido_id, motivo } = req.body;
  const cpf_cnpj = req.cpf_cnpj;

  try {
    const usuario = await User.findOne({ where: { cpf_cnpj } });
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const pedido = await Pedido.findOne({
      where: { id: pedido_id, usuario_id: usuario.id },
    });
    if (!pedido) {
      return res.status(404).json({
        erro: "Pedido não encontrado ou não pertence a este usuário.",
      });
    }

    const pagamento = await Pagamento.findOne({
      where: { pedido_id: pedido.id },
    });
    if (!pagamento) {
      return res
        .status(404)
        .json({ erro: "Pagamento não encontrado para este pedido." });
    }

    // Condições para estorno: pago, não entregue (simulado), e dentro do prazo (simulado 7 dias)

    // Simulação de chamada à API da Operadora de Cartão para estorno
    // const estornoPayload = { transacao_id: pagamento.id, valor: pagamento.valor_pago, motivo };
    // const estornoResponse = await axios.post("https://api.operadoracartao.com/estornar", estornoPayload);

    // if (estornoResponse.data.status === "aprovado") {
    //   pagamento.status = "Estornado";
    //   pedido.status = "Estornado";
    //   mensagemPagamento = "Estorno aprovado com sucesso!";
    // } else {
    //   pagamento.status = "Estorno recusado";
    //   pedido.status = "Estorno recusado";
    //   mensagemPagamento = "Estorno recusado pela operadora.";
    // }

    pagamento.status = "Estorno solicitado"; // Simulado
    pedido.status = "Estorno solicitado"; // Simulado
    mensagemPagamento =
      "Solicitação de estorno enviada com sucesso! (Simulado)";

    await pagamento.save();
    await pedido.update({ data_atualizacao: new Date() });

    return res.status(200).json({ mensagem: mensagemPagamento });
  } catch (error) {
    console.error("Erro ao solicitar estorno:", error);
    return res.status(500).json({ erro: "Erro ao solicitar estorno." });
  }
}

export default { finalizar, simular, listarPedidosPagos };
