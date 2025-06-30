import { useState } from "react";
import axios from "axios";
import Navbar from "../components/ui/Navbar";

function Perfil() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senhaAtual: "",
    novaSenha: "",
  });
  const [confirmaDesativar, setConfirmaDesativar] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const salvarAlteracoes = async () => {
    try {
      await axios.put("http://localhost:3001/api/usuarios/editar", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Dados atualizados com sucesso.");
      setForm((prev) => ({ ...prev, senhaAtual: "", novaSenha: "" }));
    } catch (err) {
      alert("Erro ao atualizar. Verifique sua senha atual.");
      console.error(err);
    }
  };

  const desativarConta = async () => {
    try {
      await axios.put(
        "http://localhost:3001/api/usuarios/desativar",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Conta desativada com sucesso.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch {
      alert("Erro ao desativar conta.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Meu Perfil</h1>

        <div className="bg-white p-6 rounded-lg shadow border space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Senha atual
            </label>
            <input
              type="password"
              name="senhaAtual"
              value={form.senhaAtual}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Nova senha
            </label>
            <input
              type="password"
              name="novaSenha"
              value={form.novaSenha}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            onClick={salvarAlteracoes}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Salvar Alterações
          </button>
        </div>

        <div className="mt-8 bg-white p-6 border rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2 text-red-600">
            Desativar Conta
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Isso tornará sua conta inativa. Você poderá reativá-la futuramente
            entrando em contato com o suporte.
          </p>

          <button
            onClick={() => setConfirmaDesativar(true)}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Desativar Conta
          </button>
        </div>
      </div>

      {/* Modal de confirmação */}
      {confirmaDesativar && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirmar Desativação
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza de que deseja desativar sua conta? Essa ação tornará
              seu acesso indisponível.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmaDesativar(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={desativarConta}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Desativar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
