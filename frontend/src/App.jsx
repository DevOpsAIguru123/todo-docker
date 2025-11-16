import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "/api"; // ✅ important change

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchTodos() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, completed: false }),
    });
    const todo = await res.json();
    setTodos((prev) => [todo, ...prev]);
    setNewTitle("");
  }

  async function toggleTodo(todo) {
    const res = await fetch(`${API_BASE}/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function deleteTodo(todoId) {
    await fetch(`${API_BASE}/todos/${todoId}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== todoId));
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          🚀 Dockerized Todo List
        </h1>
        <p className="text-sm text-slate-400 mb-6 text-center">
          FastAPI + Postgres + React + Tailwind all vibing in containers.
        </p>

        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:ring focus:ring-indigo-500"
            placeholder="Add a new task…"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold"
          >
            Add
          </button>
        </form>

        {loading ? (
          <div className="text-center text-slate-400">Loading…</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-slate-500">
            No todos yet. Drop your first one ✨
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between px-3 py-2 bg-slate-900 rounded-lg border border-slate-700"
              >
                <button
                  onClick={() => toggleTodo(todo)}
                  className="flex items-center gap-2 text-left flex-1"
                >
                  <span
                    className={`w-4 h-4 rounded-full border ${
                      todo.completed
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-500"
                    }`}
                  />
                  <span
                    className={`text-sm sm:text-base ${
                      todo.completed ? "line-through text-slate-500" : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-xs text-rose-400 hover:text-rose-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
