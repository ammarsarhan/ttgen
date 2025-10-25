import { DayType, Room, TimeSlot } from "@/app/utils/types"

interface TimetableItem {
    course: string;
    instructor: string;
    room: string;
    section: string;
    timeslot: {
        day: DayType,
        startTime: string,
        endTime: string
    };
};

interface CalendarProps {
    rooms: Array<Room>
    timeslots: Array<TimeSlot>,
    timetable: Array<TimetableItem>
};

export default function Calendar({ rooms, timeslots, timetable } : CalendarProps) {
    const timeslotsMap = new Map<string, TimeSlot>();

    timetable.forEach((item, idx) => {
        const { day, startTime, endTime } = item.timeslot;
        const key = `${day}-${startTime}-${endTime}`;

        if (!timeslotsMap.has(key)) {
            timeslotsMap.set(key, {
                id: `ts-${idx}`,
                day: day as DayType,
                startTime,
                endTime,
            });
        };
    });

    const timetableMap = new Map<string, TimetableItem>();

    timetable.forEach((entry) => {
        const { day, startTime, endTime } = entry.timeslot;
        const key = `${entry.room}-${day}-${startTime}–${endTime}`;
        timetableMap.set(key, entry);
    });

    const grouped = timeslots.reduce((acc, slot) => {
        if (!acc[slot.day]) {
            acc[slot.day] = { day: slot.day, intervals: [] };
        }

        acc[slot.day].intervals.push({ startTime: slot.startTime, endTime: slot.endTime });
        return acc;
    }, {} as Record<DayType, { day: DayType; intervals: { startTime: string, endTime: string }[] }>);

    const days: Array<{ day: DayType; intervals: { startTime: string, endTime: string }[] }> = Object.values(grouped);

    return (
        <div className="relative w-full h-full text-sm border-gray-200">
            <div className="absolute top-0 left-0 w-60 border-r border-gray-200">
                <div className="grid grid-cols-3 w-full h-20 text-center border-b border-gray-200 gap-y-2 bg-gray-100">
                    <span className="border-r border-gray-200 p-1 flex items-center justify-center">Room ID</span>
                    <span className="border-r border-gray-200 p-1 flex items-center justify-center">Room Type</span>
                    <span className="p-1 flex items-center justify-center">Room Capacity</span>
                </div>
                {
                    rooms.map(room => {
                        return (
                            <div key={room.id} className="grid grid-cols-3 w-full text-[0.8rem] text-center border-b border-gray-200 gap-y-2 h-8">
                                <span className="border-r border-gray-200 p-1 flex items-center justify-center">{room.id}</span>
                                <span className="border-r border-gray-200 p-1 flex items-center justify-center">{room.type}</span>
                                <span className="p-1 flex items-center justify-center">{room.capacity}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className="absolute top-0 right-0 w-[calc(100%-15rem)] flex overflow-x-scroll">
                {
                    days.map((item, index) => {
                        return (
                            <div key={index} className="flex flex-col w-full h-20 text-center border-b border-r border-gray-200 bg-gray-100 shrink-0">
                                <div className="w-full border-b border-gray-200 h-10">
                                    <span className="flex h-full items-center justify-center">
                                        {item.day}
                                    </span>
                                </div>
                                <div className="w-full grid grid-cols-4 border-gray-200 h-10 text-[0.8rem]">
                                    {
                                        item.intervals.map((interval, i) => {
                                            return (
                                                <span key={i} className="flex h-full items-center justify-center border-r border-gray-200 last:border-0">
                                                    {interval.startTime} - {interval.endTime}
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}