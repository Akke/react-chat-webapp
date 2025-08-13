import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userServiceLogin } from "../service/userService";

export const AuthContext = createContext();

const AuthProvider = (props) => {
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const cache = localStorage.getItem("user");
        if(cache && !user) {
            const parsedCache = JSON.parse(cache);
            const decodedJwt = jwtDecode(parsedCache.jwt);

            if(decodedJwt && decodedJwt.exp) {
                const dateNow = new Date();
                const expiryDate = new Date(decodedJwt.exp*1000);
                if(dateNow > expiryDate) {
                    clearAuth();
                } else {
                    setUser(JSON.parse(cache));
                }
            }
        }
    }, []);

    useEffect(() => {
        setAuthReady(true);
    }, [user]);

    const setAuth = (token) => {
        const decoded = jwtDecode(token);

        const data = {
            jwt: token,
            id: decoded.id,
            user: decoded.user,
            email: decoded.email,
            avatar: decoded.avatar,
            invite: decoded.invite
        };

        localStorage.setItem("user", JSON.stringify(data));

        setUser(data);
    }

    const clearAuth = () => {
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setAuth, clearAuth, authReady, setUser }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;