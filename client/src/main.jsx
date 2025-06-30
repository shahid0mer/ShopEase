import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store.js";
import { PersistGate } from "redux-persist/integration/react";
import DarkModeInitializer from "./components/DarkModeInitializer.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PersistGate persistor={persistor} loading={null}>
      <Provider store={store}>
        <DarkModeInitializer />
        <App />
      </Provider>
    </PersistGate>
  </BrowserRouter>
);
