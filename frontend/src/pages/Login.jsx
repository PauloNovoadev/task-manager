import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../services/api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    
    if (!email.trim() || !password) {
      setError("Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);

      
      const data = await login({
        email: email.trim(),
        password,
      });

      
      if (!data?.token) {
        throw new Error("Resposta inválida do servidor (token ausente).");
      }

      
      loginWithToken(data.token);

      
      navigate("/tasks", { replace: true });
    } catch (err) {
      
      setError(err?.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Login</h1>

        <label style={styles.label}>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="user@email.com"
            disabled={loading}
          />
        </label>

        <label style={styles.label}>
          Senha
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
            disabled={loading}
          />
        </label>

        {error ? <p style={styles.error}>{error}</p> : null}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p style={styles.footer}>
          Não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 20,
    border: "1px solid #020202",
    borderRadius: 12,
  },
  title: { margin: 0, fontSize: 26 },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 14 },
  input: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
    outline: "none",
    fontSize: 14,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #181515",
    background: "#222",
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  error: { margin: 0, color: "crimson", fontSize: 14 },
  footer: { margin: 0, fontSize: 14 },
};