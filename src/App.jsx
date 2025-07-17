import Login from "./components/Login/Login";
import "./App.css";
import Register from "./components/Register/Register";
import Chat from "./components/Chat/Chat";
import Notification from "./components/Notification/Notification";
import { useState } from "react";

function App() {
    const [notify, setNotify] = useState({});

    return (
      <>
        <Login notify={setNotify} />
        {notify.msg ? <Notification type={notify.type} msg={notify.msg} id={Date.now()} /> : null}
      </>
    )
}

export default App;
