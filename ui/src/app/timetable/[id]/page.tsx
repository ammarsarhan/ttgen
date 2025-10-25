"use client";

import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTimetable } from "@/app/utils/api/server";
import Calendar from "@/app/components/Calendar";

export default function Timetable() {
    const queryClient = useQueryClient();
    const params = useParams<{ id: string }>();
    const { id } = params;

    const { data } = useQuery({
        queryKey: ["timetable", id],
        queryFn: () => fetchTimetable(id),
        initialData: () => queryClient.getQueryData(["timetable", id])
    });

    const { timetable, rooms, timeslots } = data;

    return (
        <div className="h-[calc(100vh-4.5rem)] mt-16">
            <Calendar timetable={timetable.data} rooms={rooms} timeslots={timeslots}/>
        </div>
    )
}