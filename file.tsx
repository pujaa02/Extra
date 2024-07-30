/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Register from "./modules/Register/Register";
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
import Home from "./modules/user/home/Home";
import Login from "./modules/Login/Login";
import Wrongurl from "./modules/wrongurl/Wrong";
import adminRating from "./modules/admin/components/List_of_Ratings";
import adminRestaurant from "./modules/admin/components/List_of_Restaurant";
import adminMenu from "./modules/admin/components/List_of_Menu";
import adminHome from "./modules/admin/components/Home";
import adminUser from "./modules/admin/components/List_of_Users";
import { State_sidebar, State_user } from "./Types/reducer";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute"; // Assuming you have this component for unauthenticated access

const App: React.FC = () => {
  const user = useSelector((state: State_user) => state.user);
  const [role, setRole] = useState<string>('');

  useEffect(() => {
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
      default:
        setRole("guest");
        break;
    }
  }, [user.role_id]);

  const sidebarvisibility = useSelector((state: State_sidebar) => state.show);
  const [defaultComponent, setDefaultComponent] = useState("profile");

  return (
    <div className="overflow-hidden">
      <div>
        <Routes>
          <Route path="/" element={<Navigate to={`/${role}`} />} />
          
          <Route path="/admin" element={<PrivateRoute component={Admin_Home} role="admin" />}>
            <Route path="home" element={<PrivateRoute component={adminHome} role="admin" />} />
            <Route path="users" element={<PrivateRoute component={adminUser} role="admin" />} />
            <Route path="restaurants" element={<PrivateRoute component={adminRestaurant} role="admin" />} />
            <Route path="menus" element={<PrivateRoute component={adminMenu} role="admin" />} />
            <Route path="ratings" element={<PrivateRoute component={adminRating} role="admin" />} />
          </Route>

          <Route path="/user" element={<PrivateRoute component={Home} role="user" />} />
          <Route path="/restaurant_owner" element={<PrivateRoute component={Rest_Home} role="restaurant_owner" />} />

          <Route path="/data" element={<PrivateRoute component={Data} role="user" />} />
          <Route path="/cart" element={<PrivateRoute component={Cart} role="user" />} />

          <Route
            path="/dashboard"
            element={
              <MainLayout sidebarVisible={sidebarvisibility} defaultComponent={defaultComponent} />
            }
          >
            <Route path="profile" element={<PrivateRoute component={Profile} role="user" />} />
            <Route path="order" element={<PrivateRoute component={Order} role="user" fallbackComponent={Wrongurl} />} />
            <Route path="restaurant" element={<PrivateRoute component={Restaurant} role="restaurant_owner" fallbackComponent={Wrongurl} />} />
            <Route path="menu" element={<PrivateRoute component={Menu} role="restaurant_owner" fallbackComponent={Wrongurl} />} />
            <Route path="menubulk" element={<PrivateRoute component={MenuBulk} role="restaurant_owner" fallbackComponent={Wrongurl} />} />
            <Route path="chat" element={<PrivateRoute component={role === 'admin' ? AdminChat : Chat} role={role} fallbackComponent={Wrongurl} />} />
          </Route>

          <Route path="/register" element={<PublicRoute component={Register} />} />
          <Route path="/login" element={<PublicRoute component={Login} />} />
          <Route path="/forgetpassword" element={<PublicRoute component={ForgetPass} />} />
          <Route path="*" element={<Wrongurl />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;




/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Register from "./modules/Register/Register";
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
import Home from "./modules/user/home/Home";
import Login from "./modules/Login/Login";
import Wrongurl from "./modules/wrongurl/Wrong";
import adminRating from "../src/modules/admin/components/List_of_Ratings";
import adminRestaurant from "../src/modules/admin/components/List_of_Restaurant";
import adminMenu from "../src/modules/admin/components/List_of_Menu";
import adminHome from "../src/modules/admin/components/Home";
import adminUser from "../src/modules/admin/components/List_of_Users";
import { State_sidebar, State_user } from "./Types/reducer";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute"; // Assuming this is used for routes accessible by unauthenticated users

const App: React.FC = () => {
  const user = useSelector((state: State_user) => state.user);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
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
      default:
        setRole("guest");
        break;
    }
  }, [user.role_id]);

  const sidebarvisibility = useSelector((state: State_sidebar) => state.show);
  const [defaultComponent, setDefaultComponent] = useState("profile");

  return (
    <div className="overflow-hidden">
      <div>
        <Routes>
          <Route path="/" element={<Navigate to={`/${role}`} />} />

          <Route
            path="/admin"
            element={<PrivateRoute component={Admin_Home} role="admin" />}
          >
            <Route
              path="home"
              element={<PrivateRoute component={adminHome} role="admin" />}
            />
            <Route
              path="users"
              element={<PrivateRoute component={adminUser} role="admin" />}
            />
            <Route
              path="restaurants"
              element={<PrivateRoute component={adminRestaurant} role="admin" />}
            />
            <Route
              path="menus"
              element={<PrivateRoute component={adminMenu} role="admin" />}
            />
            <Route
              path="ratings"
              element={<PrivateRoute component={adminRating} role="admin" />}
            />
          </Route>

          <Route
            path="/user"
            element={<PrivateRoute component={Home} role="user" />}
          />
          <Route
            path="/restaurant_owner"
            element={<PrivateRoute component={Rest_Home} role="restaurant_owner" />}
          />

          <Route
            path="/data"
            element={<PrivateRoute component={Data} role="user" />}
          />
          <Route
            path="/cart"
            element={<PrivateRoute component={Cart} role="user" />}
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
            <Route
              path="profile"
              element={<PrivateRoute component={Profile} role="user" />}
            />
            <Route
              path="order"
              element={
                <PrivateRoute
                  component={Order}
                  role="user"
                  fallbackComponent={Wrongurl}
                />
              }
            />
            <Route
              path="restaurant"
              element={
                <PrivateRoute
                  component={Restaurant}
                  role="restaurant_owner"
                  fallbackComponent={Wrongurl}
                />
              }
            />
            <Route
              path="menu"
              element={
                <PrivateRoute
                  component={Menu}
                  role="restaurant_owner"
                  fallbackComponent={Wrongurl}
                />
              }
            />
            <Route
              path="menubulk"
              element={
                <PrivateRoute
                  component={MenuBulk}
                  role="restaurant_owner"
                  fallbackComponent={Wrongurl}
                />
              }
            />
            <Route
              path="chat"
              element={
                <PrivateRoute
                  component={role === "admin" ? AdminChat : Chat}
                  role={role}
                  fallbackComponent={Wrongurl}
                />
              }
            />
          </Route>

          <Route
            path="/register"
            element={<PublicRoute component={Register} />}
          />
          <Route path="/login" element={<PublicRoute component={Login} />} />
          <Route
            path="/forgetpassword"
            element={<PublicRoute component={ForgetPass} />}
          />
          <Route path="*" element={<Wrongurl />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
              

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ component: Component, role, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        user.isAuthenticated && user.role === role ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;



