import { useEffect, useState } from "react";
import Todo from "./Components/Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      const res = await fetch("/api/todos");
      const todos = await res.json();
      setTodos(todos);
    }
    getTodos();
  }, []); // empty array means run once

  const createNewTodo = async (e) => {
    e.preventDefault();

    if (content.length > 3) {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: content }),
      });
      const newTodo = await res.json();
      setContent("");
      setTodos([...todos, newTodo]);
    }
  };

  return (
    <main className="container">
      <h1 className="title">7 Taks</h1>
      <div className="todos">
        {todos.length > 0 &&
          todos.map((todo) => (
            <Todo key={todo._id} todo={todo} setTodos={setTodos} />
          ))}
        <form className="form" onSubmit={createNewTodo}>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a new task"
            required
            className="form_input"
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </main>
  );
}
