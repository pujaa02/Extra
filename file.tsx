/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, } from "react-router-dom";
import Register from "./modules/Register/Register";
import { useSelector } from "react-redux";
import { State_sidebar, State_user } from "./Types/reducer";
import Restaurant from "./modules/restaurant/restaurantprofile/Restaurant";
import Menu from "./modules/restaurant/Menu/Menu";
import MenuBulk from "./modules/restaurant/Addmenubulk/Menu";
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
  const [role, setRole] = useState<string>('');
  useEffect(() => {
    console.log(user.role_id);

    switch (user.role_id) {
      case 1:
        setRole("admin");
        break;
      case 2:
        setRole("restaurant_owner");
        break;
      case 4:
        setRole("user");
        break;
      case undefined:
        setRole("user");
        break;
      default:
        break;
    }
  }, [])

  const sidebarvisibility = useSelector((state: State_sidebar) => state.show);
  const [defaultComponent, setDefaultComponent] = useState("profile");

  return (
    <div className="overflow-hidden">
      <div>
        <Routes>
          <Route path="/" element={<Navigate to={`/${role}`} />} />
          <Route path="/admin" element={role === 'admin' && <Admin_Home />} >
            <Route path="/admin/" element={<ProtectedRoute component={adminHome} />} />
            <Route path="/admin/users" element={<ProtectedRoute component={adminUser} />} />
            <Route path="/admin/restaurants" element={<ProtectedRoute component={adminRestaurant} />} />
            <Route path="/admin/menus" element={<ProtectedRoute component={adminMenu} />} />
            <Route path="/admin/ratings" element={<ProtectedRoute component={adminRating} />} />
          </Route>
          <Route path="/user" element={role === 'user' ? <Home /> : <Navigate to="/" />} />
          <Route path="/restaurant_owner" element={role === 'restaurant_owner' ? <Rest_Home /> : <Navigate to="/" />} />

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
            <Route path="order" element={<ProtectedRoute component={role === 'user' ? Order : Wrongurl} />} />
            <Route path="restaurant" element={<ProtectedRoute component={role === 'restaurant_owner' ? Restaurant : Wrongurl} />} />
            <Route path="menu" element={<ProtectedRoute component={role === 'restaurant_owner' ? Menu : Wrongurl} />} />
            <Route path="menubulk" element={<ProtectedRoute component={role === 'restaurant_owner' ? MenuBulk : Wrongurl} />} />
            <Route path="chat" element={<ProtectedRoute component={role === 'admin' ? AdminChat : Chat} />} />

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
