/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./modules/Login/Login";
import ForgetPass from "./modules/Forgetpassword/ForgetPassword";
import Home from "./modules/Home/Home";
import Profile from "./components/Container/Profile/Profile"
import Order from "./components/Container/Order/Order";
import Cart from "./components/Cart/Cart";
import MainLayout from "./components/Container/MainLayout";
import { useSelector } from "react-redux";
import { State_sidebar, State_user } from "./Types/reducer";
import Restaurant from "./components/Container/Restaurant/Restaurant";
import Menu from "./components/Container/Menu/Menu";
import Rest_Home from "./modules/Home/restaurant/Rest_Home";
import { CheckUser, ProtectedRoute } from "./protectedroutes/ProtectedRoute";
import Chat from "./components/Container/chat/Chat";
import AdminChat from "./components/Container/chat/AdminChat";
import Admin_Home from "./modules/Home/Admin/Admin_Home";


const App: React.FC = () => {
  const user = useSelector((state: State_user) => state.user);
  const sidebarvisibility = useSelector((state: State_sidebar) => state.show);
  const [defaultComponent, setDefaultComponent] = useState("profile");

  return (
    <div className="overflow-hidden">
      <div>
        <Routes>
          {user.role_id === 2 && <Route path="/" element={<Rest_Home />} />}
          {user.role_id === 1 && <Route path="/" element={<Admin_Home />} />}
          {user.role_id === 4 && <Route path="/" element={<Home />} />}
          <Route path="/" element={<Home />} />
          {(!user || user.role_id === 4) && <Route path="/cart" element={<Cart />} />}
          <Route
            path="/dashboard"
            element={
              <MainLayout
                sidebarVisible={sidebarvisibility}
                defaultComponent={defaultComponent}
              />
            }
          >
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
              {user.role_id === 4 && <Route path="order" element={<Order />} />}
              {user.role_id === 2 && <Route path="restaurant" element={< Restaurant />} />}
              {user.role_id === 2 && <Route path="menu" element={<Menu />} />}
              {user.role_id === 1 && <Route path="chat" element={<AdminChat />} />}
              {user.role_id === 2 && <Route path="chat" element={<Chat />} />}
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