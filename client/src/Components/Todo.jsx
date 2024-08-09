export default function Todo(props) {
  const { todo, setTodos, id } = props;

  const updateTodo = async (id, index, todoText) => {
    const res = await fetch(`/api/todos/${id}/todo/${index}`, {
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
          if (todo.index === index) {
            return { ...todo, todo: todoText };
          }
          return todo;
        });
      });
    }
  };

  const updateStatus = async (id, index, todoStatus) => {
    const res = await fetch(`/api/todos/${id}/status/${index}`, {
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
          if (todo.index === index) {
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
        onClick={() => updateStatus(id, todo.index, todo.status)}
      >
        {!todo.status ? "☐" : "☒"}
      </button>

      {/* <button className="todo_delete" onClick={() => deleteTodo(todo._id)}>
        🗑️
      </button> */}
      {/* </div> */}
      <h3>{todo.index + 1 + "."}</h3>
      <input
        className="todo_input"
        type="text"
        value={todo.todo || ""}
        // placeholder="..."
        onKeyDown={(event) => handleKeyDown(event)}
        onChange={(event) => updateTodo(id, todo.index, event.target.value)}
      />
    </div>
  );
}
