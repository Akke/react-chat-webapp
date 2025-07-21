import { useEffect, useRef, useState } from "react";
import "./Notification.css";

const Notification = ({ type = "info", msg, id }) => {
    const [isVisible, setIsVisible] = useState(true);
    const timer = useRef(null);

    const duration = 5;

    const clearNotification = () => {
        setIsVisible(false);
        timer.current = null;
    }

    useEffect(() => {
        if(!msg) return;

        if(timer.current) {
            clearTimeout(timer.current);
            clearNotification();
        }

        setIsVisible(true);

        timer.current = setTimeout(() => clearNotification(), (duration-0.1) * 1000);

        return () => clearTimeout(timer.current);
    }, [id]);

    return isVisible ? (
        <div className={`notification ${type}`} key={id}>
            <div className="progress-bar" style={{animationDuration: `${duration}s`}}></div>
            <div className="message">
                <div className="title">{type}!</div>
                <div className="body">{msg}</div>
            </div>
        </div>
    ) : (<></>);
}

export default Notification;