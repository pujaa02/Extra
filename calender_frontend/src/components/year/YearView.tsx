import React from "react";
import { YearProps } from "../../types/calander";
import MonthOverview from "./MonthOverview";

const YearView: React.FC<YearProps> = ({ currentyear }) => {
    return (
        <div className="grid gap-2 grid-cols-4 ml-24">
            {Array.from({ length: 12 }, (_, month) => (
                <MonthOverview key={month} year={currentyear} month={month} />
            ))}
        </div>
    );
}

export default YearView;