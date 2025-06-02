import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear)



// console.log("Week Of Year", weekOfYear);

// var weekOfYear = require("dayjs/plugin/weekOfYear");

export const isCurrentDay = (day: dayjs.Dayjs)=>{
    return day.isSame(dayjs(), "day");
}
export const getMonth = (month = dayjs().month()) =>{
    const year = dayjs().year();
    const firstDayOfMonth = dayjs().set("month", month).startOf("month").day();
    let dayCounter = - firstDayOfMonth;
    
    const calenderGrid = [];

    for(let i = 0; i < 5; i++){
        const week = [];

        for(let j = 0; j < 7; j++){
            week.push(dayjs(new Date(year, month, ++dayCounter)));
        }

        calenderGrid.push(week);
    }
    return calenderGrid;
}

export const getWeekDays = (date: dayjs.Dayjs) =>{
    const startOfWeek =date.startOf("week");

    const weekDates = [];

    // loop through the 7 days of the week 
    for (let i = 0; i < 7; i++){
        const currentDate = startOfWeek.add(i, "day");
        weekDates.push({
            currentDate,
            today:
            currentDate.toDate().toDateString() === dayjs().toDate().toDateString(),
            isCurrentDay,
        })
    }

    return weekDates;
}

//Function to generate weeks of the month dynamically
export const getWeeks = (monthIndex: number) =>{
    const year = dayjs().year();
    const firstDayOfMonth = dayjs(new Date(year, monthIndex, 1)); 
    const lastDayOfMonth = dayjs(new Date(year, monthIndex +1, 0));//Last Day of the month
    
    const weeks: number[] = [];

    //loop from the first day to the last day of the month
    let currentDay = firstDayOfMonth;
    while(currentDay.isBefore(lastDayOfMonth) || currentDay.isSame(lastDayOfMonth)){
        const weekNumber = currentDay.week();

        if(!weeks.includes(weekNumber)){
            weeks.push(weekNumber);
        }
        currentDay = currentDay.add(1, "day");//move to the next day
    }

    return weeks;

}

export const getHours = Array.from({ length: 24 }, (_, i) =>
    dayjs().startOf("day").add(i, "hour"),
  );