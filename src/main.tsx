// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.css";
// Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import "./styles/style.css";
import App from "./App.tsx";
import { store } from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
