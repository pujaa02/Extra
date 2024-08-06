import React from "react";
import { WeekProps } from "../../types/calander";
// import DayColumn from "./DayColumn";

const hours: string[] = Array.from({ length: 24 }, (_, i) => `${i}`);

const WeekView: React.FC<WeekProps> = ({ crntDateOfWeek }) => {
    const startOfWeek = new Date(crntDateOfWeek);
    startOfWeek.setDate(crntDateOfWeek.getDate() - crntDateOfWeek.getDay());

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-7 text-center text-sm  text-slate-600 ml-24">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
            </div>
            <div className="grid grid-cols-7 border-0 border-white ml-24">
                {daysOfWeek.map((date, index) => (
                    <div key={index} className="text-center p-2 text-2xl">
                        {date.getDate()}
                    </div>
                ))}
            </div>
            <div className="mt-8 ml-3">
                {hours.map((hour, index) => (
                    <div key={index} className="h-[50px]">
                        {Number(hour) <= 11 ? <p className="hour-label">{`${hour} AM`}</p> : <p className="hour-label">{`${hour} PM`}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WeekView;