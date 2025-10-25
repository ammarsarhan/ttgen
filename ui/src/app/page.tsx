"use client";

import FileIndicator from '@/app/components/FileIndicator';
import Calendar from '@/app/components/Calendar';
import useAppContext from '@/app/context/useAppContext';

export default function Home() {
  const { data, setIsGenerateModalOpen } = useAppContext();

  if (!data) {
    return (
      <div className="h-[calc(100%-4rem)] flex flex-col items-center justify-center gap-y-1 mt-16">
        <h1 className="font-medium text-base">CSP Automated Timetable Generator</h1>
        <p className='text-gray-500 text-[0.8rem] max-w-2xl text-center'>Please use 5 files that describe the state of the courses, instructors, rooms, sections, and timeslots in either .xlsx or .csv files. The generator provides you with a set of default sample files to be used if you can not provide a valid dataset. You may save timetables generated for persistence.</p>
        <button className='my-4 px-6 py-3 bg-indigo-800 hover:bg-indigo-800/95 rounded-full flex items-center justify-center cursor-pointer' onClick={() => setIsGenerateModalOpen(true)}>
          <span className='text-xs text-white'>Generate</span>
        </button>
        <FileIndicator/>
      </div>
    )
  }  

  const { rooms, timeslots, timetable } = data;

  return (
    <div className="h-[calc(100%-4rem)] mt-16">
      <Calendar rooms={rooms} timeslots={timeslots} timetable={timetable}/>
      <FileIndicator/>
    </div>
  );
}
