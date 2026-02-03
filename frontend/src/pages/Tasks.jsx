import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import TaskItem from "../components/TaskItem.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskFilter from "../components/TaskFilter.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { createTask, listTasks, updateTask, deleteTask } from "../services/api.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Tasks() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const {theme, toggleTheme} = useTheme();

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 4000);
    return () => clearTimeout(t);
  }, [error]);

  async function load() {
    setError("");
    try {
      setLoadingInitial(true);
      const data = await listTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setError(err?.message || "Erro ao carregar tasks.");
    } finally {
      setLoadingInitial(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(title) {
    setError("");
    try {
      setCreating(true);
      const newTask = await createTask({ title });

      if (newTask?.id) {
        setTasks((prev) => [newTask, ...prev]);
      } else {
        await load();
      }
    } catch (err) {
      if (err?.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setError(err?.message || "Erro ao criar task.");
    } finally {
      setCreating(false);
    }
  }

  async function handleChangeStatus(taskId, newStatus) {
    setError("");
    try {
      const updated = await updateTask(taskId, { status: newStatus });

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
      );
    } catch (err) {
      if (err?.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setError(err?.message || "Erro ao atualizar status.");
      throw err;
    }
  }

  async function handleUpdateTitle(taskId, newTitle) {
    setError("");
    try {
      const updated = await updateTask(taskId, { title: newTitle });

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updated } : t))
      );
    } catch (err) {
      if (err?.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setError(err?.message || "Erro ao atualizar título.");
      throw err;
    }
  }

  async function handleDelete(taskId) {
    if (!confirm("Deseja realmente excluir esta task?")) return;

    setError("");
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      if (err?.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setError(err?.message || "Erro ao excluir task.");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const orderedTasks = useMemo(() => {
    const order = { todo: 0, in_progress: 1, done: 2 };
    return [...tasks].sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99));
  }, [tasks]);

const visibleTasks = useMemo(() => {
  if (filter === "all") return orderedTasks;
  return orderedTasks.filter((t) => t.status === filter);
}, [orderedTasks, filter]);
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Minhas Tasks</h1>
        <button onClick={handleLogout} style={styles.secondaryBtn}>
          Sair
        </button>
        <div style={{ display: "flex", gap: 8 }}>
  <button onClick={toggleTheme} style={styles.secondaryBtn}>
    {theme === "dark" ? "☀️ Claro" : "🌙 Escuro"}
  </button>

  <button onClick={handleLogout} style={styles.secondaryBtn}>
    Sair
  </button>
</div>
      </header>

      <TaskForm onCreate={handleCreate} loading={creating} />

      <TaskFilter value={filter} onChange={setFilter} /> 
      {error ? <p style={styles.error}>{error}</p> : null}

      {loadingInitial ? (
        <p>Carregando...</p>
      ) : visibleTasks.length === 0 ? (
        <p>Nenhuma task ainda.</p>
      ) : (
        <ul style={styles.list}>
          {visibleTasks.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onChangeStatus={handleChangeStatus}
              onDelete={handleDelete}
              onUpdateTitle={handleUpdateTitle}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 720,
    margin: "0 auto",
    padding: 16,
    color: "var(--text)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: { margin: 0, fontSize: 26 },

  secondaryBtn: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    cursor: "pointer",
  },

  error: { color: "var(--danger)" },

  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 },
};