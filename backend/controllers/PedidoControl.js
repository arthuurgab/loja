import Carrinho from "../models/CartModel.js";
import ItemCarrinho from "../models/CartItemModel.js";
import Pedido from "../models/PedidoModel.js";
import User from "../models/UserModel.js";

async function finalizar(req, res) {
  const cpf_cnpj = req.cpf_cnpj;
  console.log(cpf_cnpj);
  const { forma_pagamento } = req.body;

  try {
    const usuario = await User.findOne({ where: { cpf_cnpj } });
    if (!usuario) return res.status(404).send("Usuário não encontrado.");

    const carrinho = await Carrinho.findOne({
      where: { usuario_id: usuario.id, status: true },
    });
    if (!carrinho) return res.status(404).send("Carrinho não encontrado.");

    const itens = await ItemCarrinho.findAll({
      where: { carrinho_id: carrinho.id },
    });
    if (itens.length === 0) return res.status(400).send("Carrinho está vazio.");

    const pedido = await Pedido.create({
      usuario_cpf_cnpj: cpf_cnpj,
      valor_total: carrinho.valor_total,
      forma_pagamento,
      status: "Em processamento",
      endereco_entrega: usuario.endereco || "Endereço fixo ou do banco",
    });

    // Simular envio para operadora de pagamento
    const dadosPagamento = {
      cpf_cnpj,
      nome_razao: usuario.nome || usuario.razao_social,
      valor: carrinho.valor_total,
      data: new Date().toISOString(),
      endereco: usuario.endereco || "Endereço não informado",
      forma_pagamento,
    };
    console.log("➡️ Enviando para operadora de pagamento:", dadosPagamento);

    // Simulação da resposta da operadora
    const statusPagamento = "Pago"; // Simule outras situações conforme necessário

    await pedido.update({ status: statusPagamento });
    await carrinho.update({ status: false });

    // Simular envio para API de estoque
    const dadosEstoque = {
      pedido_id: pedido.id,
      itens: itens.map((item) => ({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
      })),
    };
    console.log("📦 Enviando para API de estoque:", dadosEstoque);

    // Simular envio para API da transportadora
    const dadosTransportadora = {
      cliente: {
        nome: usuario.nome || usuario.razao_social,
        cpf_cnpj,
        endereco: usuario.endereco || "Endereço não informado",
      },
      pedido_id: pedido.id,
      produtos: itens.map((item) => ({
        nome: item.nome_produto,
        quantidade: item.quantidade,
        peso: item.peso || 1, // valor genérico
      })),
    };
    console.log("🚚 Enviando para transportadora:", dadosTransportadora);

    return res.json({
      mensagem: "Pedido finalizado com sucesso (simulado).",
      pedido_id: pedido.id,
      status: statusPagamento,
      simulacoes: {
        pagamento: dadosPagamento,
        estoque: dadosEstoque,
        transportadora: dadosTransportadora,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao finalizar pedido:", error.message);
    return res.status(500).send("Erro ao processar o pedido.");
  }
}

export default { finalizar };
