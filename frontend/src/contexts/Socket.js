import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(io("http://localhost:3000"));

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
