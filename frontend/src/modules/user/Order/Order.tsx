import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State, State_user } from '../../../Types/reducer.types';
import { Menu } from '../../../Types/menu.types';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import { handleError } from '../../../utils/util';
import instance from '../../../base-axios/useAxios';
import { emptycart } from '../../../redux-toolkit/Reducers/actions';

const Order: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state: State_user) => state.user);
  const cart = useSelector((state: State) => state.cart);

  const payment = async () => {
    await instance({
      url: `cart/removecartdata/${data.id}`,
      method: 'GET',
    })
      .then((res) => {
        console.log(res);
        dispatch(emptycart());
        navigate('/');
      })
      .catch((error) => {
        handleError(error, dispatch, navigate);
      });
  };

  if (cart.cart.length === 0) {
    return (
      <div className="absolute top-20 right-64 h-[880px]">
        <div className="p-5">
          <p className="text-center text-4xl font-bold italic text-slate-600">
            No Order Here at Now
          </p>
        </div>
        <div className="mt-10 ml-16 p-5">
          <p className="text-xl">
            <SendIcon className="mr-2" />
            Please Select Item first!!
          </p>
          <p
            className="mt-5 ml-16 bg-slate-500 p-3 w-36 text-center text-xl text-slate-100 font-bold cursor-pointer"
            onClick={() => navigate('/')}
          >
            Add Item
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-20 right-64 h-[880px]">
      <div className="p-5">
        <p className="text-center text-4xl font-bold italic text-slate-600">
          Order Now
        </p>
      </div>
      <div className="wishlist_container">
        {cart.cart.map((data: Menu, index: number) => (
          <div className="cart_wishlist" key={index}>
            <div className="flex justify-center items-center gap-x-9 mt-4">
              <img
                className="h-32 w-40 rounded-xl"
                src={`http://192.168.10.119:8000/` + data.image}
                alt="none"
              />
              <div>
                <p className="text-slate-600 font-bold text-xl">{data.item_name}</p>
                <div>
                  <p>
                    <b>Price : </b>${data.price}
                  </p>
                  <p>
                    <b>Total Items : </b>
                    {data.count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <hr className="mt-5 ml-28 w-4/5 h-1.5 bg-black" />
        <div className="mt-3 float-right mr-28">
          <p className="text-xl">
            <b>Price : </b> ${cart.total}
          </p>
          <p className="text-xl">
            <b>Delivery : </b> ${cart.totalItems * 15}
          </p>
          <p className="text-xl">
            <b>Total : </b> ${cart.total + cart.totalItems * 15}
          </p>
        </div>
        <div className="mt-20 ml-40 bg-red-500 p-5 w-44 h-11">
          <p
            className="text-lg font-bold text-white text-center cursor-pointer"
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </p>
        </div>
        <div className="mt-5 ml-[30rem] bg-red-500 p-5 w-44 h-11">
          <p
            className="text-lg font-bold text-white text-center cursor-pointer"
            onClick={() => payment()}
          >
            Go to Payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default Order;
