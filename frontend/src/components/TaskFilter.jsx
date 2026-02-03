const LABELS = {
  all: "Todas",
  todo: "Pendentes",
  in_progress: "Em andamento",
  done: "Concluídas",
};

export default function TaskFilter({ value, onChange }) {
  return (
    <div style={styles.toolbar}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
        aria-label="Filtrar tasks por status"
      >
        <option value="all">{LABELS.all}</option>
        <option value="todo">{LABELS.todo}</option>
        <option value="in_progress">{LABELS.in_progress}</option>
        <option value="done">{LABELS.done}</option>
      </select>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: 20,
  },
  select: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid var(--filter-border)",
    background: "var(--filter-bg)",
    color: "var(--filter-text)",
    outline: "none",
    cursor: "pointer",
    fontSize: 14,
  },
};