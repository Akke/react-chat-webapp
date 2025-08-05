import { createContext, useContext, useEffect, useState } from "react";
import { userServiceGetUsernameFromId } from "../service/userService";
import { AuthContext } from "./AuthProvider";

export const UserContext = createContext();

const UserProvider = (props) => {
    const { user } = useContext(AuthContext);
    const [cachedUsernames, setCachedUsernames] = useState({});

    const cacheUsernameFromId = (id) => {
        if(cachedUsernames[id]) return cachedUsernames[id];

        const username = userServiceGetUsernameFromId(id, user.jwt)
                .then((response) => setCachedUsernames(prev => ({...prev, [id]: response })))
                .catch((e) => console.error(e));
    }

    return (
        <UserContext.Provider value={{ cacheUsernameFromId, cachedUsernames }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserProvider;