import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChatAttributes, ChatData } from "../../../Types/chat";
import { io } from 'socket.io-client';
import "./chat.css";
import instance from "../../../Hooks/useAxios";
import { REACT_APP_BACKEND_URL } from "../../../config";
import { RestaurantAverage } from "../../../Types/restaurant";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../utils/util";
import { addrestid } from "../../Store/Reducers/actions";
import { State } from "../../../Types/reducer";

const socket = io(`${REACT_APP_BACKEND_URL}`);

const AdminChat: React.FC = () => {
    const receiverID = useSelector((state: State) => state.restID.receiverID);
    const [restaurant, setRestaurant] = useState<RestaurantAverage[]>([]);
    const [chat, setChat] = useState<ChatAttributes[]>([])
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm<ChatData>();

    // Fetch all chat data for the selected receiver ID
    const fetchallchat = async (id: number) => {
        await instance({
            url: "/chat/getchatdata",
            method: "GET",
        })
        .then((res) => {
            const result = res.data.result.filter((obj: ChatAttributes) => obj.sender_id === id || obj.receiver_id === id);
            setChat(result);
        })
        .catch((error) => {
            handleError(error, dispatch, navigate);
        });
    }

    // Fetch top restaurants
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

    // Initial fetch of restaurants
    useEffect(() => {
        fetchall();
    }, []);

    // Fetch chat data when receiverID changes
    useEffect(() => {
        if (receiverID) {
            fetchallchat(receiverID);
        }
    }, [receiverID]);

    // Listen for incoming messages
    useEffect(() => {
        socket.on('message', (msg: ChatAttributes) => {
            setChat((prevChat) => [...prevChat, msg]);
        });
        return () => {
            socket.off('message');
        };
    }, []);

    // Handle restaurant selection change
    const changeID = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const item = restaurant.find(obj => obj.restaurant_id === Number(event.target.value));
        if (item) {
            dispatch(addrestid(item.user_id));
        }
    }

    // Handle form submission to send a new message
    const handleinput: SubmitHandler<ChatData> = async (data: ChatData) => {
        if (data.message.trim()) {
            const newMessage: ChatAttributes = {
                sender_id: 1, // Assuming 1 is the ID of the admin
                receiver_id: receiverID,
                message: data.message,
                timestamp: new Date().toISOString(),
            };

            socket.emit('message', newMessage);

            await instance({
                url: `chat/addchatdata/1/${receiverID}`,
                method: 'POST',
                data: newMessage,
            })
            .then(() => {
                setChat((prevChat) => [...prevChat, newMessage]);
                reset();
            })
            .catch((error) => {
                handleError(error, dispatch, navigate);
            });
        }
    }

    return (
        <div>
            <div className="absolute ml-3 top-44">
                <label htmlFor="restaurant_id" className="text-xl font-bold text-slate-600">Select Restaurant to open the Chat</label>
                <div className="form-group flex">
                    <select id="restaurant_id" className="form-control" {...register("restaurant_id", {
                        required: true,
                        onChange: (e) => { changeID(e) }
                    })}>
                        <option value="">Select Restaurant</option>
                        {restaurant.map((data: RestaurantAverage) => (
                            <option key={data.restaurant_id} value={data.restaurant_id}>{data.restaurant_name}</option>
                        ))}
                    </select>
                </div>
            </div>
            {receiverID && (
                <div className="chat_container">
                    <div className="upper_container">
                        <ul>
                            {chat.map((msg, index) => (
                                <li key={index}>
                                    {msg.sender_id === 1 ? 'You' : 'User'}: {msg.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bottom_container">
                        <form onSubmit={handleSubmit(handleinput)} className="space-y-6">
                            <div className="form-group flex">
                                <input
                                    type="text"
                                    placeholder="message..."
                                    id="message"
                                    {...register("message", {})}
                                    className="ml-2 mt-2 py-2 px-2"
                                />
                                <button className="sendbtn" type="submit">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminChat;
