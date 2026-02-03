import { useEffect, useRef, useState } from "react";

const STATUS_LABEL = {
  todo: "Pendente",
  in_progress: "Em andamento",
  done: "Concluída",
};

export default function TaskItem({ task, onDelete, onUpdateTitle, onChangeStatus }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(task.title);
  }, [task.title]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function startEdit() {
    setDraft(task.title);
    setIsEditing(true);
  }

  function cancelEdit() {
    setDraft(task.title);
    setIsEditing(false);
  }

  async function saveEdit() {
    const newTitle = draft.trim();

    if (!newTitle) {
      cancelEdit();
      return;
    }

    if (newTitle === task.title) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      await onUpdateTitle(task.id, newTitle);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  }

  async function handleStatusChange(e) {
    const newStatus = e.target.value;

    // evita request desnecessária
    if (newStatus === task.status) return;

    try {
      setSaving(true);
      await onChangeStatus(task.id, newStatus);
    } finally {
      setSaving(false);
    }
  }

  const isDone = task.status === "done";

  return (
    <li style={styles.item}>
      <div style={styles.left}>
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={saving}
          style={styles.select}
          title="Status"
        >
          <option value="todo">{STATUS_LABEL.todo}</option>
          <option value="in_progress">{STATUS_LABEL.in_progress}</option>
          <option value="done">{STATUS_LABEL.done}</option>
        </select>

        {isEditing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            disabled={saving}
            style={styles.editInput}
          />
        ) : (
          <span
            onDoubleClick={startEdit}
            title="Double-click para editar"
            style={{
              ...styles.title,
              textDecoration: isDone ? "line-through" : "none",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {task.title}
          </span>
        )}
      </div>

      <div style={styles.actions}>
        {!isEditing ? (
          <button onClick={startEdit} style={styles.actionBtn} disabled={saving}>
            ✏️
          </button>
        ) : (
          <button onClick={saveEdit} style={styles.actionBtn} disabled={saving}>
            💾
          </button>
        )}

        <button
          onClick={() => onDelete(task.id)}
          style={styles.actionBtn}
          disabled={saving}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

const styles = {
  item: {
    padding: 12,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  select: {
    padding: "6px 8px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
  },
  title: {
    cursor: "text",
    userSelect: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  editInput: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    outline: "none",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  actionBtn: {
    border: "none",
    background: "transparent",
    color: "var(--text)",
    cursor: "pointer",
    fontSize: 18,
  },
};
