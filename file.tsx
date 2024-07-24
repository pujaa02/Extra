import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChatData } from "../../../Types/chat";
import { io } from 'socket.io-client';
import "./chat.css"
import instance from "../../../Hooks/useAxios";
import { REACT_APP_BACKEND_URL } from "../../../config";
import { RestaurantAverage } from "../../../Types/restaurant";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/util";
import toast from "react-hot-toast";


const socket = io(`${REACT_APP_BACKEND_URL}`);

const AdminChat: React.FC = () => {
    const [restaurant, setRestaurant] = useState<RestaurantAverage[]>([]);
    const [receiverID, setReceiverID] = useState<number>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm<ChatData>();

    const fetchall = async () => {
        await instance({
            url: "/home/toprestaurant",
            method: "GET",
        })
            .then((res) => {
                setRestaurant(res.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        fetchall();
    }, []);

    useEffect(() => {
        socket.on('message', (msg: string) => {
            console.log(msg, "message");
        })
        return () => {
            socket.off('message')
        }
    }, [])

    const handlerestID: SubmitHandler<ChatData> = async (data: ChatData) => {
        console.log(data.restaurant_id);
        console.log(restaurant, "restaurant");
        const itemInCart = restaurant.filter(item => item.restaurant_id === data.restaurant_id);
        console.log(itemInCart);

    }
    const handleinput: SubmitHandler<ChatData> = async (data: ChatData) => {
        console.log(data, "data");
        console.log(receiverID, "receiverid");
        if (data.message.trim()) {
            socket.emit('message', data.message);
            await instance({
                url: `chat/addchatdata/1/${receiverID}`,
                method: 'POST',
                data: data,
            }).then((res) => {
                if (res.data.message === "success") {
                    toast.success("Successfully Added");
                } else {
                    toast.error("Please Enter Valid Data");
                }
            }).catch((error) => {
                handleError(error, dispatch, navigate);
            })
        }
    }
    return (
        <div>
            <div className="absolute ml-3 top-44">
                <form onSubmit={handleSubmit(handlerestID)} className="space-y-6">
                    <label htmlFor="restaurant_id" className="text-xl font-bold text-slate-600">Select Restaurant to open the Chat</label>
                    <div className=" form-group flex">
                        <select id="restaurant_id" className="form-control"  {...register("restaurant_id", {
                            required: "select Restaurant first",
                        })}
                        >
                            <option value="">Select Restaurant</option>
                            {restaurant.map((data: RestaurantAverage) => (
                                <option key={data.restaurant_id} value={data.restaurant_id}>{data.restaurant_name}</option>
                            ))}
                        </select>
                        {errors.restaurant_id && <p className="text-red-600">{errors.restaurant_id.message}</p>}
                        <button type="submit" className=" ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                    </div>

                </form>
            </div>
            {receiverID && <div className="chat_container">
                <div className="upper_container">
                </div>
                <div className="bottom_container">
                    <form onSubmit={handleSubmit(handleinput)} className="space-y-6">
                        <div className="form-group flex">
                            <input
                                type="text"
                                placeholder="message..."
                                id="name"
                                {...register("message", {
                                })}
                                className="ml-2 mt-2 py-2 px-2"
                            />
                            <button className="sendbtn" type="submit">Send</button>
                        </div>
                    </form>
                </div>
            </div>}

        </div>
    );
}

export default AdminChat;
