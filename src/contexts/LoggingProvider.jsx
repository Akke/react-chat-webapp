import { createContext } from "react";
import * as Sentry from "@sentry/react";

export const LoggingContext = createContext();

const LoggingProvider = (props) => {
    const createLog = (severity, message, action) => {
        Sentry.logger[severity](message, { action: action });

        if(import.meta.env.VITE_NODE_ENV == "dev") {
            logMessage(severity, message);
        }
    }

    const logMessage = (severity, message) => {
        const timestamp = new Date().toISOString();
        const text = `[${timestamp}] ${message}`;

        switch(severity) {
            case "warning":
                console.warn(text);
                break;
            case "error":
                console.error(text);
                break;
            default:
                console.log(text);
                break;
        }
    }

    return (
        <LoggingContext.Provider value={{ createLog }}>
            {props.children}
        </LoggingContext.Provider>
    );
};

export default LoggingProvider;