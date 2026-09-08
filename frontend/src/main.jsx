import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { ThemeProvider } from "./components/common/ThemeProvider.jsx";
import { ToastProvider } from "./components/common/ToastProvider.jsx";
import App from "./app/App.jsx";
import "./index.css";

// Safety net — agar koi async error kahin bhi unhandled reh jaye,
// kam se kam console mein trace ho, silent fail na ho
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);