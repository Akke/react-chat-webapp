import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import NotifyProvider from "./contexts/NotifyProvider.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <NotifyProvider>
                <App />
            </NotifyProvider>
        </AuthProvider>
    </StrictMode>,
);
