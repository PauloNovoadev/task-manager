import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../services/api.js";

export default function Register() {
  const navigate = useNavigate();

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
      await register({ email: email.trim(), password });
      
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Criar conta</h1>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
            disabled={loading}
          />
        </label>

        {error ? <p style={styles.error}>{error}</p> : null}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Criando..." : "Cadastrar"}
        </button>

        <p style={styles.footer}>
          Já tem conta? <Link to="/login">Fazer login</Link>
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
    border: "1px solid #ddd",
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
    border: "1px solid #222",
    background: "#222",
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  error: { margin: 0, color: "crimson", fontSize: 14 },
  footer: { margin: 0, fontSize: 14 },
};
