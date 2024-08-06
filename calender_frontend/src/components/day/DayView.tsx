import React from "react";
import { DayProps } from "../../types/calander";

const hours: number[] = Array.from({ length: 24 }, (_, i) => i);

// const minutes: number[] = Array.from({ length: 60 }, (_, i) => i);

const DayView: React.FC<DayProps> = ({ date }) => {
    const houroftime: number = date.getHours();
    // const minutetime: number = date.getMinutes();
    return (
        <div className="flex flex-col h-full">
            <div className="ml-32">
                <p className=" text-slate-600">{date.toLocaleString('en-us', { weekday: 'short' })}</p>
                <p className="mt-1 text-2xl">{date.getDate()}</p>
            </div>
            <div className="mt-8 ml-3 ">
                {hours.map((hour, index) => (
                    <div key={index} className="w-full flex items-center p-4">
                        {Number(hour) <= 11 ?

                            <p className="text-sm font-light relative after:absolute after:h-[60px] after:w-[1px] after:bg-gray-300 after:top-0 after:-right-[10px] min-w-[50px]">{`${hour} AM`}
                            </p>


                            :
                            <p className="text-sm font-light relative after:absolute after:h-[60px] after:w-[1px] after:bg-gray-300 after:top-0 after:-right-[10px] min-w-[50px]">{`${hour} PM`}
                            </p>

                        }

                        {Number(hour) === houroftime ?
                            < div className=" h-1 border-b w-full border-red-500"></div>
                            : <div className=" h-1 border-b w-full border-gray-300"></div>
                        }

                    </div>
                ))}
            </div>
        </div >
    );
}

export default DayView;
// < div className=" h-1 border-b w-full border-red-500"></div>