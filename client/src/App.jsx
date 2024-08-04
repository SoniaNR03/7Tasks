import { useEffect, useState } from "react";
import Todo from "./Components/Todo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function App() {
  const getDateToString = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getDateFromString = (date) => {
    const [day, month, year] = date.split(".");
    return new Date(year, month - 1, day);
  };

  const [todos, setTodos] = useState([]);
  const [curDate, setDate] = useState(getDateToString(new Date()));
  const [content, setContent] = useState("");

  const createDateTodos = async (date) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    });
    const obj = await res.json();
    if (obj.acknowledged) {
      const res2 = await fetch(`/api/todos/${date}`);
      const obj2 = await res2.json();
      setDate(obj2._id);
      setTodos(obj2.todos);
    }
  };

  useEffect(() => {
    async function getTodos(date) {
      const res = await fetch(`/api/todos/${date}`);
      if (res.status !== 200) {
        createDateTodos(date);
      } else {
        const obj = await res.json();
        setDate(obj._id);
        setTodos(obj.todos);
      }
    }
    getTodos(curDate);
  }, [curDate]); // empty array means run once

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
      <hr />
      <div className="container_date">
        <DatePicker
          selected={getDateFromString(curDate)}
          dateFormat={"dd.MM.YYYY"}
          onChange={(date) => setDate(getDateToString(date))}
          customInput={<button className="button_date">{curDate} 📅</button>}
        />
      </div>

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
      </div>
    </main>
  );
}
