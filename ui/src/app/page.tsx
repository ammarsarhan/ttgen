"use client";

import { useState } from 'react';

// import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import FileIndicator from '@/app/components/FileIndicator';
import Calendar from '@/app/components/Calendar';
import { fetchTimetable, FetchTimetableResult } from '@/app/utils/api/client';

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [data, setData] = useState<FetchTimetableResult | null>(null);

  const queryClient = useQueryClient();

  const handleGenerate = async () => {
    setProgress(0);
    setLogs([]);
    setData(null);

    try {
      const result = await fetchTimetable(({ progress, log }) => {
        if (progress !== undefined) setProgress(progress);
        if (log) setLogs((prev) => [...prev, log]);
      });

      setData(result);
      queryClient.setQueryData(["home"], result);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return null;

  const { rooms, timeslots, timetable } = data;

  return (
    <div className="h-screen mt-16">
      <button className="" onClick={handleGenerate}>generate</button>
      <Calendar rooms={rooms} timeslots={timeslots} timetable={timetable}/>
      <FileIndicator/>
    </div>
  );
}
