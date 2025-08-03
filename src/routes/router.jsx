import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Chat from "../components/Chat/Chat";

const Router = () => {
    const { user } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<ProtectedRoute isAuthenticated={user != null} />}>
                    <Route index element={<Chat />} />
                </Route>

                <Route exact path="/register" element={<PublicRoute isAuthenticated={user != null} />}>
                    <Route index element={<Register />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;