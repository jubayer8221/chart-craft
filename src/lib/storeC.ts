import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getMonth } from "./getTime";

interface DateStoreType {
  userSelectedDate: Dayjs;
  setDate: (value: Dayjs) => void;
  twoDMonthArray: dayjs.Dayjs[][];
  selectedMonthIndex: number;
  setMonth: (index: number) => void;
}

export type CalendarEventType = {
  id: string;
  title: string;
  date: dayjs.Dayjs;
  description: string;
  guests: string;
  startTime: string;
  endTime: string;
  endDate: string;
};

type EventStore = {
  events: CalendarEventType[];
  isPopoverOpen: boolean;
  isEventSummaryOpen: boolean;
  selectedEvent: CalendarEventType | null;
  setEvents: (events: CalendarEventType[]) => void;
  openPopover: () => void;
  closePopover: () => void;
  openEventSummary: (event: CalendarEventType) => void;
  closeEventSummary: () => void;
};

interface ToggleSideBarType {
  isSideBarOpen: boolean;
  setSideBarOpen: () => void;
}

export const useDateStore = create<DateStoreType>()(
  devtools(
    persist(
      (set) => ({
        userSelectedDate: dayjs(),
        twoDMonthArray: getMonth(),
        selectedMonthIndex: dayjs().month(),
        setDate: (value: Dayjs) => {
          set({ userSelectedDate: value });
        },
        setMonth: (index) => {
          set({ twoDMonthArray: getMonth(index), selectedMonthIndex: index });
        },
      }),
      { name: "date_data", skipHydration: true },
    ),
  ),
);

export const useEventStore = create<EventStore>((set) => {
  // Load events from localStorage
  const savedEvents = localStorage.getItem("calendarEvents");
  const initialEvents = savedEvents
    ? JSON.parse(savedEvents).map((event: CalendarEventType) => ({
        ...event,
        date: dayjs(event.date),
      }))
    : [];

  return {
    events: initialEvents,
    isPopoverOpen: false,
    isEventSummaryOpen: false,
    selectedEvent: null,
    setEvents: (events) => set({ events }),
    openPopover: () => set({ isPopoverOpen: true }),
    closePopover: () => set({ isPopoverOpen: false }),
    openEventSummary: (event) =>
      set({ isEventSummaryOpen: true, selectedEvent: event }),
    closeEventSummary: () =>
      set({ isEventSummaryOpen: false, selectedEvent: null }),
  };
});

export const useToggleSideBarStore = create<ToggleSideBarType>()(
  (set, get) => ({
    isSideBarOpen: true,
    setSideBarOpen: () => {
      set({ isSideBarOpen: !get().isSideBarOpen });
    },
  }),
);