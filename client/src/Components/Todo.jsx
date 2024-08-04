export default function Todo(props) {
  const { todo, setTodos, index } = props;

  const updateTodo = async (id, todoText) => {
    const res = await fetch(`/api/todos/${id}/todo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo: todoText }),
    });
    const json = await res.json();

    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.map((todo) => {
          if (todo._id === id) {
            return { ...todo, todo: todoText };
          }
          return todo;
        });
      });
    }
  };

  const updateStatus = async (id, todoStatus) => {
    const res = await fetch(`/api/todos/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: todoStatus }),
    });
    const json = await res.json();

    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.map((todo) => {
          if (todo._id === id) {
            return { ...todo, status: !todo.status };
          }
          return todo;
        });
      });
    }
  };

  const deleteTodo = async (id) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();

    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.filter((todo) => {
          return todo._id !== id;
        });
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.target.blur(); // Quits the input field
    }
  };

  return (
    <div className="todo">
      {/* <div className="mutations"> */}
      <button
        className="todo_status"
        onClick={() => updateStatus(todo._id, todo.status)}
      >
        {!todo.status ? "☐" : "☒"}
      </button>

      <button className="todo_delete" onClick={() => deleteTodo(todo._id)}>
        🗑️
      </button>
      {/* </div> */}
      <h3>{index + "."}</h3>
      <input
        className="todo_input"
        type="text"
        value={todo.todo || ""}
        // placeholder="..."
        onKeyDown={(event) => handleKeyDown(event)}
        onChange={(event) => updateTodo(todo._id, event.target.value)}
      />
    </div>
  );
}
