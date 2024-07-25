/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { State } from '../../../Types/reducer.types';
import { Menu } from '../../../Types/menu.types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Header from '../../../components/Header/Header';
import { visible, decrement, increment, remove_from_cart } from '../../../redux-toolkit/Reducers/actions';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [defaultComponent, setDefaultComponent] = useState('profile');
  const cart = useSelector((state: State) => state.cart);

  const handleProfileClick = () => {
    dispatch(visible());
    setDefaultComponent('profile');
    navigate('/dashboard/profile');
  };

  if (cart.cart.length === 0) {
    return (
      <div className="container mx-auto text-center text-gray-800">
        <Header onProfileClick={handleProfileClick} />
        <div className="mt-10">
          <p className="text-2xl font-bold text-red-600">Your Cart is Now Empty!!</p>
          <img
            className="mx-auto mt-5 rounded"
            src={require(`./empty_cart.gif`)}
            alt="none"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header onProfileClick={handleProfileClick} />
      <div className="w-full">
        <header>
          <h2 className="mt-16 flex items-center justify-center font-bold text-3xl">
            Your Cart({cart.totalItems})
          </h2>
        </header>
        <div className="container mx-auto mt-10">
          <table className="w-4/5 mx-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b p-4">Item</th>
                <th className="border-b p-4">Price</th>
                <th className="border-b p-4">Quantity</th>
                <th className="border-b p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.cart.map((data: Menu, index: number) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <td className="flex items-center p-4">
                    <img
                      className="w-24 h-12"
                      src={`http://192.168.10.119:8000/${data.image}`}
                      alt="none"
                    />
                    <p className="ml-5">{data.item_name}</p>
                  </td>
                  <td className="p-4">Rs.{data.price}</td>
                  <td className="p-4">
                    <table className="border-collapse">
                      <tbody>
                        <tr>
                          <td
                            className="border p-2 cursor-pointer"
                            onClick={() => dispatch(decrement(data.menu_id))}
                          >
                            <RemoveIcon />
                          </td>
                          <td className="border p-2 w-12 text-center">
                            {data.count}
                          </td>
                          <td
                            className="border p-2 cursor-pointer"
                            onClick={() => dispatch(increment(data.menu_id))}
                          >
                            <AddIcon />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="p-4">Rs.{data.price * data.count}</td>
                  <td
                    className="p-4 cursor-pointer"
                    onClick={() => dispatch(remove_from_cart(data.menu_id))}
                  >
                    <DeleteForeverIcon className="text-red-700" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-12 mr-12">
            <p className="text-xl font-semibold">SubTotal: Rs.{cart.total}</p>
          </div>
          <p
            className="mt-40 ml-auto mr-20 p-4 w-64 bg-green-500 text-white text-center rounded cursor-pointer font-bold text-lg"
            onClick={() => navigate('/dashboard/order')}
          >
            Proceed to Buy ({cart.totalItems} items)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
