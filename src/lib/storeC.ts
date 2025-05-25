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
};

type EventStore = {
  events: CalendarEventType[];
  isPopoverOpen: boolean;
  isEventSummaryOpen: boolean;
  selectedEvent: CalendarEventType | null;
  selectedTime: string | null; // Add selectedTime to store the clicked time
  setEvents: (events: CalendarEventType[]) => void;
  openPopover: () => void;
  closePopover: () => void;
  openEventSummary: (event: CalendarEventType) => void;
  closeEventSummary: () => void;
  setSelectedTime: (time: string) => void; // Method to set selected time
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

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  isPopoverOpen: false,
  isEventSummaryOpen: false,
  selectedEvent: null,
  selectedTime: null, // Initialize selectedTime
  setEvents: (events) => set({ events }),
  openPopover: () => set({ isPopoverOpen: true }),
  closePopover: () => set({ isPopoverOpen: false }),
  openEventSummary: (event) =>
    set({ isEventSummaryOpen: true, selectedEvent: event }),
  closeEventSummary: () =>
    set({ isEventSummaryOpen: false, selectedEvent: null }),
  setSelectedTime: (time) => set({ selectedTime: time }), // Set selected time
}));

export const useToggleSideBarStore = create<ToggleSideBarType>()(
  (set, get) => ({
    isSideBarOpen: true,
    setSideBarOpen: () => {
      set({ isSideBarOpen: !get().isSideBarOpen });
    },
  }),
);