import React, { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./app/app";
import CreatePost from "./app/features/create-post/create-post";
import { Layout } from "./app/core/layout/layout";
import { Login } from "./app/features/login";
import { ProtectedRoute } from "./app/core/protected-route";
import { ViewPost } from "./app/features/provide-feedback";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = extendTheme({
  fonts: {
    heading: `'Karla', sans-serif`,
    body: `'Karla', sans-serif`,
  },
  styles: {
    global: () => ({
      body: {
        bg: "#21252E",
        color: "#CBD9FF",
      },
    }),
  },
});

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <App />
      </Layout>
    ),
  },
  {
    path: "/create-post",
    element: (
      <ProtectedRoute>
        <Layout>
          <CreatePost />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/posts/:authorName/:slug",
    element: (
      <Layout>
        <ViewPost />
      </Layout>
    ),
  },
]);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
