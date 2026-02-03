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
  toolbar: { margin: "10px 0 12px" },
  select: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
  },
};