/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import instance from '../../../base-axios/useAxios';
import { State_restaurant } from '../../../Types/reducer.types';
import { MenuAttributes } from '../../../Types/menu.types';
import toast from 'react-hot-toast';
import UpdateMenu from '../updatemenu/UpdateMenu';
import { REACT_APP_IMAGEURL } from '../../../config';
import { handleError } from '../../../utils/util';
import Header from '../../../components/Header/Header';
import { visible, addmenuid } from '../../../redux-toolkit/Reducers/actions';

const Rest_Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state: State_restaurant) => state.restaurant);
  const [menuitem, setMenuItem] = useState<MenuAttributes[]>([]);
  const [defaultComponent, setDefaultComponent] = useState('profile');
  const [updatemenumodal, setupdatemenumodal] = React.useState<boolean>(false);

  const fetchallmenu = async () => {
    try {
      const res = await instance({
        url: `menu/fetchmenubyrestaurant/${data.id}`,
        method: 'GET',
      });
      setMenuItem(res.data.result);
    } catch (error) {
      handleError(error, dispatch, navigate);
    }
  };

  useEffect(() => {
    fetchallmenu();
  }, []);

  const handleProfileClick = () => {
    dispatch(visible());
    setDefaultComponent('profile');
    navigate('/dashboard/profile');
  };

  const removeitem = async (id: number) => {
    try {
      const res = await instance({
        url: `menu/removemenu/${id}`,
        method: 'GET',
      });
      if (res.data.message === 'success') {
        toast.success('Item Removed Successfully');
        fetchallmenu();
      }
    } catch (error) {
      handleError(error, dispatch, navigate);
    }
  };

  const updatemenu = (id: number) => {
    dispatch(addmenuid(id));
    setupdatemenumodal(true);
  };

  return (
    <div>
      <Header onProfileClick={handleProfileClick} />
      <div className="my-5 mx-52">
        <h1 className="text-4xl text-center text-slate-500 font-bold underline decoration-2">
          Your All Menu Items
        </h1>
        <div className="flex flex-wrap mt-12">
          {menuitem.map((data: MenuAttributes) => (
            <div
              className="w-1/4 p-4 mb-5 border border-gray-300 rounded-lg shadow-lg"
              key={data.id}
            >
              <div className="w-72 h-56 mx-auto">
                <img
                  className="w-full h-full rounded-lg"
                  src={`${REACT_APP_IMAGEURL}${data.image}`}
                  alt="none"
                />
              </div>
              <div className="p-2 mt-4 text-center">
                <p className="truncate text-xl text-slate-500">{data.item_name}</p>
                <p className="truncate text-slate-500">Rs.{data.price}</p>
              </div>
              <div className="flex justify-center gap-5 mt-4">
                <button
                  className="bg-lime-700 text-white px-4 py-2 rounded-lg font-bold"
                  onClick={() => updatemenu(data.id)}
                >
                  Update
                </button>
                <button
                  className="bg-red-400 text-white px-4 py-2 rounded-lg font-bold"
                  onClick={() => removeitem(data.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {updatemenumodal && (
            <UpdateMenu
              show={updatemenumodal}
              onHide={() => setupdatemenumodal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Rest_Home;
