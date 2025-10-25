"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table";

import { fetchDataset } from "@/app/utils/api/client"
import Table from "@/app/components/Table";

import { Course, Instructor, Room, Section, TimeSlot } from "@/app/utils/types";

export default function Dataset() {
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["view", "dataset"],
        queryFn: fetchDataset,
        initialData: () => queryClient.getQueryData(["view", "dataset"])
    });

    const { courses, instructors, sections, rooms, timeslots } = data;

    const coursesColumnHelper = createColumnHelper<Course>();

    const coursesColumns = [
        coursesColumnHelper.accessor("id", {
            header: "Course ID",
        }),
        coursesColumnHelper.accessor("name", {
            header: "Course Name",
        }),
        coursesColumnHelper.accessor("credits", {
            header: "Credits",
        }),
    ];

    const instructorsColumnHelper = createColumnHelper<Instructor>();

    const instructorsColumns = [
        instructorsColumnHelper.accessor("id", {
            header: "ID",
        }),
        instructorsColumnHelper.accessor("name", {
            header: "Course Name",
        }),
        instructorsColumnHelper.accessor("preferredSlots", {
            header: "Preferred Slots",
        }),
        instructorsColumnHelper.accessor("role", {
            header: "Role",
        }),
        instructorsColumnHelper.accessor("courses", {
            header: "Courses",
            cell: info => (
                <div className="truncate max-w-[200px]" title={info.getValue().map(c => c.name).join(", ")}>
                    {info.getValue().map(c => c.name).join(", ")}
                </div>
            )
        }),
    ];

    const sectionsColumnHelper = createColumnHelper<Section>();

    const sectionsColumns = [
        sectionsColumnHelper.accessor("id", {
            header: "ID",
        }),
        sectionsColumnHelper.accessor("studentCount", {
            header: "Student Count",
        }),
        sectionsColumnHelper.accessor("courses", {
            header: "Courses",
            cell: info => (
                <div className="truncate max-w-[200px]" title={info.getValue().map(c => c.name).join(", ")}>
                    {info.getValue().map(c => c.name).join(", ")}
                </div>
            )
        }),
    ];

    const roomsColumnHelper = createColumnHelper<Room>();

    const roomsColumns = [
        roomsColumnHelper.accessor("id", {
            header: "ID",
        }),
        roomsColumnHelper.accessor("capacity", {
            header: "Capacity",
        }),
        roomsColumnHelper.accessor("type", {
            header: "Type",
        }),
    ];

    const timeslotsColumnHelper = createColumnHelper<TimeSlot>();

    const timeslotsColumns = [
        timeslotsColumnHelper.accessor("day", {
            header: "Day",
        }),
        timeslotsColumnHelper.accessor("startTime", {
            header: "Start Time",
        }),
        timeslotsColumnHelper.accessor("endTime", {
            header: "End Time",
        }),
    ];

    return (
        <div className="h-[calc(100vh-4.5rem)] p-6 flex flex-col gap-y-8 mt-16">
            <Table<Course> title="Courses" description="A list of the available courses within the database." data={courses} columns={coursesColumns}/>
            <Table<Instructor> title="Instructors" description="A list of the available instructors within the database." data={instructors} columns={instructorsColumns}/>
            <Table<Section> title="Sections" description="A list of the available sections within the database." data={sections} columns={sectionsColumns}/>
            <Table<Room> title="Rooms" description="A list of the available rooms within the database." data={rooms} columns={roomsColumns}/>
            <Table<TimeSlot> title="Timeslots" description="A list of the available time slots within the database." data={timeslots} columns={timeslotsColumns}/>
        </div>
    )
}