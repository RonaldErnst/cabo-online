import { ClientServerEvents, ISocket, ServerClientEvents } from "@common/types/sockets";
import { useSocket } from "@contexts/SocketContext";
import type { NextPage } from "next";
import { MouseEventHandler } from "react";
import settings from "settings.frontend";
import { io, Socket } from "socket.io-client";

const socket: Socket<ServerClientEvents, ClientServerEvents> = io("http://localhost:4000", {
    transports: ["websocket", "polling", "flashsocket"]
});
        
socket.on("connect", () => {
    console.log("Conntected");
});

socket.on("connect_error", (err: Error) => {
    console.log(err);
});

socket.on("disconnect", (reason: string) => {
    console.log(`Disconnected because`, reason)
})

socket.on("CREATE_ROOM", () => {
    console.log("Server created room");
});

socket.on("CHAT", (message: string, playerId: string) => {
    console.log(`Player ${playerId} sent a message:`, message);
});

socket.on("ERROR", (error: Error) => {
    console.log(error);
})

const Home: NextPage = () => {

    const onClickHandler:MouseEventHandler = (e) => {
        e.preventDefault();
    
        socket.emit("CREATE_ROOM", "test123");
    
        socket.emit("CHAT", "Sending a test message");
    }

	return <div>
        <button onClick={onClickHandler}>Click me</button>
    </div>;
};

export default Home;
