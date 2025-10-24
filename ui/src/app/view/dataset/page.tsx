"use client";

import { useQuery } from "@tanstack/react-query"
import { fetchDataset } from "@/app/utils/api/client"

export default function Dataset() {
    const { data } = useQuery({
        queryKey: ["dataset"],
        queryFn: fetchDataset,
    })

    const { courses, instructors, sections, rooms, timeslots } = data;

    console.log(data);

    return (
        <div className="h-[calc(100vh-4.5rem)]">
            
        </div>
    )
}