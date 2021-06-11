import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function useUser() {
    return useContext(UserContext);
}

export default function UserProvider({ children }) {
    const [userId, setUserId] = useState();
    const [name, setName] = useState();

    const [avatar, setAvatar] = useState();

    return (
        <UserContext.Provider
            value={{ userId, setUserId, name, setName, avatar, setAvatar }}
        >
            {children}
        </UserContext.Provider>
    );
}
