import { useState } from "react";

export default function TaskForm({ onCreate, loading }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Digite um título.");
      return;
    }

    onCreate(title.trim());
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nova task..."
        style={styles.input}
        disabled={loading}
      />

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? "Adicionando..." : "Adicionar"}
      </button>

      {error && <p style={styles.error}>{error}</p>}
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "1px solid var(--border)",
    outline: "none",
    background: "var(--input-bg)",
    color: "var(--input-text)",
  },
  button: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--btn-bg)",
    color: "var(--btn-text)",
    cursor: "pointer",
  },
  error: {
    margin: 0,
    color: "var(--danger)",
    fontSize: 14,
  },
};
