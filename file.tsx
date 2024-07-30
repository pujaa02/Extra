/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Route, Routes, } from "react-router-dom";
import Register from "./modules/Register/Register";
import { useSelector } from "react-redux";
import { State_sidebar, State_user } from "./Types/reducer";
import Restaurant from "./modules/restaurant/restaurantprofile/Restaurant";
import Menu from "./modules/restaurant/Menu/Menu";
import Chat from "./modules/restaurant/chat/Chat";
import AdminChat from "./modules/admin/chat/AdminChat";
import ForgetPass from "./modules/Forgetpassword/ForgetPassword";
import Admin_Home from "./modules/admin/home/Admin_Home";
import MainLayout from "./modules/container/MainLayout";
import Profile from "./modules/container/Profile/Profile";
import Rest_Home from "./modules/restaurant/home/Rest_Home";
import Cart from "./modules/user/Cart/Cart";
import Order from "./modules/user/Order/Order";
import Data from "./modules/user/home/Data";
import { CheckUser, ProtectedRoute } from "./utils/ProtectedRoute";
import Home from "./modules/user/home/Home";
import Login from "./modules/Login/Login";
import Wrongurl from "./modules/wrongurl/Wrong";
import adminRating from "../src/modules/admin/components/List_of_Ratings";
import adminRestaurant from "../src/modules/admin/components/List_of_Restaurant";
import adminMenu from "../src/modules/admin/components/List_of_Menu";
import adminHome from "../src/modules/admin/components/Home";
import adminUser from "../src/modules/admin/components/List_of_Users";

const App: React.FC = () => {
  const user = useSelector((state: State_user) => state.user);
  const sidebarvisibility = useSelector((state: State_sidebar) => state.show);
  const [defaultComponent, setDefaultComponent] = useState("profile");

  return (
    <div className="overflow-hidden">
      <div>
        <Routes>
          {user.role_id === 2 && <Route path="/" element={user.role_id === 2 ? <Rest_Home /> : <Wrongurl />} />}
          {user.role_id === 1 &&
            <Route 
            path="/" 
            element={
            <Admin_Home defaultComponent="home" />
            } >

              <Route path="" element={<ProtectedRoute component={adminHome} />} />
              <Route path="users" element={<ProtectedRoute component={adminUser} />} />
              <Route path="restaurants" element={<ProtectedRoute component={adminRestaurant} />} />
              <Route path="menus" element={<ProtectedRoute component={adminMenu} />} />
              <Route path="ratings" element={<ProtectedRoute component={adminRating} />} />

            </Route>}
          {user.role_id === 4 && <Route path="/" element={<Home />} />}
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
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
            <Route path="profile" element={<ProtectedRoute component={Profile} />} />
            <Route path="order" element={<ProtectedRoute component={user.role_id === 4 ? Order : Wrongurl} />} />
            <Route path="restaurant" element={<ProtectedRoute component={user.role_id === 2 ? Restaurant : Wrongurl} />} />
            <Route path="menu" element={<ProtectedRoute component={user.role_id === 2 ? Menu : Wrongurl} />} />
            <Route path="chat" element={<ProtectedRoute component={user.role_id === 1 ? AdminChat : Chat} />} />

          </Route>
          <Route path="/register" element={<CheckUser component={Register} />} />
          <Route path="/login" element={<CheckUser component={Login} />} />
          <Route path="/forgetpassword" element={<ForgetPass />} />
          <Route path="*" element={<Wrongurl />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
