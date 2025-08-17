import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import NotifyProvider from "./contexts/NotifyProvider.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import UserProvider from "./contexts/UserProvider.jsx";

import * as Sentry from "@sentry/react";
import LoggingProvider from "./contexts/LoggingProvider.jsx";

Sentry.init({
    dsn: "https://319a7936c796d080bc26c090c31f61e6@o4509844185153536.ingest.de.sentry.io/4509844186267728",
    integrations: [
        Sentry.consoleLoggingIntegration({ levels: [] }),
    ],
    enableLogs: true,
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <LoggingProvider>
            <AuthProvider>
                <UserProvider>
                    <NotifyProvider>
                        <App />
                    </NotifyProvider>
                </UserProvider>
            </AuthProvider>
        </LoggingProvider>
    </StrictMode>,
);
