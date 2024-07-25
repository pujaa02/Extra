/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../modules/Sidebar/Sidebar";
import { useDispatch } from "react-redux";
import Header from "../Header/Header";
import { visible } from "../redux-toolkit/Reducers/actions";

interface MainLayoutProps {
    sidebarVisible: boolean;
    defaultComponent: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    sidebarVisible,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [defaultComponent, setDefaultComponent] = useState("profile");
    const handleNavigation = (path: string) => {
        navigate(`/dashboard/${path}`);
    };
    const handleProfileClick = () => {
        dispatch(visible())
        setDefaultComponent("profile");
        navigate("/dashboard/profile");
    };
    return (
        <div >
            <Header onProfileClick={handleProfileClick} />
            {sidebarVisible && <Sidebar onNavigate={handleNavigation} />}
            <div className="ml-96 p-4 w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;