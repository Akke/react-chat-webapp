import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/login/LoginPage";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import RegisterPage from "../pages/register/RegisterPage";
import MainLayout from "../layouts/MainLayout/MainLayout";
import ChatPage from "../pages/chat/ChatPage";

const Router = () => {
    const { user } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<ProtectedRoute isAuthenticated={user != null} />}>
                    <Route element={<MainLayout />}>
                        <Route index element={<ChatPage />} />
                    </Route>
                </Route>

                <Route exact path="/register" element={<PublicRoute isAuthenticated={user != null} />}>
                    <Route element={<AuthLayout />}>
                        <Route index element={<RegisterPage />} />
                    </Route>
                </Route>

                <Route exact path="/login" element={<PublicRoute isAuthenticated={user != null} />}>
                    <Route element={<AuthLayout />}>
                        <Route index element={<LoginPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;