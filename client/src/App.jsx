import { useEffect, useState } from "react";
import Todo from "./Components/Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [curDate, setDate] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos(date) {
      const res = await fetch("/api/todos/" + date);
      const obj = await res.json();
      setDate(obj._id);
      setTodos(obj.todos);
    }
    getTodos(getDateToString(new Date()));
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

  const getDateToString = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <main className="container">
      <h1 className="title">7 Taks</h1>
      <hr />
      <h3 className="date">{getDateToString(new Date())}</h3>
      <div className="todos">
        {todos.length > 0 &&
          todos.map((todo) => (
            <Todo
              key={todo.index}
              todo={todo}
              setTodos={setTodos}
              id={curDate}
            />
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
