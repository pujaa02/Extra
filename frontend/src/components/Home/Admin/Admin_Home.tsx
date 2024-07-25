/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../Header/Header";
import { visible } from "../../Store/Reducers/actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar_Admin from "./Sidebar_Admin";
import instance from "../../../Hooks/useAxios";
import { handleError } from "../../../utils/util";
const Amin_Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [defaultComponent, setDefaultComponent] = useState("profile");
    const handleProfileClick = () => {
        dispatch(visible())
        setDefaultComponent("profile");
        navigate("/dashboard/profile");
    };

    const fetchdata = async () => {
        await instance({
            url: `user/getuser`,
            method: "GET",
        })
            .then((res) => {
                console.log(res.data.result, "result");

            })
            .catch((error) => {
                handleError(error, dispatch, navigate);
            })
    }
    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <div className="">
            <Header onProfileClick={handleProfileClick} />
            <div className="min-h-screen">
                <div className="flex flex-row pt-24 px-10 pb-4">
                    <div className="w-2/12 ml-24 mr-6">
                        <Sidebar_Admin />
                    </div>
                    <div className="w-8/12">
                        <div className="flex flex-row  h-[calc(80vh-2rem)]">
                            <div className="bg-no-repeat bg-slate-100 border border-slate-100 rounded-xl w-full mr-2 p-6" >
                                <div className="flex flex-row h-44">
                                    <div className="bg-white rounded-xl shadow-lg px-6 py-4 w-4/12">
                                        <p className="text-sky-600 text-3xl text-center">Total Users</p>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-lg mx-6 px-6 py-4 w-4/12">
                                        <p className="text-sky-600 text-3xl text-center"> Total Restaurants</p>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-lg px-6 py-4 w-4/12">
                                        <p className="text-sky-600 text-3xl text-center">Total MenuItems</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Amin_Home;