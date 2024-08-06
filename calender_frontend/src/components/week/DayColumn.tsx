import React from "react";
import { WeeekDayProps } from "../../types/calander";

const WeekView: React.FC<WeeekDayProps> = ({ date, hours }) => {
    console.log("🚀 ~ date:", date)
    return (
        <div className="day-column">
            {hours.map((hour, index) => (
                <div key={index} className="time-slot">
                    <div className="hour-label">{hour}</div>
                    <div className="events">
                        {/* {dayEvents
                            .filter(event => new Date(event.start).getHours() === index)
                            .map((event, idx) => (
                                <div key={idx} className="event">
                                    {event.title}
                                </div>
                            ))} */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default WeekView;