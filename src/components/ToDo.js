import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createTodo, deleteTodo, updateTodo } from "../graphql/mutations";
import { listTodos } from "../graphql/queries";
import { Button, Heading } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { styles } from "../styles";

const initialState = { name: "", description: "" };

const ToDo = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  const addTodo = async () => {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    } catch (err) {
      console.log("error creating todo:", err);
    }
  };

  const removeTodo = async (todo) => {
    try {
      // only id is needed for deleting
      const todoRemove = {
        id: todo.id,
      };
      await API.graphql(graphqlOperation(deleteTodo, { input: todoRemove }));
    } catch (err) {
      console.log("error deleting todo:", err);
    }
    fetchTodos();
  };

  const modifyTodo = async (todo) => {
    try {
      // only id is needed for modify
      const todoDetails = {
        id: todo.id,
        description: "My updated description!",
        name: "my updated name!",
      };

      await API.graphql(graphqlOperation(updateTodo, { input: todoDetails }));
    } catch (err) {
      console.log("error deleting todo:", err);
    }
    fetchTodos();
  };

  return (
    <div style={styles.container}>
      <Heading level={4}>Hello</Heading>
      <h2>Amplify Todos</h2>
      <input
        onChange={(event) => setInput("name", event.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={(event) => setInput("description", event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addTodo}>
        Create Todo
      </button>
      {todos.map((todo, index) => (
        <div key={todo.id ? todo.id : index} style={styles.todo}>
          <p style={styles.todoName}>{todo.name}</p>
          <p style={styles.todoDescription}>{todo.description}</p>
          <Button style={styles.button} onClick={() => removeTodo(todo)}>
            DELETE
          </Button>
          <Button style={styles.button} onClick={() => modifyTodo(todo)}>
            UPDATE
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ToDo;
