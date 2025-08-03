import { createContext, useState } from "react";
import Notification from "../components/Notification/Notification";

export const NotifyContext = createContext();

const NotifyProvider = (props) => {
    const [notify, setNotify] = useState({});

    const createNotification = (data) => {
        setNotify(data);
    }

    return (
        <NotifyContext.Provider value={{ createNotification }}>
            {props.children}

            {notify.msg ? <Notification type={notify.type} msg={notify.msg} id={Date.now()} /> : <></>}
        </NotifyContext.Provider>
    );
}

export default NotifyProvider;