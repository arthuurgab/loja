import { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  CreditCard,
  Smartphone,
  FileText,
  Package,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";

function Finalizar() {
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState("pix");

  // Estados para modais e parcelas
  const [modalPix, setModalPix] = useState(false);
  const [modalCredito, setModalCredito] = useState(false);
  const [modalBoleto, setModalBoleto] = useState(false);
  const [parcelas, setParcelas] = useState(1);

  const finalizarPedido = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3001/api/pedido/finalizar",
        {
          forma_pagamento: formaPagamento,
          parcelas: formaPagamento === "cartao" ? parcelas : undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Pedido finalizado com sucesso!");
      console.log("Resposta:", response.data);

      // Fechar modais após finalizar
      setModalPix(false);
      setModalCredito(false);
      setModalBoleto(false);

      buscarCarrinho(); // Atualiza carrinho depois
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error.response?.data || error);
      alert("Erro ao finalizar pedido");
    }
  };

  const buscarCarrinho = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:3001/api/carrinho/listar",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItens(data);
      calcularTotal(data);
    } catch (error) {
      console.error("Erro ao carregar o carrinho:", error);
    }
  };

  const calcularTotal = (dados) => {
    const totalCalculado = dados.reduce(
      (acc, item) => acc + parseFloat(item.subtotal),
      0
    );
    setTotal(totalCalculado);
  };

  const removerItem = async (produto_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3001/api/carrinho/remover/${produto_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      buscarCarrinho();
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const calcularDesconto = () => {
    if (formaPagamento === "pix") {
      return total * 0.05;
    }
    return 0;
  };

  const calcularTotalFinal = () => {
    return total - calcularDesconto();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  useEffect(() => {
    buscarCarrinho();
  }, []);

  const formasPagamento = [
    {
      id: "pix",
      nome: "PIX",
      descricao: "Aprovação instantânea",
      desconto: "5% de desconto",
      icon: Smartphone,
    },
    {
      id: "cartao",
      nome: "Cartão de Crédito",
      descricao: "Até 12x sem juros",
      desconto: "",
      icon: CreditCard,
    },
    {
      id: "cartao_debito",
      nome: "Cartão de Débito",
      descricao: "Aprovação em poucas horas",
      desconto: "",
      icon: CreditCard,
    },
    {
      id: "boleto",
      nome: "Boleto Bancário",
      descricao: "Vencimento em 3 dias",
      desconto: "",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Revisar Itens ({itens.length})
            </h2>

            {itens.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
                <a
                  href="/"
                  className="text-blue-600 hover:text-blue-500 mt-2 inline-block"
                >
                  Continuar comprando
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {itens.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.nome_produto}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantidade: {item.quantidade}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                    <button
                      onClick={() => removerItem(item.produto_id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo do Pedido
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({itens.length} itens)
                </span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frete</span>
                <span className="font-medium text-green-600">Grátis</span>
              </div>
              {calcularDesconto() > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Desconto PIX (5%)</span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(calcularDesconto())}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 mb-3">
                    Total
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatPrice(calcularTotalFinal())}
                  </span>
                </div>
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-4 border-t border-gray-200 pt-3">
              Forma de Pagamento
            </h2>
            <div className="space-y-4">
              {formasPagamento.map((forma) => {
                const Icon = forma.icon;
                return (
                  <label
                    key={forma.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formaPagamento === forma.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="pagamento"
                        value={forma.id}
                        checked={formaPagamento === forma.id}
                        onChange={(e) => setFormaPagamento(e.target.value)}
                        className="sr-only"
                      />
                      <div className="p-2 rounded-lg bg-gray-100 mr-4">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {forma.nome}
                          </h3>
                          {forma.desconto && (
                            <span className="text-sm font-medium text-green-600">
                              {forma.desconto}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {forma.descricao}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <button
              onClick={() => {
                if (formaPagamento === "pix") setModalPix(true);
                else if (formaPagamento === "cartao") setModalCredito(true);
                else if (formaPagamento === "boleto") setModalBoleto(true);
                else finalizarPedido();
              }}
              className="bg-blue-500 w-full mt-6 px-6 py-3 rounded-lg font-medium transition-colors text-white shadow-md"
            >
              Efetuar Pagamento
            </button>

            {/* Modal PIX */}
            {modalPix && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                  <h2 className="text-xl font-bold mb-4">Pagamento via PIX</h2>
                  <p>Escaneie o QR Code abaixo para concluir o pagamento:</p>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PagamentoPIX"
                    alt="QR Code PIX"
                    className="mx-auto my-4"
                  />
                  <button
                    onClick={() => {
                      setModalPix(false);
                      finalizarPedido();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Confirmar Pagamento
                  </button>
                  <button
                    onClick={() => setModalPix(false)}
                    className="ml-4 px-4 py-2 rounded border border-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Modal Cartão de Crédito */}
            {modalCredito && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                  <h2 className="text-xl font-bold mb-4">Cartão de Crédito</h2>
                  <p>Selecione o número de parcelas:</p>
                  <select
                    value={parcelas}
                    onChange={(e) => setParcelas(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded p-2 mt-2 mb-4"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}x sem juros
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setModalCredito(false);
                      finalizarPedido();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Confirmar Pagamento
                  </button>
                  <button
                    onClick={() => setModalCredito(false)}
                    className="ml-4 px-4 py-2 rounded border border-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Modal Boleto */}
            {modalBoleto && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                  <h2 className="text-xl font-bold mb-4">Boleto Bancário</h2>
                  <p>Será gerado um boleto com vencimento em 3 dias.</p>
                  <button
                    onClick={() => {
                      setModalBoleto(false);
                      finalizarPedido();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Gerar Boleto
                  </button>
                  <button
                    onClick={() => setModalBoleto(false)}
                    className="ml-4 px-4 py-2 rounded border border-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finalizar;
