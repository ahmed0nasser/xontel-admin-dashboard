import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router/Router.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </StrictMode>
);
