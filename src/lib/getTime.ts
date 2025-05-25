import dayjs from "dayjs";

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

export const getHours = Array.from({ length: 24 }, (_, i) =>
    dayjs().startOf("day").add(i, "hour"),
  );