"use client";

import FileIndicator from '@/app/components/FileIndicator';
import Calendar from '@/app/components/Calendar';
import useAppContext from '@/app/context/useAppContext';

export default function Home() {
  const { data } = useAppContext();

  if (!data) {
    return (
      <div className="h-screen mt-16">
        <FileIndicator/>
      </div>
    )
  }  

  const { rooms, timeslots, timetable } = data;

  return (
    <div className="h-screen mt-16">
      <Calendar rooms={rooms} timeslots={timeslots} timetable={timetable}/>
      <FileIndicator/>
    </div>
  );
}
