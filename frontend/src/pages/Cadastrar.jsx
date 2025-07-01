import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Cadastro() {
  const [form, setForm] = useState({
    nome_razao_social: "",
    cpf_cnpj: "",
    email: "",
    senha_hash: "",
    telefone: "",
  });

  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/api/usuarios/inserir", form);
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.erro || "Erro ao cadastrar usuário.";
      setMensagem(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Cadastro</h2>

        {mensagem && (
          <p className="mb-4 text-red-600 text-sm text-center">{mensagem}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome_razao_social"
            placeholder="Nome completo"
            value={form.nome_razao_social}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="cpf_cnpj"
            placeholder="CPF ou CNPJ"
            value={form.cpf_cnpj}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            name="senha_hash"
            placeholder="Senha"
            value={form.senha_hash}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="tel"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Cadastrar
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Já tem conta?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
