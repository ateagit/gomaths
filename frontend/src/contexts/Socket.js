import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./Auth";
import { useUser } from "./User";

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState();
    const { user, getToken } = useAuth();
    const { setUserId } = useUser();

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

    useEffect(() => {
        if (socket) {
            socket.emit("get-user-id", { uid: user.uid }, ({ id }) => {
                setUserId(id);
            });
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
