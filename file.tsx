/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import ForgetPass from "./components/Forgetpassword/ForgetPassword";
import Home from "./components/Home/Home";
import Profile from "./components/Container/Profile/Profile"
import Order from "./components/Container/Order/Order";
import Cart from "./components/Cart/Cart";
import MainLayout from "./components/Container/MainLayout";
import { useSelector } from "react-redux";
import { State_sidebar, State_user } from "./Types/reducer";
import Restaurant from "./components/Container/Restaurant/Restaurant";
import Menu from "./components/Container/Menu/Menu";
import Rest_Home from "./components/Home/Rest_Home";
import { CheckUser, ProtectedRoute } from "./protectedroutes/ProtectedRoute";
import Data from "./components/Home/Data";
import Chat from "./components/Container/chat/Chat";
import AdminChat from "./components/Container/chat/AdminChat";
import Admin_Home from "./components/Home/Admin_Home";


const App: React.FC = () => {
  const user = useSelector((state: State_user) => state.user);
  const sidebarvisibility = useSelector((state: State_sidebar) => state.show);
  const [defaultComponent, setDefaultComponent] = useState("profile");

  return (
    <div className="App">
      <div>
        <Routes>
          {if(user.id===2) {
            <Route path="/" element={<Rest_Home />} />
          } else if (user.id ===4 ) {
            <Route path="/" element={<Home />} />
          } else{
            <Route path="/" element={<Admin_Home />} />
          }}
          {/* {user.role_id === 2 ? <Route path="/" element={<Rest_Home />} /> : <Route path="/" element={<Home />} />} */}
          <Route path="/data" element={<Data />} />

          <Route path="/cart" element={<Cart />} />
          <Route
            path="/dashboard"
            element={
              <MainLayout
                sidebarVisible={sidebarvisibility}
                defaultComponent={defaultComponent}
              />
            }
          >
            <Route path="profile" element={<ProtectedRoute component={Profile} />} />
            <Route path="order" element={<ProtectedRoute component={Order} />} />
            <Route path="restaurant" element={<ProtectedRoute component={Restaurant} />} />
            <Route path="menu" element={<ProtectedRoute component={Menu} />} />
            <Route path="chat" element={<ProtectedRoute component={user.role_id === 1 ? AdminChat : Chat} />} />
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
