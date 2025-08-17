import { createContext, useContext, useEffect, useRef, useState } from "react";
import { userServiceGetUserFromId, userServiceGetUsers } from "../service/userService";
import { AuthContext } from "./AuthProvider";
import { LoggingContext } from "./LoggingProvider";

export const UserContext = createContext();

const UserProvider = (props) => {
    const { user } = useContext(AuthContext);
    const [cachedUsers, setCachedUsers] = useState({});
    const fetchedUsers = useRef(new Set());
    const { createLog } = useContext(LoggingContext);

    // tricky react moment where states havent been properly updated yet
    // so if two API requests run simultaneously then it doesnt see that
    // cachedUsers has been updated since it uses old information.
    // this can be fixed by using useRef which doesnt trigger rerenders and
    // allows us to keep track of what user we actually have already cached.
    const cacheUser = (id) => {
        if(cachedUsers[id] || fetchedUsers.current.has(id)) return; // if the user has been cached or is in the process of being cached, skip

        fetchedUsers.current.add(id);

        userServiceGetUserFromId(id, user.jwt)
            .then((response) => {
                setCachedUsers(prev => ({
                    ...prev,
                    [id]: response
                }));
            })
            .catch((e) => {
                console.error(e);
            });
    }

    const cacheUsers = () => {
        if(Object.keys(cachedUsers).length > 0) return;

        userServiceGetUsers(user.jwt)
            .then((response) => {
                for(const userData of response) {
                    const id = userData.userId;
                    if(!cachedUsers[id] && !fetchedUsers.current.has(id)) {
                        fetchedUsers.current.add(id);
                        setCachedUsers(prev => ({
                            ...prev,
                            [id]: userData
                        }));
                    }
                }
            })
            .catch((e) => {
                console.error(e);
                createLog("error", e, "error_log_user_provider_cache_users_get_users_promise");
            });
    }

    return (
        <UserContext.Provider value={{ cacheUser, cachedUsers, cacheUsers }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserProvider;