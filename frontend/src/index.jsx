import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { warmupBackend } from "./lib/api";

const root = ReactDOM.createRoot(document.getElementById("root"));
warmupBackend();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);