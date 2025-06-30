import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/ui/Navbar";
import { ShoppingCart, Star, Heart } from "lucide-react";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://loja-virtual-produtos.onrender.com/api/produtos")
      .then((res) => {
        setProdutos(res.data.produtos);
        const initialQuantidades = {};
        res.data.produtos.forEach((p) => {
          initialQuantidades[p.idProduto] = 1;
        });
        setQuantidades(initialQuantidades);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setLoading(false);
      });
  }, []);

  const handleQuantidadeChange = (id, value) => {
    const novaQuantidade = Math.max(1, parseInt(value) || 1);
    setQuantidades({ ...quantidades, [id]: novaQuantidade });
  };

  const Comprar = async (id_produto) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/api/carrinho/adicionar",
        {
          id_produto,
          quantidade: quantidades[id_produto] || 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Produto adicionado ao carrinho!");
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      alert("Não foi possível adicionar o produto ao carrinho.");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Ofertas Imperdíveis
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Até 50% de desconto em produtos selecionados
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-xl text-gray-600">
              Confira nossa seleção especial de produtos com as melhores ofertas
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {produtos.map((produto) => (
                <div
                  key={produto.idProduto}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={produto.imagemUrl}
                      alt={produto.nomeProduto}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {produto.nomeProduto}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {produto.descricao || "Produto sem descrição."}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(produto.preco)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          onClick={() =>
                            handleQuantidadeChange(
                              produto.idProduto,
                              (quantidades[produto.idProduto] || 1) - 1
                            )
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          className="w-12 text-center border-0 focus:ring-0 py-1"
                          value={quantidades[produto.idProduto] || 1}
                          onChange={(e) =>
                            handleQuantidadeChange(
                              produto.idProduto,
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          onClick={() =>
                            handleQuantidadeChange(
                              produto.idProduto,
                              (quantidades[produto.idProduto] || 1) + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 font-semibold"
                        onClick={() => Comprar(produto.idProduto)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Fique por dentro das novidades
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Receba ofertas exclusivas e lançamentos em primeira mão
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Inscrever-se
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=" bg-gray-900 border-gray-800  pt-8 text-center text-gray-400">
        <p>&copy; 2024 LojaVirtual. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
