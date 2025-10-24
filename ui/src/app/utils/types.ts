export type ClassType = "Lab" | "Lecture" | "Lecture and Lab";
export type TeacherRole = "Professor" | "Assistant Professor";
export type DayType = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export interface Course {
    id: string;
    name: string;
    type: ClassType;
    credits: number;
    sections: Array<{
        id: string;
        studentCount: number;
    }>;
};

export interface Instructor {
    id: string;
    name: string;
    preferredSlots: string;
    role: TeacherRole;
    courses: Array<{
        credits: number;
        id: string;
        name: string;
        type: ClassType;
    }>; 
};

export interface Room {
    capacity: number;
    id: string;
    type: Omit<ClassType, "Lecture and Lab">;
};

export interface Section {
    courses: Array<Omit<Course, "sections">>;
    id: string;
    studentCount: number;
};

export interface TimeSlot {
    day: DayType;
    startTime: string;
    endTime: string;
    id: string;
}
