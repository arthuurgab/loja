import jwt from "jsonwebtoken";

function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ erro: "Token não fornecido." });

  jwt.verify(
    token,
    "AuYxgZR7MsWJSKZBAk2nAWhuRbXY5elsEtbJktkd0R5Tw2GXkFfjjoV8gWS4fF8p",
    (err, decoded) => {
      if (err) return res.status(403).json({ erro: "Token inválido." });

      req.cpf_cnpj = decoded.cpf_cnpj;
      next();
    }
  );
}

export default autenticarToken;
