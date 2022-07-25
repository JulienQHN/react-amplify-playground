/* src/App.js */
import React, { useEffect, useState } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { createTodo, deleteTodo, updateTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { Button, Heading, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { styles } from "./styles";
import { updatedAwsConfig } from "./aws-configure";
import ToDo from "./components/ToDo";

Amplify.configure(updatedAwsConfig);

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={styles.container}>
          <h1>Hello {user.username}</h1>
          <ToDo />
          <Button onClick={signOut}>Sign out</Button>
        </main>
      )}
    </Authenticator>
  );
}
