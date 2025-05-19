// src/lib/ApolloClient.ts
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    split,
  } from "@apollo/client";
  import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
  import { createClient } from "graphql-ws";
  import { getMainDefinition } from "@apollo/client/utilities";
  
  // HTTP connection to backend
  const httpLink = new HttpLink({
    uri: "http://localhost:5000/graphql",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });
  
  // WebSocket connection for subscriptions
  const wsLink = new GraphQLWsLink(
    createClient({
      url: "ws://localhost:5000",
      connectionParams: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
  );
  
  // Use WebSocket for subscriptions, HTTP for queries/mutations
  const splitLink = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === "OperationDefinition" && def.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );
  
  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
  
  export default client;
  