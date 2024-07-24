import { Action, State_restID } from "../../../Types/reducer";


export interface State_restID {
    receiverID: number;
}

const initialState: State_restID = {
    receiverID: 0
};

export default function restIDReducer(state = initialState, action: Action) {
    switch (action.type) {
        case 'ADD_RESTAURANT_ID':
            console.log(initialState, action.payload.id, "payload");
            return { receiverID: action.payload.id }
        case 'REMOVE_RESTAURANT_ID':
            return { receiverID: 0 }
        default:
            return state;
    }
}


import { Menu } from "../../../Types/menu";
import { RegData } from "../../../Types/register";
import { RestaurantAttributes } from "../../../Types/restaurant";

export const adduser = (user: RegData) => ({
    type: 'ADD_USER',
    payload: { user }
})

export const removeuser = () => ({
    type: 'REMOVE_USER',
    payload: {}
})

export const addrest = (restaurant: RestaurantAttributes) => ({
    type: 'ADD_RESTAURANT',
    payload: { restaurant }
})

export const removeres = () => ({
    type: 'REMOVE_RESTAURANT',
    payload: {}
})

export const addrestid = (id: number) => ({
    type: 'ADD_RESTAURANT_ID',
    payload: { id }
})

export const removerestid = () => ({
    type: 'REMOVE_RESTAURANT_ID'
})

export const add_menu = (item: Menu) => ({
    type: 'ADD_MENU',
    payload: item
})

export const remove_menu = () => ({
    type: 'REMOVE_MENU',
})

export const addmenuid = (id: number) => ({
    type: 'ADD_MENU_ID',
    payload: id
})


export const add_to_cart = (item: Menu) => ({
    type: 'ADD_TO_CART',
    payload: item
})

export const new_cart = (item: Menu) => ({
    type: 'NEW_CART',
    payload: item
})

export const increment = (id: number) => ({
    type: 'INCREMENT_QUANTITY',
    payload: id
})

export const decrement = (id: number) => ({
    type: 'DECREMENT_QUANTITY',
    payload: id
})


export const remove_from_cart = (id: number) => ({
    type: 'REMOVE_FROM_CART',
    payload: id
})


export const emptycart = () => ({
    type: 'EMPTY_CART',
})


export const visible = () => ({
    type: 'VISIBLE',
    payload: {}
})

export const unvisible = () => ({
    type: 'UNVISIBLE',
    payload: {}
})


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
    const receiverID: number = useSelector((state: State) => state.restID.receiverID);
    const [restaurant, setRestaurant] = useState<RestaurantAverage[]>([]);
    // const [receiverID, setReceiverID] = useState<number>();
    const [chat, setChat] = useState<ChatAttributes[]>([])
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, } = useForm<ChatData>();

    const fetchallchat = async () => {
        await instance({
            url: "/chat/getchatdata",
            method: "GET",
        })
            .then((res) => {
                console.log(res.data.result, "result_res");

                // const result: ChatAttributes[] = (res.data.result).filter((obj: ChatAttributes) => {
                //     return (obj.sender_id == receiverID || obj.receiver_id == receiverID)
                // })
                // setChat(result)
            })
            .catch((error) => {
                handleError(error, dispatch, navigate);
            });
    }
    // console.log(receiverID, "id");

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
        });
        return () => {
            socket.off('message');
        };
    }, []);

    const chnageID = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.value, "event value");
        const item: RestaurantAverage[] = restaurant.filter((obj) => {
            return obj.restaurant_id == Number(event.target.value)
        })
        console.log(item[0].user_id, "item");
        dispatch(addrestid(item[0].user_id));
        console.log(receiverID, "receivedid");
        fetchallchat();
    }

    const handleinput: SubmitHandler<ChatData> = async (data: ChatData) => {
        if (data.message.trim()) {
            socket.emit('message', data.message);
            await instance({
                url: `chat/addchatdata/1/${receiverID}`,
                method: 'POST',
                data: data,
            }).catch((error) => {
                handleError(error, dispatch, navigate);
            });
        }
    }
    return (
        <div>
            <div className="absolute ml-3 top-44">
                <label htmlFor="restaurant_id" className="text-xl font-bold text-slate-600">Select Restaurant to open the Chat</label>
                <div className=" form-group flex">
                    <select id="restaurant_id" className="form-control"  {...register("restaurant_id", {
                        required: true,
                        onChange: (e) => { chnageID(e) }
                    })}
                    >
                        <option value="">Select Restaurant</option>
                        {restaurant.map((data: RestaurantAverage) => (
                            <option key={data.restaurant_id} value={data.restaurant_id}>{data.restaurant_name}</option>
                        ))}
                    </select>
                </div>
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
