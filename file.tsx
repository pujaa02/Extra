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

    socket.on('message', (msg) => {
        io.emit('message', msg);
    });

    socket.on("joinRoom", (room) => {
        console.log("🚀 ~ socket.on ~ room:", room)
        socket.join(room);
    });

    socket.on("leaveRoom", (room) => {
        socket.leave(room);
    });

    socket.on('paymentMade', (data) => {
        console.log("🚀 ~ socket.on ~ data:", data);
        io.sockets.in('drivers').emit('newNotification', data);
        // io.to('drivers').emit('newNotification', data);
    });

    socket.on("disconnect", () => {
    })

});
server.listen(port, () => {
    console.log(`Server is running in port: ${port} `);
});


generateDocs(app);

import React from "react";
import { LoginData } from "../../Types/login";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import instance from "../../base-axios/useAxios";
import { useDispatch } from "react-redux";
import { format } from "date-fns/format";
import { Menu } from "../../Types/menu";
import { RestaurantAttributes } from "../../Types/restaurant";
import { adduser, new_cart, addrest } from "../../redux-toolkit/Reducers/actions";
import socket from "../../utils/socket";
const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>();

    const handlelogin = async (data: LoginData) => {
        await instance({
            url: "login/",
            method: "POST",
            data: data,
        }).then(async (res) => {
            if (res.data.msg === "Success") {
                const userdata = { ...res.data.user, bd: format(new Date(res.data.user.bd), 'yyyy-MM-dd') }
                if (userdata.role_id === 3) {
                    socket.emit("joinRoom", "drivers");
                }
                dispatch(adduser(userdata))
                if (userdata.role_id === 4) {
                    await instance({
                        url: `cart/getcarddata/${userdata.id}`,
                        method: "GET",
                    }).then((res) => {
                        if (res.data.message === "success") {
                            (res.data.result).forEach((element: Menu) => {
                                dispatch(new_cart(element))
                            });
                        }
                    });
                }
                if (userdata.role_id === 2) {
                    await instance({
                        url: `restaurant/getrestaurantdata/${userdata.id}`,
                        method: "GET",
                    })
                        .then((res) => {
                            const result: RestaurantAttributes = res.data.result[0];
                            dispatch(addrest(result))

                        })
                        .catch((e) => {
                            console.log(e);
                        });
                }
                toast.success("Successfully Login");
                navigate("/");
            } else {
                toast.error("Please Enter Valid Data");
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="container mx-auto p-6 max-w-md bg-white border-4 border-blue-600 rounded-lg">
                <form className="space-y-4" onSubmit={handleSubmit(handlelogin)}>
                    <h2 className="text-2xl font-bold text-center text-red-600">Login</h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 font-bold">
                            Email:
                        </label>
                        <input
                            type="text"
                            id="email"
                            {...register("email", {
                                required: "Email is Required!!",
                            })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.email && (
                            <p className="mt-1 text-red-600">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 font-bold">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password", {
                                required: "Password is Required!!",
                            })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.password && (
                            <p className="mt-1 text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-center mt-4 space-x-4">
                        <p
                            id="frgtpass"
                            onClick={() => navigate("/forgetpassword")}
                            className="w-40 p-2 text-center text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
                        >
                            Forget Password
                        </p>
                        <button
                            type="submit"
                            id="loginbtn"
                            className="w-20 p-2 text-center text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
                        >
                            Login
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <p>
                            Don&apos;t  have an account?{" "}
                            <Link to="/register" className="text-blue-500 underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

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
        socket.emit("leaveRoom", "drivers");
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
                socket.emit('paymentMade', res.data.data.finalresult);
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
            <div className="container  h-[700px] overflow-y-scroll ">
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
