import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;