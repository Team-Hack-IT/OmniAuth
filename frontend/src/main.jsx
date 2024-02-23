import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "@descope/react-sdk";
import { BrowserRouter as Router } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <DataContext> */}
      <Router>
        <AuthProvider projectId="P2bMT7le7rEj4uL9gVKZpK9Kd6Md">
          <App />
        </AuthProvider>
      </Router>
    {/* </DataContext> */}
  </React.StrictMode>
);
