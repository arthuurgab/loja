import { useState, useEffect } from "react";
import {
  ShoppingCart,
  X,
  Trash2,
  Search,
  Menu,
  Plus,
  Minus,
  Package,
  CreditCard,
  User,
  CircleDollarSign,
} from "lucide-react";
import axios from "axios";

function Navbar() {
  const [aberto, setAberto] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);
  const [carrinhoProdutos, setCarrinhoProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLogado(!!token);
  }, []);

  const buscarCarrinho = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/carrinho/listar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCarrinhoProdutos(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      setCarrinhoProdutos([]);
    }
  };

  const alterarQuantidade = async (produto_id, novaQuantidade) => {
    if (novaQuantidade < 1) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3001/api/carrinho/alterar",
        { produto_id, quantidade: novaQuantidade },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarCarrinho();
    } catch (error) {
      console.error("Erro ao alterar quantidade:", error);
    }
  };

  const removerItem = async (produto_id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3001/api/carrinho/remover/${produto_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      buscarCarrinho();
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const limparCarrinho = async () => {
    if (!confirm("Tem certeza que deseja remover todos os itens do carrinho?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:3001/api/carrinho/limpar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      buscarCarrinho();
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  };

  const calcularTotal = () => {
    return carrinhoProdutos.reduce(
      (total, item) => total + parseFloat(item.subtotal),
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  useEffect(() => {
    if (aberto) {
      buscarCarrinho();
    }
  }, [aberto]);

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Package className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">
                  <a href="/">LojaVirtual</a>
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Cart Button */}
              <button
                onClick={() => setAberto(true)}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {carrinhoProdutos.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {carrinhoProdutos.length}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {logado ? (
                <a
                  href="/perfil"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  title="Perfil do usuário"
                >
                  <User />
                </a>
              ) : (
                <a
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </a>
              )}
              <a
                href="/estorno"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                title="Perfil do usuário"
              >
                <CircleDollarSign />
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setAberto(true)}
                className="relative p-2 text-gray-700"
              >
                <ShoppingCart className="h-6 w-6" />
                {carrinhoProdutos.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {carrinhoProdutos.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMenuMobile(!menuMobile)}
                className="p-2 text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {aberto && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setAberto(false)}
          ></div>

          <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col">
            {/* Cart Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Carrinho de Compras
              </h2>
              <button
                onClick={() => setAberto(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {carrinhoProdutos.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Seu carrinho está vazio
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Adicione produtos para começar suas compras
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carrinhoProdutos.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 flex-1 pr-2">
                          {item.nome_produto}
                        </h3>
                        <button
                          onClick={() => removerItem(item.produto_id)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              alterarQuantidade(
                                item.produto_id,
                                item.quantidade - 1
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            disabled={item.quantidade <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="w-8 text-center font-medium">
                            {item.quantidade}
                          </span>

                          <button
                            onClick={() =>
                              alterarQuantidade(
                                item.produto_id,
                                item.quantidade + 1
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {carrinhoProdutos.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(calcularTotal())}
                  </span>
                </div>

                <div className="space-y-3">
                  <a
                    href="/finalizar"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center block flex items-center justify-center"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Finalizar Compra
                  </a>

                  <button
                    onClick={limparCarrinho}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Carrinho
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
