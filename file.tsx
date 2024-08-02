import express, { Application } from "express";
const app: Application = express();
import cors from 'cors';
import { generateDocs } from './utils/GenerateDocs';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import http from 'http';
import { Server } from "socket.io";
import { PORT, BASE_URL } from "./config";
import { router } from "./common/routes";


const port = PORT || 8000;
export const prisma = new PrismaClient()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: BASE_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
const corsOptions = {
    origin: BASE_URL,
    methods: 'GET, PUT, POST, DELETE',
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization,token_data',
};
app.use(cors(corsOptions))
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))
app.use(cookieParser());
app.use(express.json());
app.use(router);

io.on("connection", (socket) => {
    // console.log(`User connected ${socket.id}`);

    socket.on('message', (msg) => {
        io.emit('message', msg);
    });

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("leaveRoom", (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
    });

    socket.on('paymentMade', (data) => {
        console.log('Payment made:', data);
        io.to('drivers').emit('newNotification', { message: 'New payment received!', details: data });
    });

    socket.on("disconnect", () => {
        // console.log('user disconnected');
    })

});
server.listen(port, () => {
    console.log(`Server is running in port: ${port} `);
});


generateDocs(app);


/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "../../../components/Header/Header";
import { adddriverid, visible } from "../../../redux-toolkit/Reducers/actions";
import instance from "../../../base-axios/useAxios";
import { handleError } from "../../../utils/util";
import { State, State_user } from "../../../Types/reducer";
import { DashboardData } from "../../../Types/driver";
import socket from "../../../utils/socket";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: State_user) => state.user);
    const driver_id = useSelector((state: State) => state.IDs.DriverID);
    const [dashboarddata, setDashboardData] = useState<DashboardData[]>([]);

    useEffect(() => {
        if (user.role_id === 3) {
            socket.emit("joinRoom", "drivers");
        }
        return () => {
            socket.emit("leaveRoom", "drivers");
        };
    }, [user.role_id]);

    useEffect(() => {
        fetchdashboardData();
        setdriver();
    })

    const setdriver = async () => {
        await instance({
            url: `/driver/fetchdriver/${user.id}`,
            method: "GET",
        }).then((res) => {
            dispatch(adddriverid(res.data.data.result.id))
        }).catch((error) => {
            handleError(error, dispatch, navigate);
        });
    }

    const fetchdashboardData = async () => {
        await instance({
            url: `/driver/fetchdashboarddata/${driver_id}`,
            method: "GET",
        }).then((res) => {
            setDashboardData(res.data.data.result)
        }).catch((error) => {
            handleError(error, dispatch, navigate);
        });
    }

    const deliveredorder = async (order_id: number) => {
        await instance({
            url: `/order/updateorderstatus/${order_id}`,
            method: "GET",
        }).then((res) => {
            if (res.data.message === "Successfully updated status") {
                fetchdashboardData()
            }
        }).catch((error) => {
            handleError(error, dispatch, navigate);
        });
    }


    const [defaultComponent, setDefaultComponent] = useState("profile");
    const handleProfileClick = () => {
        dispatch(visible())
        setDefaultComponent("profile");
        navigate("/dashboard/profile");
    };

    if (dashboarddata.length === 0) {
        return (
            <div className="">
                <Header onProfileClick={handleProfileClick} />
                <div className="min-h-screen">
                    <div className="flex flex-row pt-24 px-10 pb-4 justify-center">
                        <div className="w-9/12">
                            <div className="flex flex-row h-[calc(80vh-2rem)]">
                                <div className="bg-no-repeat bg-slate-100 border border-slate-100 rounded-xl w-full mr-2 p-6" >
                                    <p className="text-center text-4xl font-bold ... italic text-slate-600 ">Welcome to Dashboard</p>
                                    <div className="mt-24 flex justify-center">
                                        <img className="w-1/4 h-1/4 rounded-full" src={require(`./dashboard.png`)} alt="no image found" />
                                    </div>
                                    <p className="text-center text-xl text-red-600">No any Data Found</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
    return (
        <div className="">
            <Header onProfileClick={handleProfileClick} />
            <div className="min-h-screen">
                <div className="flex flex-row pt-24 px-10 pb-4 justify-center">
                    <div className="w-9/12">
                        <div className="flex flex-row h-[calc(80vh-2rem)]">
                            <div className="bg-no-repeat bg-slate-100 border border-slate-100 rounded-xl w-full mr-2 p-6" >
                                <p className="text-center text-4xl font-bold ... italic text-slate-600 ">Welcome to Dashboard</p>

                                <div className="flex justify-center overflow-y-scroll h-[600px]">
                                    <table className=" mt-10 max-w-[1000px] w-[900px]  border-collapse border border-slate-500 rounded">
                                        <thead>
                                            <tr className="bg-lightgray">
                                                <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    Index
                                                </th>
                                                <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    OrderID
                                                </th>
                                                <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    Status
                                                </th>
                                                <th className="w-2/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    Action(Delivered?)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboarddata.map((data: DashboardData, index) => (
                                                <tr key={index} className="p-4">
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{index + 1}</td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{data.order_id}</td>
                                                    {data.delivery_status === "Pending" ? <td className="py-4 px-6 border border-slate-700 text-center text-red-500">Pending</td> : <td className="py-4 px-6 border border-slate-700 text-center  text-lime-700">Delivered</td>}
                                                    {data.delivery_status === "Pending" && <td className=" border border-slate-700 text-center "><button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={() => deliveredorder(data.order_id)}>Order Delivered</button></td>}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Home;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State_user } from "../../../Types/reducer";
import { useNavigate } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import instance from "../../../base-axios/useAxios";
import { handleError } from "../../../utils/util";
import { order } from "../../../Types/order";
import socket from "../../../utils/socket";

const Order: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: State_user) => state.user);
    const [orderData, setOrderData] = useState<order[]>([])
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
    }, [])


    if (orderData.length === 0) {
        return (
            <div className="position">
                <div className="p-5 ">
                    <p className="text-center text-4xl font-bold ... italic text-slate-600">No Order Here at Now</p>
                </div>
                <div className="mt-10 ml-16 p-5">
                    <p className="text-xl"><SendIcon className="mr-2" />Please Order Some Item first!!</p>
                    <p className=" mt-5 ml-16 bg-slate-500 p-3 w-56 text-center text-xl text-slate-100 font-bold" onClick={() => navigate("/")}>Go for Order</p>
                </div>
            </div>
        )
    }
    return (
        <div className="position">
            <div className="p-5">
                <p className="text-center text-4xl font-bold ... italic text-slate-600">Your All Orders</p>
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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import instance from "../../base-axios/useAxios";
import Cookies from "js-cookie";
import NotificationsIcon from '@mui/icons-material/Notifications';
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
    const navigate = useNavigate()
    const data = useSelector((state: State_user) => state.user);
    const cart = useSelector((state: State) => state.cart);
    const driver_id = useSelector((state: State) => state.IDs.DriverID);
    const [notification, setNotification] = useState<NotificationData[]>([])

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await instance.get(`/notification/fetchnotification/${driver_id}`);
                const newNotifications = res.data.data.driver_notification.filter(
                    (item: NotificationData) => !item.isRead && !item.isDeleted
                );
                setNotification(newNotifications);
            } catch (error) {
                handleError(error, dispatch, navigate);
            }
        };

        fetchNotifications();
    }, [driver_id, dispatch, navigate]);


    useEffect(() => {
        socket.on('newNotification', (data) => {
            setNotification((prev) => [...prev, data]);
        });

        return () => {
            socket.off('newNotification');
        };
    }, []);



    const handleLogout = async () => {
        if ((cart.cart).length !== 0) {
            await instance({
                url: `cart/addtocart/${data.id}`,
                method: "POST",
                data: cart.cart,
            });
        }
        dispatch(removeuser());
        dispatch(unvisible());
        dispatch(emptycart());
        dispatch(removerestid());
        dispatch(removedriverid())
        Cookies.remove("token")
        navigate("/")
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
                    {(data.role_id === 3) && <li className="relative" >
                        <Link to="/notifications">
                            <NotificationsIcon className="text-white text-3xl" />
                            <p className="absolute top-[-8px] left-[10px] rounded-full  bg-gray-950 px-2 text-sm">{notification.length}</p>
                        </Link>
                    </li>}
                    {data.id ? (
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
                    {((!data.id) || data.role_id === 4) && <li className="relative" >
                        <Link to="/cart">
                            <ShoppingCartIcon className="text-white text-3xl" />
                            <p className="absolute top-[-10px] left-[20px]">{cart.totalItems || 0}</p>
                        </Link>
                    </li>}

                    {data.id && (
                        <li className="relative" onClick={onProfileClick}>
                            <Link to="">
                                <AccountCircleIcon className="text-white text-3xl" />
                                <p className="absolute top-0 left-6">{data.fname}</p>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Header;
