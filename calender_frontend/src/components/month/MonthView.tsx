
import React from "react";
import { Props } from "../../types/calander";

const MonthView: React.FC<Props> = (props) => {
    const curdate = new Date().getDate();
    const curmonth = new Date().getMonth();
    const curyear = new Date().getFullYear();
    const firstdayofMonth = new Date(props.curdate.getFullYear(), props.curdate.getMonth(), 1);
    const weekdayOfFirstDay = firstdayofMonth.getDay();
    const currentDays = [];
    for (let day = 0; day < 35; day++) {
        if (day === 0 && weekdayOfFirstDay === 0) {
            firstdayofMonth.setDate(firstdayofMonth.getDate() - 7); //-6
        } else if (day === 0) {
            firstdayofMonth.setDate(firstdayofMonth.getDate() + (day - weekdayOfFirstDay)); //-3
        } else {
            firstdayofMonth.setDate(firstdayofMonth.getDate() + 1); //2
        }
        const calendarDay = {
            currentMonth: (firstdayofMonth.getMonth() === props.curdate.getMonth()),
            date: (new Date(firstdayofMonth)),
            month: firstdayofMonth.getMonth(),
            number: firstdayofMonth.getDate(),
            selected: (firstdayofMonth.toDateString() === props.curdate.toDateString()),
            year: firstdayofMonth.getFullYear()
        }
        currentDays.push(calendarDay);
    }
    return (
        <div>
            <div className="grid grid-cols-7 text-center mb-3">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
            </div>
            <div className="grid grid-cols-7 text-center h-[840px]">
                {
                    currentDays.map((day, index) => {
                        return (
                            <div className="border"
                                onClick={() => props.changeCurrentDay(day)} key={index}>
                                {(curdate === day.number && curmonth === day.month && curyear === day.year) ? <p className="mt-2 ml-28 rounded-full bg-sky-600 w-[25px]" >{day.number}</p> : <p className="mt-2" >{day.number}</p>}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default MonthView;