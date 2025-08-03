import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import NotifyProvider from "./contexts/NotifyProvider.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <NotifyProvider>
            <App />
        </NotifyProvider>
    </StrictMode>,
);
