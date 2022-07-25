/* src/App.js */
import React, { useEffect, useState } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { createTodo, deleteTodo, updateTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { withAuthenticator, Button, Heading } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: "", description: "" };

const App = ({ signOut, user }) => {
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
      const todoDetails = {
        id: todo.id,
      };
      await API.graphql(graphqlOperation(deleteTodo, { input: todoDetails }));
    } catch (err) {
      console.log("error deleting todo:", err);
    }
  };

  const modifyTodo = async (todo) => {
    try {
      // only id is needed for deleting, rest is optional
      const todoDetails = {
        id: todo.id,
        description: "My updated description!",
        name: "my updated name!",
      };
      await API.graphql(graphqlOperation(updateTodo, { input: todoDetails }));
    } catch (err) {
      console.log("error deleting todo:", err);
    }
  };
  console.log(user.attributes.email);

  return (
    <>
      <div style={styles.container}>
        <Heading level={4}>Hello {user.attributes.email}</Heading>
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

        <Button onClick={signOut}>Sign out</Button>
      </div>
    </>
  );
};

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

export default withAuthenticator(App);
