import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  CreditCard,
  Package,
  AlertCircle,
} from "lucide-react";

function Cadastro() {
  const [form, setForm] = useState({
    nome_razao_social: "",
    cpf_cnpj: "",
    email: "",
    senha_hash: "",
    telefone: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Limpar erro específico quando o usuário começar a digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Limpar mensagem geral
    if (mensagem) {
      setMensagem("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.nome_razao_social.trim()) {
      newErrors.nome_razao_social = "Nome é obrigatório";
    }

    if (!form.cpf_cnpj.trim()) {
      newErrors.cpf_cnpj = "CPF/CNPJ é obrigatório";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!form.senha_hash.trim()) {
      newErrors.senha_hash = "Senha é obrigatória";
    } else if (form.senha_hash.length < 8) {
      newErrors.senha_hash = "Senha deve ter pelo menos 8 caracteres";
    }

    if (!form.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMensagem("");

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/usuarios/inserir",
        form
      );

      // Mostrar mensagem de sucesso
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2";
      successMessage.innerHTML = `
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>Cadastro realizado com sucesso!</span>
      `;
      document.body.appendChild(successMessage);

      setTimeout(() => {
        document.body.removeChild(successMessage);
        navigate("/login");
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.erro || "Erro ao cadastrar usuário.";
      setMensagem(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-purple-600 p-3 rounded-full">
            <Package className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{" "}
          <Link
            to="/login"
            className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
          >
            faça login se já tem uma conta
          </Link>
        </p>
      </div>

      {/* Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          {/* Error Message */}
          {mensagem && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{mensagem}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nome Field */}
            <div>
              <label
                htmlFor="nome_razao_social"
                className="block text-sm font-medium text-gray-700"
              >
                Nome Completo *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nome_razao_social"
                  name="nome_razao_social"
                  type="text"
                  required
                  value={form.nome_razao_social}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors sm:text-sm ${
                    errors.nome_razao_social
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.nome_razao_social && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nome_razao_social}
                </p>
              )}
            </div>

            {/* CPF/CNPJ Field */}
            <div>
              <label
                htmlFor="cpf_cnpj"
                className="block text-sm font-medium text-gray-700"
              >
                CPF/CNPJ *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="cpf_cnpj"
                  name="cpf_cnpj"
                  type="text"
                  required
                  value={form.cpf_cnpj}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors sm:text-sm ${
                    errors.cpf_cnpj ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="000.000.000-00"
                />
              </div>
              {errors.cpf_cnpj && (
                <p className="mt-1 text-sm text-red-600">{errors.cpf_cnpj}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors sm:text-sm ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="senha_hash"
                className="block text-sm font-medium text-gray-700"
              >
                Senha *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="senha_hash"
                  name="senha_hash"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={form.senha_hash}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors sm:text-sm ${
                    errors.senha_hash ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.senha_hash && (
                <p className="mt-1 text-sm text-red-600">{errors.senha_hash}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Use pelo menos 8 caracteres com uma mistura de letras, números e
                símbolos
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-700"
              >
                Telefone *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  required
                  value={form.telefone}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors sm:text-sm ${
                    errors.telefone ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.telefone && (
                <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:scale-105 active:scale-95"
                } shadow-lg`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  "Criar Conta"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
