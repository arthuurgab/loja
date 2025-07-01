import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/ui/Navbar";
import { RotateCw, ClipboardX } from "lucide-react";

function Estorno() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const buscarPedidosPagos = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const { data } = await axios.get(
        "http://localhost:3001/api/pedido/pagos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPedidos(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  const solicitarEstorno = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3001/api/pedido/estorno",
        {
          pedido_id: pedidoSelecionado,
          motivo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMensagem("Solicitação de estorno enviada com sucesso!");
      setPedidoSelecionado(null);
      setMotivo("");
      buscarPedidosPagos();
    } catch (error) {
      console.error("Erro ao solicitar estorno:", error);
      setMensagem("Falha ao solicitar estorno.");
    }
  };

  useEffect(() => {
    buscarPedidosPagos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <RotateCw className="w-6 h-6" />
          Solicitação de Estorno
        </h1>

        {mensagem && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-4 border border-green-300">
            {mensagem}
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ClipboardX className="h-12 w-12 mx-auto mb-2" />
            Nenhum pedido pago disponível para estorno.
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o pedido
              </label>
              <select
                value={pedidoSelecionado || ""}
                onChange={(e) => setPedidoSelecionado(Number(e.target.value))}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Selecione um pedido</option>
                {pedidos.map((pedido) => (
                  <option key={pedido.id} value={pedido.id}>
                    Pedido #{pedido.id} - {pedido.metodo} - Total: R${" "}
                    {pedido.valor_pago}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo do estorno
              </label>
              <textarea
                rows={4}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Explique o motivo da solicitação..."
              ></textarea>
            </div>

            <button
              onClick={solicitarEstorno}
              disabled={!pedidoSelecionado || motivo.length < 5}
              className="w-full bg-red-600 text-white py-3 rounded font-medium shadow-md hover:bg-red-700 transition"
            >
              Solicitar Estorno
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Estorno;
