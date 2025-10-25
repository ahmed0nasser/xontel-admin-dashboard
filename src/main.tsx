import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router/Router.tsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <Router />
    </UserProvider>
  </StrictMode>
);
