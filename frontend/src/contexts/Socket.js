import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./Auth";

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState();
    const { user, getToken } = useAuth();

    useEffect(() => {
        async function setUp() {
            if (user) {
                const authToken = await getToken();
                setSocket(
                    io("http://localhost:3000", {
                        auth: {
                            token: authToken,
                        },
                    })
                );
            }
        }
        setUp();
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
