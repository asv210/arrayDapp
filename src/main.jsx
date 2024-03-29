import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import MetamaskProvider from "./utils/MetamaskProvider.jsx";
import { ArrayAppContextProvider } from "./context/ArrayAppContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MetamaskProvider>
      <ArrayAppContextProvider>
        <App />
      </ArrayAppContextProvider>
    </MetamaskProvider>
  </React.StrictMode>
);
