/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State, State_user, } from "../../../Types/reducer";
import { Menu } from "../../../Types/menu";
import { useNavigate } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import Header from "../../../components/Header/Header";
import { visible } from "../../../redux-toolkit/Reducers/actions";
import toast from "react-hot-toast";
import { handleError } from "../../../utils/util";
import instance from "../../../base-axios/useAxios";
import "./payment.css"

const Payment: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [defaultComponent, setDefaultComponent] = useState("profile");
    const user = useSelector((state: State_user) => state.user);
    const cart = useSelector((state: State) => state.cart);
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    const changeaddress = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    }

    const changenumber = (event: ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    }

    const payment = async () => {
        if (address && phone) {

            await instance({
                url: `order/addorder/${user.id}`,
                method: "POST",
                data: { cart, address, phone }
            }).then((res) => {
                if (res.data.message === "Successfully Order placed") {
                    navigate("/dashboard/order")
                }
            }).catch((error) => {
                handleError(error, dispatch, navigate);
            })
        } else {
            toast.error("Please fill the data First!!")
        }
    }
    const handleProfileClick = () => {
        dispatch(visible())
        setDefaultComponent("profile");
        navigate("/dashboard/profile");
    };
    if (cart.cart.length === 0) {
        return (
            <div className="order-container">
                <div className="p-5 ">
                    <p className="text-center text-4xl font-bold ... italic text-slate-600">No Order Here at Now</p>
                </div>
                <div className="mt-10 ml-16 p-5">
                    <p className="text-xl"><SendIcon className="mr-2" />Please Select Item first!!</p>
                    <p className=" mt-5 ml-16 bg-slate-500 p-3 w-36 text-center text-xl text-slate-100 font-bold" onClick={() => navigate("/")}>Add Item</p>
                </div>
            </div>
        )
    }
    return (
        <div>
            <Header onProfileClick={handleProfileClick} />
            <div className="order-container">
                <div className="p-5">
                    <p className="text-center text-4xl font-bold ... italic text-slate-600">Order Now</p>
                </div>
                <div className="wishlist_container">
                    <div className="h-[calc(50vh-2rem)] overflow-y-scroll">
                        {cart.cart.map((data: Menu, index: number) => (
                            <div className="cart_wishlist" key={index}>
                                <div className="flex justify-center items-center gap-x-9 mt-4">
                                    <img className="h-32 w-40 rounded-xl" src={`http://192.168.10.119:8000/` + data.image} alt="none" />
                                    <div className="">
                                        <p className="text-slate-600 font-bold text-xl">{data.item_name}</p>
                                        <div className="">
                                            <p className=""><b>Price : </b>${data.price}</p>
                                            <p className=""><b>Total Items : </b>{data.count}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="mt-5  ml-28 w-4/5 h-1.5 bg-black" />
                    <div className="mt-3 float-right mr-28">
                        <p className="text-xl"><b>Price : </b> ${cart.total}</p>
                        <p className="text-xl"><b>Delivery : </b> ${(cart.totalItems) * 15}</p>
                        <p className="text-xl"><b>Total : </b> ${(cart.total) + ((cart.totalItems) * 15)}</p>
                    </div>
                    <div className="mt-28 ml-32">
                        <label htmlFor="large-input" className="block mt-2 text-sm font-medium text-red-500">Add Address</label>
                        <input type="text" id="large-input" className="mt-2 block w-4/4 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-5000 dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={changeaddress} />
                        <label htmlFor="large-input" className="block mt-2 text-sm font-medium text-red-500">Mobile Number</label>
                        <input type="text" id="large-input" className="mt-2 block w-4/4 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-5000 dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={changenumber} />
                    </div>
                    <div className="back_home">
                        <p onClick={() => navigate("/cart")}>Back to Cart</p>
                    </div>
                    <div className="payment_btn">
                        <p onClick={() => payment()}>Go to Payment</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import { addorderid, visible } from "../../../redux-toolkit/Reducers/actions";
import instance from "../../../base-axios/useAxios";
import { handleError } from "../../../utils/util";
import { State } from "../../../Types/reducer";
import { NotificationData } from "../../../Types/notification";
import Show from "../model/Show";

const Notification: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const driver_id = useSelector((state: State) => state.IDs.DriverID);
    const [oldnotification, setOldNotification] = useState<NotificationData[]>([]);
    const [newnotification, setNewNotification] = useState<NotificationData[]>([]);
    const [showmodal, setShowmodal] = useState<boolean>(false);

    const fetchnotification = async () => {
        await instance({
            url: `/notification/fetchnotification/${driver_id}`,
            method: "GET",
        }).then((res) => {
            const oldnotify = (res.data.data.driver_notification).filter((item: NotificationData) => {
                return item.isRead === true && item.isDeleted === true
            })
            const newnotify = (res.data.data.driver_notification).filter((item: NotificationData) => {
                return item.isRead === false && item.isDeleted === false
            })
            setOldNotification(oldnotify);
            setNewNotification(newnotify)
        }).catch((error) => {
            handleError(error, dispatch, navigate);
        });
    }

    useEffect(() => {
        fetchnotification();
    }, [])

    const [defaultComponent, setDefaultComponent] = useState("profile");
    const handleProfileClick = () => {
        dispatch(visible())
        setDefaultComponent("profile");
        navigate("/dashboard/profile");
    };

    const setOrderID = (id: number) => {
        dispatch(addorderid(id));
        setShowmodal(true);
    }

    const acceptorder = async (order_id: number) => {
        await instance({
            url: `/notification/acceptorder/${driver_id}/${order_id}`,
            method: "GET",
        }).then((res) => {
            if (res.data.data.message === "Successfully accepted") {
                navigate('/driver')
            }
        }).catch((error) => {
            handleError(error, dispatch, navigate);
        });
    }

    if (oldnotification.length === 0 && newnotification.length === 0) {
        return (
            <div className="">
                <Header onProfileClick={handleProfileClick} />
                <div className="min-h-screen">
                    <div className="flex flex-row pt-24 px-10 pb-4 justify-center">
                        <div className="w-9/12">
                            <div className="flex flex-row h-[calc(80vh-2rem)]">
                                <div className="bg-no-repeat bg-slate-100 border border-slate-100 rounded-xl w-full mr-2 p-6" >
                                    <p className="text-center text-4xl font-bold ... italic text-slate-600 ">Notifications</p>
                                    <div className="mt-24 flex justify-center">
                                        <img className="w-1/4 h-1/4 rounded-full" src={require(`./notify.jpg`)} alt="no image found" />
                                    </div>
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
                                <p className="text-center text-4xl font-bold ... italic text-slate-600 ">Notifications</p>
                                <div className="flex justify-center">
                                    <table className="table-auto mt-10 max-w-[1000px] w-[1000px] border-collapse border border-slate-500 rounded">
                                        <thead>
                                            <tr className="bg-lightgray">
                                                <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    Index
                                                </th>
                                                <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    OrderID
                                                </th>
                                                <th className="w-2/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    Address
                                                </th>
                                                <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    Phone
                                                </th>
                                                <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    More Detail About Order
                                                </th>
                                                <th className="w-1/4 py-4 px-6 text-center text-gray-600 font-bold border border-slate-600">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {oldnotification && oldnotification.map((data: NotificationData, index) => (
                                                <tr key={index} className="p-4">
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{index + 1}</td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{data.order_id}</td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{data.order.address}</td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{data.order.phone}</td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center"><button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => setOrderID(data.order_id)}>Show</button></td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center"><p className=" text-white bg-green-700  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Accepted</p></td>

                                                </tr>
                                            ))}
                                            {newnotification && newnotification.map((data: NotificationData, index) => (
                                                <tr key={index} className="p-4">
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{index + 1}</td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{data.order_id}</td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{data.order.address}</td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center">{data.order.phone}</td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center"><button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => setOrderID(data.order_id)}>Show</button></td>
                                                    <td className="py-4 px-6 border border-slate-700 text-center"><button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={() => acceptorder(data.order_id)}>Accept</button></td>

                                                </tr>
                                            ))}
                                            {showmodal && <Show show={showmodal} onHide={() => setShowmodal(false)} />}
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

export default Notification;


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
interface HeaderProps {
    onProfileClick: () => void;
}
const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const data = useSelector((state: State_user) => state.user);
    const cart = useSelector((state: State) => state.cart);
    const id = useSelector((state: State) => state.IDs.DriverID);
    const [notification, setNotification] = useState<NotificationData[]>([])

    const count_notification: NotificationData[] = notification.filter((item) => item.isRead === false && item.isDeleted === false);

    const fetchnotification = async () => {
        await instance({
            url: `/notification/fetchnotification/${id}`,
            method: "GET",
        })
            .then((res) => {
                setNotification(res.data.data.driver_notification)
            })
            .catch((error) => {
                handleError(error, dispatch, navigate);
            });
    }
    
    useEffect(() => {
        fetchnotification();
    }, [])

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
                            <p className="absolute top-[-8px] left-[10px] rounded-full  bg-gray-950 px-2 text-sm">{count_notification.length}</p>
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
