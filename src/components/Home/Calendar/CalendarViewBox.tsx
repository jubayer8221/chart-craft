import dayjs from 'dayjs';

const CalendarViewBox = ({ day, indexRow }: { day: dayjs.Dayjs | null; indexRow: number }) => {
  const isFirstDayOfMonth = day?.date() === 1;
  const isToday = day?.format('DD-MM-YY') === dayjs().format('DD-MM-YY');

  return (
    <div className="flex flex-col items-center gap-y-2 border dark:border-[#897c8f] h-32">
      <div className="flex flex-col items-center w-full">
        {indexRow === 0 && (
          <h4
            className="w-full text-center pb-1 border-b dark:border-[#897c8f] font-bold"
          >
            {day?.format('ddd')}
          </h4>
        )}
        <h4
          className={`${
            isToday
              ? 'w-7 h-7 bg-[#463f59] text-white dark:text-black rounded-full flex items-center justify-center p-2'
              : ''
          }`} 
        >
          {isFirstDayOfMonth ? day?.format('MMM DD') : day?.format('DD')}
        </h4>
      </div>
    </div>
  );
};

export default CalendarViewBox;