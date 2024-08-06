/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useState } from "react";
import MonthView from "../components/month/MonthView";
import { day } from "../types/calander";
import YearView from "./year/YearView";
import WeekView from "./week/WeekView";
import DayView from "./day/DayView";

const Calendar: React.FC = () => {
    const [crntDate, setCrntDate] = useState(new Date()); //day
    const [crntDateOfWeek, setCrntDateOfWeek] = useState(new Date()); //week
    const [currentDate, setCurrentDate] = useState(new Date()); //month
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); //year
    const [view, setView] = useState('month');
    const handleViewChange = (name: string) => {
        setView(name);
    };

    const changeCurrentDay = (day: day) => {
        setCurrentDate(new Date(day.year, day.month, day.number));
    }

    const previousmonth = () => {
        setCrntDate(new Date(crntDate.setDate(crntDate.getDate() - 1))); //day

        setCrntDateOfWeek(new Date(currentDate.setDate(currentDate.getDate() - 7)));  //week

        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); //month

        setCurrentYear(currentYear - 1); //year

    }

    const nextmonth = () => {
        setCrntDate(new Date(crntDate.setDate(crntDate.getDate() + 1))); //day

        setCrntDateOfWeek(new Date(currentDate.setDate(currentDate.getDate() + 7))); //week

        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); //month

        setCurrentYear(currentYear + 1); //year
    }

    return (
        <div className="m-4 ">
            <header>
                <div className="flex ml-52">
                    <div className="flex gap-2.5 text-2xl">
                        <p onClick={previousmonth}>&lt;</p>
                        <p onClick={nextmonth}>&gt;</p>
                        {view === "day" && <p className="ml-4">{`${crntDate.toLocaleString('default', { month: 'long' })}  ${crntDate.getDate()}, ${crntDate.getFullYear()}`} </p>}

                        {view === "week" && <p className="ml-4">{`${crntDateOfWeek.toLocaleString('default', { month: 'long' })}   ${crntDateOfWeek.getFullYear()}`} </p>}

                        {view === "month" && <p className="ml-4">{`${currentDate.toLocaleString('default', { month: 'long' })}   ${currentDate.getFullYear()}`} </p>}

                        {view === "year" && <p className="ml-4">{currentYear} </p>}
                    </div>
                    <div className="ml-auto">
                        <select
                            id="select"
                            name="select"
                            className="border border-gray-300 rounded-md mr-72 p-2"
                            onChange={(e) => handleViewChange(e.target.value)}
                        >
                            <option value="day" >Day</option>
                            <option value="week" >Week</option>
                            <option value="month" selected>Month</option>
                            <option value="year" >Year</option>
                        </select>
                    </div>
                </div>
            </header>
            <div className="mt-3">
                <div className="w-full">
                    <div className="mt-5">
                        {view === "day" && <DayView date={crntDate}/>}
                        {view === "week" && <WeekView crntDateOfWeek={crntDateOfWeek} />}
                        {view === "month" && <MonthView curdate={currentDate} changeCurrentDay={changeCurrentDay} />}
                        {view === "year" && <YearView currentyear={currentYear} />}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Calendar;