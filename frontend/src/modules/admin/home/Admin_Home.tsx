/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import instance from '../../../base-axios/useAxios';
import { handleError } from '../../../utils/util';
import { RegData } from '../../../Types/register.types';
import { RestaurantAttributes } from '../../../Types/restaurant.types';
import { Menu } from '../../../Types/menu.types';
import Header from '../../../components/Header/Header';
import { visible } from '../../../redux-toolkit/Reducers/actions';
import Sidebar_Admin from './Sidebar_Admin';
const Admin_Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [users, setUsers] = useState<RegData[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantAttributes[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [defaultComponent, setDefaultComponent] = useState('profile');
  const handleProfileClick = () => {
    dispatch(visible());
    setDefaultComponent('profile');
    navigate('/dashboard/profile');
  };

  const fetchdata = async () => {
    await instance({
      url: `user/getalldata`,
      method: 'GET',
    })
      .then((res) => {
        setUsers(res.data.users);
        setRestaurants(res.data.restaurants);
        setMenus(res.data.menus);
      })
      .catch((error) => {
        handleError(error, dispatch, navigate);
      });
  };
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="">
      <Header onProfileClick={handleProfileClick} />
      <div className="min-h-screen">
        <div className="flex flex-row pt-24 px-10 pb-4">
          <div className="w-2/12 ml-24 mr-6">
            <Sidebar_Admin />
          </div>
          <div className="w-8/12">
            <div className="flex flex-row  h-[calc(80vh-2rem)]">
              <div className="bg-no-repeat bg-slate-100 border border-slate-100 rounded-xl w-full mr-2 p-6">
                <div className="flex flex-row h-44">
                  <div className="bg-white rounded-xl shadow-lg px-6 py-4 w-4/12">
                    <p className="relative text-sky-600 text-3xl text-center">
                      Total Users{' '}
                      <span className="absolute top-16 right-36 text-red-600 font-bold text-5xl">
                        {users.length}
                      </span>
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg mx-6 px-6 py-4 w-4/12">
                    <p className=" relative text-sky-600 text-3xl text-center">
                      {' '}
                      Total Restaurants{' '}
                      <span className="absolute top-16 right-36 text-red-600 font-bold text-5xl">
                        {restaurants.length}
                      </span>
                    </p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg px-6 py-4 w-4/12">
                    <p className="relative text-sky-600 text-3xl text-center">
                      Total MenuItems{' '}
                      <span className="absolute top-16 right-36 text-red-600 font-bold text-5xl">
                        {menus.length}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Home;
