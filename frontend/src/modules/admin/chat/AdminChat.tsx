import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChatAttributes, ChatData } from '../../../Types/chat.types';
import { io } from 'socket.io-client';
import instance from '../../../base-axios/useAxios';
import { REACT_APP_BACKEND_URL } from '../../../config';
import { RestaurantAverage } from '../../../Types/restaurant.types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../../../utils/util';
import { State } from '../../../Types/reducer.types';
import { addrestid } from '../../../redux-toolkit/Reducers/actions';

const socket = io(`${REACT_APP_BACKEND_URL}`);

const AdminChat: React.FC = () => {
  const receiverID = useSelector((state: State) => state.restID.receiverID);
  const [restaurant, setRestaurant] = useState<RestaurantAverage[]>([]);
  const [chat, setChat] = useState<ChatAttributes[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<ChatData>();

  const fetchallchat = async (id: number) => {
    await instance({
      url: '/chat/getchatdata',
      method: 'GET',
    })
      .then((res) => {
        const result = res.data.result.filter(
          (obj: ChatAttributes) => obj.sender_id === id || obj.receiver_id === id
        );
        setChat(result);
      })
      .catch((error) => {
        handleError(error, dispatch, navigate);
      });
  };

  const fetchall = async () => {
    await instance({
      url: '/home/toprestaurant',
      method: 'GET',
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
    if (receiverID) {
      fetchallchat(receiverID);
    }
  }, [receiverID]);

  useEffect(() => {
    socket.on('message', (msg: ChatAttributes) => {
      setChat((prevChat) => [...prevChat, msg]);
    });
    return () => {
      socket.off('message');
    };
  }, []);

  const changeID = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const item = restaurant.find(
      (obj) => obj.restaurant_id === Number(event.target.value)
    );
    if (item) {
      dispatch(addrestid(item.user_id));
    }
  };

  const handleinput: SubmitHandler<ChatData> = async (data: ChatData) => {
    if (data.message.trim()) {
      const newMessage: ChatAttributes = {
        sender_id: 1,
        receiver_id: receiverID,
        message: data.message,
        timestamp: new Date().toISOString(),
      };
      socket.emit('message', newMessage);
      await instance({
        url: `chat/addchatdata`,
        method: 'POST',
        data: newMessage,
      })
        .then(() => {
          reset();
        })
        .catch((error) => {
          handleError(error, dispatch, navigate);
        });
    }
  };

  return (
    <div>
      <div className="absolute ml-3 top-44">
        <label htmlFor="restaurant_id" className="text-xl font-bold text-slate-600">
          Select Restaurant to open the Chat
        </label>
        <div className="flex">
          <select
            id="restaurant_id"
            {...register('restaurant_id', {
              required: true,
              onChange: (e) => changeID(e),
            })}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Restaurant</option>
            {restaurant.map((data: RestaurantAverage) => (
              <option key={data.restaurant_id} value={data.restaurant_id}>
                {data.restaurant_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {receiverID && (
        <div className="absolute top-48 right-96 bg-gray-300 p-4 rounded-lg">
          <div className="overflow-y-scroll h-96 bg-white rounded-lg p-3">
            {chat.map((obj: ChatAttributes) => (
              <div key={obj.id}>
                <p
                  className={`${
                    obj.sender_id === 1 ? 'bg-green-600 ml-auto' : 'bg-gray-500'
                  } text-white p-2 rounded-md mb-2 w-max`}
                >
                  {obj.message}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit(handleinput)} className="flex mt-4">
            <input
              type="text"
              placeholder="message..."
              {...register('message')}
              className="flex-grow p-2 border border-gray-300 rounded-l-md"
            />
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 rounded-r-md"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminChat;
