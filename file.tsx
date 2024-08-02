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

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State_user } from "../../../Types/reducer";
import { useNavigate } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import instance from "../../../base-axios/useAxios";
import { handleError } from "../../../utils/util";
import { order } from "../../../Types/order";
import socket from "../../../utils/socket";
import toast from "react-hot-toast";

const Order: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: State_user) => state.user);
    const [orderData, setOrderData] = useState<order[]>([]);
    const [notifications, setNotifications] = useState([]);

    const getuserorderdetail = async () => {
        await instance({
            url: `order/getorderdetail/${user.id}`,
            method: "GET",
        }).then((res) => {
            if (res.data.message === "Successfully get order Data") {
                socket.emit('paymentMade', { userId: user.id, orderDetails: res.data.data.finalresult });
                setOrderData(res.data.data.finalresult);
            }
        }).catch((error) => {
            handleError(error, dispatch, navigate);
        })
    }

    useEffect(() => {
        getuserorderdetail();
    }, []);

    useEffect(() => {
        socket.on("newNotification", (notification) => {
            setNotifications(prev => [...prev, notification]);
            toast.success(notification.message);
        });

        return () => {
            socket.off("newNotification");
        };
    }, []);

    if (orderData.length === 0) {
        return (
            <div className="position">
                <div className="p-5 ">
                    <p className="text-center text-4xl font-bold italic text-slate-600">No Order Here at Now</p>
                </div>
                <div className="mt-10 ml-16 p-5">
                    <p className="text-xl"><SendIcon className="mr-2" />Please Order Some Item first!!</p>
                    <p className="mt-5 ml-16 bg-slate-500 p-3 w-56 text-center text-xl text-slate-100 font-bold" onClick={() => navigate("/")}>Go for Order</p>
                </div>
            </div>
        )
    }

    return (
        <div className="position">
            <div className="p-5">
                <p className="text-center text-4xl font-bold italic text-slate-600">Your All Orders</p>
            </div>
            <div className="container">
                <table className="table-auto mt-10 max-w-[1000px] w-[900px] border-collapse border border-slate-500 rounded">
                    <thead>
                        <tr className="bg-lightgray">
                            <th className="w-1/4 py-3 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                OrderId
                            </th>
                            <th className="w-1/4 py-3 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                Items
                            </th>
                            <th className="w-1/4 py-3 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                Total Amount
                            </th>
                            <th className="w-1/4 py-3 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                Date
                            </th>
                            <th className="w-1/4 py-3 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderData && orderData.map((data: order, index) => (
                            <tr key={data.order_id} className="p-4">
                                <td className="py-6 px-6 border border-slate-700 text-center">{index + 1}</td>
                                <td className="py-6 px-6 border border-slate-700 text-center">{data.item_name}</td>
                                <td className="py-6 px-6 border border-slate-700 text-center">{data.total_amount}</td>
                                <td className="py-4 px-6 border border-slate-700 text-center">{`${new Date(data.date).toLocaleDateString()}`}</td>
                                {data.delivery_status === "Success" ? <td className="py-4 px-6 border border-slate-700 text-center text-lime-700">{data.delivery_status}</td> : <td className="py-4 px-6 border border-slate-700 text-center  text-red-700 ">Pending</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Order;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import socket from "../../utils/socket";
import { removeuser, unvisible, emptycart, removerestid, removedriverid } from "../../redux-toolkit/Reducers/actions";
import { State_user, State } from "../../Types/reducer";
import instance from "../../base-axios/useAxios";
import Cookies from "js-cookie";
import { handleError } from "../../utils/util";
import { NotificationData } from "../../Types/notification";

interface HeaderProps {
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const data = useSelector((state: State_user) => state.user);
    const cart = useSelector((state: State) => state.cart);
    const driver_id = useSelector((state: State) => state.IDs.DriverID);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await instance.get(`/notification/fetchnotification/${driver_id}`);
                const newNotifications = res.data.data.driver_notification.filter(
                    (item: NotificationData) => !item.isRead && !item.isDeleted
                );
                setNotifications(newNotifications);
            } catch (error) {
                handleError(error, dispatch, navigate);
            }
        };

        fetchNotifications();
    }, [driver_id, dispatch, navigate]);

    useEffect(() => {
        socket.on('newNotification', (data) => {
            setNotifications((prev) => [...prev, data]);
        });

        return () => {
            socket.off('newNotification');
        };
    }, []);

    const handleLogout = async () => {
        if (cart.cart.length !== 0) {
            await instance.post(`cart/addtocart/${data.id}`, cart.cart);
        }
        dispatch(removeuser());
        dispatch(unvisible());
        dispatch(emptycart());
        dispatch(removerestid());
        dispatch(removedriverid());
        Cookies.remove("token");
        navigate("/");
    };

    return (
        <div className="w-full mx-auto rounded-lg text-primary relative top-0 left-0">
            <div className="bg-red-600 p-7">
                <p className="text-white text-xl font-bold flex items-center space-x-2 ml-40 -mt-6">
                    <Link to="/">
                        <img
                            id="miimg"
                            src={require("./logo.png")}
                            alt="none"
                            className="w-16 h-12 rounded-full"
                        />
                        Foodies
                    </Link>
                </p>
                <ul className="flex items-center justify-end space-x-8 mt-[-50px] font-bold text-lg text-white mr-32">
                    {data.role_id === 3 && (
                        <li className="relative">



                            import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Cookies from "js-cookie";
import { removeuser, unvisible, emptycart, removerestid, removedriverid } from "../../redux-toolkit/Reducers/actions";
import { State_user, State } from "../../Types/reducer";
import { NotificationData } from "../../Types/notification";
import { handleError } from "../../utils/util";
import socket from "../../utils/socket";

interface HeaderProps {
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: State_user) => state.user);
    const cart = useSelector((state: State) => state.cart);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    useEffect(() => {
        // Fetch initial notifications if needed
        // Your logic to fetch notifications can go here

        // Listen for new notifications
        socket.on('newNotification', (notification) => {
            setNotifications(prev => [...prev, notification]);
        });

        return () => {
            socket.off('newNotification');
        };
    }, []);

    const handleLogout = async () => {
        if (cart.cart.length !== 0) {
            await instance({
                url: `cart/addtocart/${user.id}`,
                method: "POST",
                data: cart.cart,
            });
        }
        dispatch(removeuser());
        dispatch(unvisible());
        dispatch(emptycart());
        dispatch(removerestid());
        dispatch(removedriverid());
        Cookies.remove("token");
        navigate("/");
    };

    return (
        <div className="w-full mx-auto rounded-lg text-primary relative top-0 left-0">
            <div className="bg-red-600 p-7">
                <p className="text-white text-xl font-bold flex items-center space-x-2 ml-40 -mt-6">
                    <Link to="/">
                        <img
                            id="miimg"
                            src={require("./logo.png")}
                            alt="Logo"
                            className="w-16 h-12 rounded-full"
                        />
                        Foodies
                    </Link>
                </p>
                <ul className="flex items-center justify-end space-x-8 mt-[-50px] font-bold text-lg text-white mr-32">
                    {user.role_id === 3 && (
                        <li className="relative">
                            <Link to="/notifications">
                                <NotificationsIcon className="text-white text-3xl" />
                                {notifications.length > 0 && (
                                    <p className="absolute top-[-8px] left-[10px] rounded-full bg-gray-950 px-2 text-sm">
                                        {notifications.length}
                                    </p>
                                )}
                            </Link>
                        </li>
                    )}
                    {user.id ? (
                        <li onClick={handleLogout}>
                            <Link to="">
                                <LogoutIcon className="text-white text-3xl" /> Logout
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login">
                                <LoginIcon className="text-white text-3xl" /> Login
                            </Link>
                        </li>
                    )}
                    {(!user.id || user.role_id === 4) && (
                        <li className="relative">
                            <Link to="/cart">
                                <ShoppingCartIcon className="text-white text-3xl" />
                                <p className="absolute top-[-10px] left-[20px]">{cart.totalItems || 0}</p>
                            </Link>
                        </li>
                    )}
                    {user.id && (
                        <li className="relative" onClick={onProfileClick}>

                            
