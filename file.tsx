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

    socket.on('paymentMade', (data) => {
        console.log('Payment made:', data);
        io.emit('newNotification', { message: 'New payment received!', details: data });
      });
    
    socket.on("disconnect", () => {
        // console.log('user disconnected');
    })

});
server.listen(port, () => {
    console.log(`Server is running in port: ${port} `);
});


generateDocs(app);


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

    useEffect(() => {
        socket.on("notification", (notification) => {
            toast.success(notification.message);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

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
    const fetchnotification = async () => {
        await instance({
            url: `/notification/fetchnotification/${driver_id}`,
            method: "GET",
        }).then((res) => {
            const newnotify = (res.data.data.driver_notification).filter((item: NotificationData) => {
                return item.isRead === false && item.isDeleted === false
            })
            setNotification(newnotify)
        }).catch((error) => {
            handleError(error, dispatch, navigate);
        });
    }
    useEffect(() => {
        fetchnotification();

        // socket.on("notification", (notification) => {
        //     setNotification((prevNotifications) => [notification, ...prevNotifications]);
        // });

        // return () => {
        //     socket.disconnect();
        // };
        // driver_id, navigate, dispatch
    }, [])

    useEffect(() => {
        socket.on('newNotification', (data) => {
            console.log("🚀 ~ socket.on ~ data:", data)
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
