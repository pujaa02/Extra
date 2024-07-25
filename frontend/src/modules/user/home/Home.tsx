/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import instance from '../../../base-axios/useAxios';
import { Menu } from '../../../Types/menu.types';
import { RestaurantAverage } from '../../../Types/restaurant.types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { REACT_APP_IMAGEURL } from '../../../config';
import Header from '../../../components/Header/Header';
import { visible, add_to_cart, remove_menu, add_menu } from '../../../redux-toolkit/Reducers/actions';

const Home: React.FC = () => {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [restaurant, setRestaurant] = useState<RestaurantAverage[]>([]);
  const dispatch = useDispatch();
  const [defaultComponent, setDefaultComponent] = useState('profile');
  const navigate = useNavigate();

  const fetchall = async () => {
    try {
      const menuResponse = await instance({
        url: 'home/findmenuall',
        method: 'GET',
      });
      setMenu(menuResponse.data.result);

      const restaurantResponse = await instance({
        url: '/home/toprestaurant',
        method: 'GET',
      });
      setRestaurant(restaurantResponse.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchall();
  }, []);

  const handleProfileClick = () => {
    dispatch(visible());
    setDefaultComponent('profile');
    navigate('/dashboard/profile');
  };

  const additem = (data: Menu) => {
    dispatch(add_to_cart(data));
  };

  const getsameproduct = async (str: string, name: string | number) => {
    const url =
      str === 'menu'
        ? `/home/fetchmenuitems/${name}`
        : `/home/getrestaurantallmenu/${name}`;
    try {
      const res = await instance({
        url,
        method: 'GET',
      });
      dispatch(remove_menu());
      res.data.result.forEach((obj: Menu) => dispatch(add_menu(obj)));
      navigate('/data');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="h-screen overflow-y-scroll">
      <Header onProfileClick={handleProfileClick} />
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-green-600 text-2xl underline underline-offset-8">
            What's on your mind?
          </h2>
        </div>
        <div className="flex overflow-x-scroll space-x-6 pb-6">
          {menu.map((data: Menu) => (
            <div
              className="w-1/4 p-4 border border-gray-300 rounded-lg shadow-lg cursor-pointer"
              key={data.menu_id}
              onClick={() => getsameproduct('menu', data.item_name)}
            >
              <div className="flex justify-center">
                <img
                  className="w-64 h-56 rounded-lg"
                  src={`${REACT_APP_IMAGEURL}${data.image}`}
                  alt="none"
                />
              </div>
              <div className="text-center mt-4">
                <p className="truncate text-xl font-medium text-gray-700">
                  {data.item_name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-6 mt-10">
          <h2 className="text-green-600 text-2xl underline underline-offset-8">
            Top Restaurant
          </h2>
        </div>
        <div className="flex overflow-x-scroll space-x-6 pb-6">
          {restaurant.map((data: RestaurantAverage) => (
            <div
              className="w-1/4 p-4 border border-gray-300 rounded-lg shadow-lg cursor-pointer"
              key={data.restaurant_id}
              onClick={() => getsameproduct('restaurant', data.restaurant_id)}
            >
              <div className="flex justify-center">
                <img
                  className="w-64 h-56 rounded-lg"
                  src={`${REACT_APP_IMAGEURL}${data.restaurant_image}`}
                  alt="none"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-xl font-medium text-gray-700">
                  {data.average_rating ? (
                    <span className="font-bold">
                      {data.average_rating.toFixed(1)}
                      <StarIcon className="text-yellow-500" />
                    </span>
                  ) : (
                    <span className="mt-4"></span>
                  )}
                </p>
                <p className="truncate text-xl font-medium text-gray-700">
                  {data.restaurant_name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-6 mt-10">
          <h2 className="text-green-600 text-2xl underline underline-offset-8">
            All items
          </h2>
        </div>
        <div className="flex flex-wrap space-x-6 space-y-6">
          {menu.map((data: Menu) => (
            <div
              className="w-1/4 p-4 border border-gray-300 rounded-lg shadow-lg"
              key={data.menu_id}
            >
              <div className="flex justify-center">
                <img
                  className="w-72 h-60 rounded-lg"
                  src={`${REACT_APP_IMAGEURL}${data.image}`}
                  alt="none"
                />
              </div>
              <div className="mt-4">
                {data.avgrate && (
                  <p className="text-xl font-medium text-gray-700">
                    {data.avgrate}
                    <StarIcon className="text-yellow-500" />
                  </p>
                )}
                <p className="truncate text-xl font-medium text-gray-700">
                  {data.item_name}
                </p>
                <p className="text-red-500 font-bold">{data.name}</p>
                <p className="text-xl font-medium text-gray-700">
                  Price: <span className="text-gray-500">Rs.{data.price}</span>
                </p>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold"
                  onClick={() => additem(data)}
                >
                  Add item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
