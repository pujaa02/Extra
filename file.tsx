// utils/socket.js
import { io } from "socket.io-client";

// Replace BASE_URL with your actual backend URL
const BASE_URL = "http://localhost:8000"; 

const socket = io(BASE_URL, {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd" // If needed for authentication
    }
});

export default socket;

import React, { useEffect } from "react";
import socket from "../../../utils/socket";
import { useSelector } from "react-redux";
import { State_user } from "../../../Types/reducer";

const DriverComponent = () => {
    const user = useSelector((state: State_user) => state.user);

    useEffect(() => {
        // Emit the joinRoom event to join the "drivers" room
        if (user.role_id === 3) { // Assuming role_id 3 represents drivers
            socket.emit("joinRoom", "drivers");
        }

        return () => {
            // Optionally leave the room when the component unmounts
            socket.emit("leaveRoom", "drivers");
        };
    }, [user.role_id]);

    return (
        <div>
            <h1>Driver Dashboard</h1>
            {/* Other components */}
        </div>
    );
};

export default DriverComponent;


io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("leaveRoom", (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
    });

    socket.on("disconnect", () => {
        console.log('User disconnected');
    });
});
