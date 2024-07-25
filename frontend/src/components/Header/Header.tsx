import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { State, State_user } from '../../Types/reducer.types';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import instance from '../../base-axios/useAxios';
import Cookies from 'js-cookie';
import { removeuser, unvisible, emptycart, removerestid } from '../../redux-toolkit/Reducers/actions';
interface HeaderProps {
  onProfileClick: () => void;
}
const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state: State_user) => state.user);
  const cart = useSelector((state: State) => state.cart);
  const handleLogout = async () => {
    if (cart.cart.length !== 0) {
      await instance({
        url: `cart/addtocart/${data.id}`,
        method: 'POST',
        data: cart.cart,
      });
    }
    dispatch(removeuser());
    dispatch(unvisible());
    dispatch(emptycart());
    dispatch(removerestid());
    Cookies.remove('token');
    navigate('/');
  };
  return (
    <div className="w-full mx-auto rounded-lg text-primary relative top-0 left-0">
      <div className="bg-red-600 p-7">
        <p className="text-white text-xl font-bold flex items-center space-x-2 ml-40 -mt-6">
          <Link to="/home">
            <img
              id="miimg"
              src={require('./logo.png')}
              alt="none"
              className="w-16 h-12 rounded-full"
            />
            Foodies
          </Link>
        </p>
        <ul className="flex items-center justify-end space-x-8 mt-[-50px] font-bold text-lg text-white mr-32">
          {data.id ? (
            <li onClick={handleLogout}>
              <Link to="">
                <LogoutIcon className="text-white text-3xl" /> Logout
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/login">
                <LoginIcon className="text-white text-3xl" /> Login
              </Link>
            </li>
          )}
          {(!data.id || data.role_id === 4) && (
            <li className="relative">
              <Link to="/cart">
                <ShoppingCartIcon className="text-white text-3xl" />
                <p className="absolute top-[-10px] left-[20px]">
                  {cart.totalItems || 0}
                </p>
              </Link>
            </li>
          )}

          {data.id && (
            <li className="relative" onClick={onProfileClick}>
              <Link to="">
                <AccountCircleIcon className="text-white text-3xl" />
                <p className="absolute top-0 left-6">{data.fname}</p>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
