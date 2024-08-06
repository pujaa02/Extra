/* eslint-disable @typescript-eslint/no-explicit-any */
export interface day {
    currentMonth: boolean;
    date: Date;
    month: number;
    number: number;
    selected: boolean;
    year: number;
}

export interface Props {
    curdate: Date;
    changeCurrentDay: any
}

export interface MonthProps {
    year: number;
    month: number;
}
export interface YearProps {
    currentyear: number;
}
export interface WeekProps {
    crntDateOfWeek: Date;
}

export interface WeeekDayProps {
    date: Date;
    hours: string[];
}

export interface DayProps {
    date: Date;
}
