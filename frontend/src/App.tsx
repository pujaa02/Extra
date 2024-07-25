import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Register from './modules/Register/Register';
import Home from './modules/user/home/Home';
import Profile from './modules/Container/Profile/Profile';
import Order from './modules/user/Order/Order';
import Cart from './modules/user/Cart/Cart';
import MainLayout from './modules/Container/MainLayout';
import { useSelector } from 'react-redux';
import { State_sidebar, State_user } from './Types/reducer.types';
import Restaurant from './modules/restaurant/RestaurantProfile/Restaurant';
import Menu from './modules/restaurant/Menu/Menu';
import Rest_Home from './modules/restaurant/home/Rest_Home';
import Chat from './modules/restaurant/chat/Chat';
import AdminChat from './modules/admin/chat/AdminChat';
import { Login } from '@mui/icons-material';
import ForgetPass from './modules/Forgetpassword/ForgetPassword';
import Admin_Home from './modules/admin/home/Admin_Home';
import { ProtectedRoute, CheckUser } from './utils/ProtectedRoute';

const App: React.FC = () => {
  const user = useSelector((state: State_user) => state.user);
  const sidebarvisibility = useSelector((state: State_sidebar) => state.show);
  const [defaultComponent, setDefaultComponent] = useState('profile');

  return (
    <div className="overflow-hidden">
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={[2]}>
                <Rest_Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <Admin_Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={[4]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={[4]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <MainLayout
                sidebarVisible={sidebarvisibility}
                defaultComponent={defaultComponent}
              />
            }
          >
            <Route element={<ProtectedRoute allowedRoles={[1, 2, 4]} />}>
              <Route path="profile" element={<Profile />} />
              <Route
                path="order"
                element={
                  <ProtectedRoute allowedRoles={[4]}>
                    <Order />
                  </ProtectedRoute>
                }
              />
              <Route
                path="restaurant"
                element={
                  <ProtectedRoute allowedRoles={[2]}>
                    <Restaurant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="menu"
                element={
                  <ProtectedRoute allowedRoles={[2]}>
                    <Menu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="chat"
                element={
                  <ProtectedRoute allowedRoles={[1, 2]}>
                    {user.role_id === 1 ? <AdminChat /> : <Chat />}
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
          <Route path="/register" element={<CheckUser component={Register} />} />
          <Route path="/login" element={<CheckUser component={Login} />} />
          <Route path="/forgetpassword" element={<ForgetPass />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
