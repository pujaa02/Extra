const io = require("socket.io")(server, {
  cors: {
    origin: "http://your-client-url", // Replace with your client URL
    methods: ["GET", "POST"],
    credentials: true // If your application requires cookies/auth
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("paymentSuccess", (data) => {
    io.emit("notification", { message: "New order placed by user " + data.userId });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import instance from "../../../base-axios/useAxios";
import { handleError } from "../../../utils/util";
import { State } from "../../../Types/reducer";
import "./notification.css";

const socket = io("http://localhost:3000");

const Notification: React.FC = () => {
    const [newNotifications, setNewNotifications] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const driver_id = useSelector((state: State) => state.IDs.DriverID);

    useEffect(() => {
        const fetchnotification = async () => {
            try {
                const res = await instance.get(`/notification/fetchnotification/${driver_id}`);
                setNewNotifications(res.data.data.driver_notification.filter((notif) => !notif.isRead && !notif.isDeleted));
            } catch (error) {
                handleError(error, dispatch, navigate);
            }
        };

        fetchnotification();

        socket.on("notification", (notification) => {
            setNewNotifications((prevNotifications) => [notification, ...prevNotifications]);
        });

        return () => {
            socket.off("notification"); // Unsubscribe from notification event
        };
    }, [driver_id, dispatch, navigate]);

    // ... existing JSX ...
};

export default Notification;


import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import instance from "../../../base-axios/useAxios";
import toast from "react-hot-toast";
import Header from "../../../components/Header/Header";
import "./payment.css";

const socket = io("http://localhost:3000");

const Payment: React.FC = () => {
    // ... existing state and redux setup ...

    useEffect(() => {
        // Listen for notification events from the server
        socket.on("notification", (notification) => {
            toast.success(notification.message);
        });

        // Clean up the socket connection on component unmount
        return () => {
            socket.off("notification"); // Unsubscribe from notification event
        };
    }, []);

    const payment = async () => {
        // ... existing payment logic ...

        if (res.data.message === "Successfully Order placed") {
            navigate("/dashboard/order");

            // Emit a notification event to the server
            socket.emit("paymentSuccess", {
                userId: user.id,
                message: "Your order has been placed successfully!",
            });
        }
    };

    // ... existing JSX ...
};

export default Payment;
