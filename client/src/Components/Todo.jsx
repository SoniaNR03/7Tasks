export default function Todo(props) {
  const { todo, setTodos } = props;

  const updateTodo = async (id, todoStatus) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: todoStatus, todo: todo.todo }),
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

  return (
    <div className="todo">
      <h3>{todo.todo}</h3>
      <div className="mutations">
        <button
          className="todo_status"
          onClick={() => updateTodo(todo._id, todo.status)}
        >
          {!todo.status ? "☐" : "☒"}
        </button>

        <button className="todo_delete" onClick={() => deleteTodo(todo._id)}>
          🗑️
        </button>
      </div>
    </div>
  );
}
