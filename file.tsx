import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"; // Import Socket.IO client
import instance from "../../../base-axios/useAxios";
import toast from "react-hot-toast";
import Header from "../../../components/Header/Header";
import "./payment.css";

const socket = io("http://localhost:3000"); // Replace with your server URL

const Payment: React.FC = () => {
    // ... existing code ...

    useEffect(() => {
        // Listen for notification events from the server
        socket.on("notification", (notification) => {
            toast.success(notification.message); // Display notification
        });

        // Clean up the socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const payment = async () => {
        if (address && phone) {
            try {
                const res = await instance({
                    url: `order/addorder/${user.id}`,
                    method: "POST",
                    data: { cart, address, phone }
                });

                if (res.data.message === "Successfully Order placed") {
                    navigate("/dashboard/order");

                    // Emit a notification event to the server
                    socket.emit("paymentSuccess", {
                        userId: user.id,
                        message: "Your order has been placed successfully!",
                    });
                }
            } catch (error) {
                handleError(error, dispatch, navigate);
            }
        } else {
            toast.error("Please fill the data First!!");
        }
    };

    // ... existing code ...

    return (
        // ... existing JSX ...
    );
};

export default Payment;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client"; // Import Socket.IO client
import instance from "../../../base-axios/useAxios";
import { handleError } from "../../../utils/util";
import { State } from "../../../Types/reducer";
import Header from "../../../components/Header/Header";
import "./notification.css";

const socket = io("http://localhost:3000"); // Replace with your server URL

const Notification: React.FC = () => {
    const [newNotifications, setNewNotifications] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const driver_id = useSelector((state: State) => state.IDs.DriverID);

    useEffect(() => {
        // Fetch initial notifications
        const fetchnotification = async () => {
            try {
                const res = await instance.get(`/notification/fetchnotification/${driver_id}`);
                setNewNotifications(res.data.data.driver_notification.filter((notif) => !notif.isRead && !notif.isDeleted));
            } catch (error) {
                handleError(error, dispatch, navigate);
            }
        };

        fetchnotification();

        // Listen for new notifications
        socket.on("notification", (notification) => {
            setNewNotifications((prevNotifications) => [notification, ...prevNotifications]);
        });

        return () => {
            socket.disconnect();
        };
    }, [driver_id, dispatch, navigate]);

    // ... render notifications ...

    return (
        // ... existing JSX ...
    );
};

export default Notification;


const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
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

