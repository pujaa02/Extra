npm install socket.io-client

// socket.ts
import { io } from "socket.io-client";

const socket = io("http://your-server-url"); // Replace with your server URL

export default socket;

// payment.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { State, State_user } from "../../../Types/reducer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import instance from "../../../base-axios/useAxios";
import socket from "../../../socket"; // Import the socket instance
import "./payment.css";

const Payment: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: State_user) => state.user);
    const cart = useSelector((state: State) => state.cart);
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    const changeaddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const changenumber = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    };

    const payment = async () => {
        if (address && phone) {
            try {
                const res = await instance.post(`/order/addorder/${user.id}`, { cart, address, phone });
                if (res.data.message === "Successfully Order placed") {
                    socket.emit("orderPlaced", {
                        userId: user.id,
                        cart,
                        address,
                        phone
                    }); // Emit socket event for a new order
                    navigate("/dashboard/order");
                }
            } catch (error) {
                handleError(error, dispatch, navigate);
            }
        } else {
            toast.error("Please fill the data First!!");
        }
    };

    if (cart.cart.length === 0) {
        return (
            <div className="order-container">
                {/* Your existing code */}
            </div>
        );
    }

    return (
        <div>
            {/* Your existing code */}
            <div className="payment_btn">
                <p onClick={() => payment()}>Go to Payment</p>
            </div>
        </div>
    );
};

export default Payment;


// Header.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationsIcon from '@mui/icons-material/Notifications';
import socket from "../../socket"; // Import the socket instance
import { State_user, State } from "../../Types/reducer";
import { NotificationData } from "../../Types/notification";
import { handleError } from "../../utils/util";
import "./header.css";

interface HeaderProps {
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const data = useSelector((state: State_user) => state.user);
    const id = useSelector((state: State) => state.IDs.DriverID);
    const [notification, setNotification] = useState<NotificationData[]>([]);

    useEffect(() => {
        // Fetch notifications initially
        const fetchInitialNotifications = async () => {
            try {
                const res = await instance.get(`/notification/fetchnotification/${id}`);
                setNotification(res.data.data.driver_notification);
            } catch (error) {
                handleError(error, dispatch, navigate);
            }
        };

        fetchInitialNotifications();

        // Listen for new notifications via socket
        socket.on("newNotification", (newNotif: NotificationData) => {
            setNotification((prevNotifs) => [newNotif, ...prevNotifs]);
        });

        // Cleanup on component unmount
        return () => {
            socket.off("newNotification");
        };
    }, [id, dispatch, navigate]);

    const count_unread_notifications = notification.filter(notif => !notif.isRead && !notif.isDeleted).length;

    return (
        <div className="header">
            <div className="logo">
                <Link to="/">
                    <img src={require("./logo.png")} alt="Logo" className="logo-img" />
                    Foodies
                </Link>
            </div>
            <ul className="nav">
                {data.role_id === 3 && (
                    <li className="notification-icon">
                        <Link to="/notifications">
                            <NotificationsIcon className="icon" />
                            {count_unread_notifications > 0 && (
                                <span className="notification-count">{count_unread_notifications}</span>
                            )}
                        </Link>
                    </li>
                )}
                {/* Other list items (Login, Logout, etc.) */}
            </ul>
        </div>
    );
};

export default Header;


npm install express socket.io


// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Optional, if needed for CORS policy

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Configure this based on your client URL
  },
});

app.use(cors());

// Optional: Express routes can go here
app.get('/', (req, res) => {
  res.send('Socket.IO Server is running.');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Custom events can be handled here
  socket.on('paymentMade', (data) => {
    console.log('Payment made:', data);
    io.emit('newNotification', { message: 'New payment received!', details: data });
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

const payment = async () => {
  // ... existing payment logic
  try {
    const res = await instance.post(`/order/addorder/${user.id}`, {
      cart, address, phone
    });
    if (res.data.message === "Successfully Order placed") {
      // Emit event after successful payment
      socket.emit('paymentMade', { userId: user.id, orderDetails: res.data.order });
      navigate("/dashboard/order");
    }
  } catch (error) {
    handleError(error, dispatch, navigate);
  }
};


const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});


import { useEffect } from 'react';
import io from 'socket.io-client';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = io('http://localhost:3001');

  useEffect(() => {
    // Listen for new notifications
    socket.on('newNotification', (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    // Clean up on component unmount
    return () => {
      socket.off('newNotification');
    };
  }, []);

  return (
    <div>
      {notifications.map((notification, index) => (
        <p key={index}>{notification.message}</p>
      ))}
    </div>
  );
};

export default NotificationComponent;


const io = socketIo(server, {
  cors: {
    origin: "http://your-client-domain.com", // Replace with your client URL
    methods: ["GET", "POST"],
  },
});


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('paymentMade', (data) => {
    console.log('Payment made:', data);
    io.emit('newNotification', { message: 'New payment received!', details: data });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = io('http://localhost:3001'); // Replace with your server URL

  useEffect(() => {
    // Listen for new notifications
    socket.on('newNotification', (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('newNotification');
    };
  }, []);

  return (
    <div>
      {notifications.map((notification, index) => (
        <p key={index}>{notification.message}</p>
      ))}
    </div>
  );
};

export default NotificationComponent;



