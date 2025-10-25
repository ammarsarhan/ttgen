"use client";

import { useQuery } from '@tanstack/react-query';

import FileIndicator from '@/app/components/FileIndicator';
import Calendar from '@/app/components/Calendar';
import { fetchTimetable } from '@/app/utils/api/client';

export default function Home() {
  const { data } = useQuery({
    queryKey: ["home"],
    queryFn: fetchTimetable
  });

  if (!data) return null;

  const { timetable, rooms, timeslots } = data;

  return (
    <div className="h-screen mt-16">
      <Calendar rooms={rooms} timeslots={timeslots} timetable={timetable}/>
      <FileIndicator/>
    </div>
  );
}
