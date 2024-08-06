import React from "react";
import { MonthProps } from "../../types/calander";

const MonthOverview: React.FC<MonthProps> = ({ year, month }) => {
    const firstday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    return (
        <div className="w-[300px] border-0 border-white rounded p-2.5 bg-slate-50 m-2">
            <h3 className="text-base text-slate-700">{monthName}</h3>
            <div className="mt-3 text-center grid grid-cols-7  mb-3 text-xs text-slate-700">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
            </div>
            <div className="grid grid-cols-7 text-center">
                {Array.from({ length: firstday }).map((_, index) => (
                    <div key={index} className="empty-slot"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    // const eventsForDay = monthEvents.filter(event => new Date(event.start).getDate() === day);
                    
                    return (
                        <div key={dayIndex} >
                            <div className="text-slate-600 text-sm p-1">{day}</div>
                            {/* <div className="day-events">
                                {eventsForDay.map(event => (
                                    <div key={event.id} className="event-indicator">{event.title}</div>
                                ))}
                            </div> */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MonthOverview;