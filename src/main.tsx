import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme/default/styles.css";
import "./theme/default/_variables.css";
import App from "./App";
import { worker } from "./mock/mock/browser";
import "bootstrap/dist/css/bootstrap.min.css";
/*
if (import.meta.env.MODE === "development") {
  await worker.start({ onUnhandledRequest: "bypass" });
}*/
await worker.start({ onUnhandledRequest: "bypass" });
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
