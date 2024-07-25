import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChatAttributes, ChatData } from '../../../Types/chat.types';
import { io } from 'socket.io-client';
import instance from '../../../base-axios/useAxios';
import { REACT_APP_BACKEND_URL } from '../../../config';
import { handleError } from '../../../utils/util';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { State_user } from '../../../Types/reducer.types';
import { RegData } from '../../../Types/register.types';

const socket = io(`${REACT_APP_BACKEND_URL}`);

const Chat: React.FC = () => {
  const user: RegData = useSelector((state: State_user) => state.user);
  const [chat, setChat] = useState<ChatAttributes[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<ChatData>();

  const fetchallchat = async () => {
    await instance({
      url: '/chat/getchatdata',
      method: 'GET',
    })
      .then((res) => {
        const result: ChatAttributes[] = res.data.result.filter(
          (obj: ChatAttributes) => obj.receiver_id === user.id || obj.sender_id === user.id
        );
        setChat(result);
      })
      .catch((error) => {
        handleError(error, dispatch, navigate);
      });
  };

  useEffect(() => {
    fetchallchat();
  }, []);

  useEffect(() => {
    socket.on('message', (msg: ChatAttributes) => {
      setChat((prevChat) => [...prevChat, msg]);
    });
    return () => {
      socket.off('message');
    };
  }, []);

  const handleinput: SubmitHandler<ChatData> = async (data: ChatData) => {
    if (data.message.trim()) {
      const newMessage: ChatAttributes = {
        sender_id: user.id,
        receiver_id: 1,
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
    <div className="absolute top-48 right-96 bg-gray-300 p-4 rounded-lg">
      <div className="overflow-y-scroll h-96 bg-white rounded-lg p-3">
        {chat.map((obj: ChatAttributes) => (
          <div key={obj.id}>
            <p className={`${obj.sender_id === user.id ? 'bg-green-600 ml-auto' : 'bg-gray-500'} text-white p-2 rounded-md mb-2 w-max`}>
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
        <button type="submit" className="bg-indigo-500 text-white px-4 rounded-r-md">Send</button>
      </form>
    </div>
  );
};

export default Chat;