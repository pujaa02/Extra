import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { ProtectedRouteProps } from "../Types/protectedroute";
import { State_user } from "../Types/reducer";

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
//     const location = useLocation();
//     const user = useSelector((state: State_user) => state.user);
//     if (!user?.id) {
//         return <Navigate to="/login" state={{ from: location }} />;
//     }
//     return <Component />
// };
export const ProtectedRoute: React.FC = () => {
    const location = useLocation();
    const user = useSelector((state: State_user) => state.user);
    if (!user?.id) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    return <Outlet />
};

export const CheckUser: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const user = useSelector((state: State_user) => state.user);
    return (user?.id) ? <Navigate to="/" /> : <Component />;
}

export const RoleIDProtectedRoute: React.FC<ProtectedRouteProps> = () => {
    const user = useSelector((state: State_user) => state.user);
    return (user?.id) ? <Outlet /> : <Navigate to="*" />;
};