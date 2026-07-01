import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Si tu archivo se llama App.tsx, importa './App'
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
