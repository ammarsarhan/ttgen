from utils.models import Section, Course, Instructor, Room, TimeSlot
from utils.db import SessionLocal
import time

def generateTimetable():
    session = SessionLocal()

    # Build variables
    variables = []
    for section in session.query(Section).all():
        for course in section.courses:
            variables.append((section.id, course.id))
    yield {"type": "log", "message": f"📦 Loaded {len(variables)} section-course pairs."}

    # Build domains
    domains = {}
    for var in variables:
        section_id, course_id = var
        section = session.get(Section, section_id)
        course = session.get(Course, course_id)

        valid_combinations = []
        for ts in session.query(TimeSlot).all():
            if course.type == "Lecture and Lab":
                room_types = ["Lecture", "Lab"]
            else:
                room_types = [course.type]

            for room in session.query(Room).filter(Room.type.in_(room_types)).all():
                for instructor in course.instructors:
                    valid_combinations.append((ts.id, room.id, instructor.id))

        domains[var] = valid_combinations

    yield {"type": "log", "message": "✅ Domains built successfully."}

    # Validity check
    def is_assignment_valid(value, assignment):
        time_slot_id, room_id, instructor_id = value
        for _, assigned_value in assignment.items():
            assigned_time, assigned_room, assigned_instructor = assigned_value
            if assigned_time == time_slot_id:
                if assigned_room == room_id:
                    return False
                if assigned_instructor == instructor_id:
                    return False
        return True

    total_vars = len(variables)
    progress = 0

    # Backtracking CSP solver (instrumented)
    def backtrack(assignment, depth=0):
        nonlocal progress

        if len(assignment) == total_vars:
            yield {"type": "log", "message": "🎉 All variables assigned successfully!"}
            yield {"type": "progress", "progress": 100}
            yield {"type": "done", "data": format_timetable(assignment)}
            return

        var = next(v for v in variables if v not in assignment)
        section_id, course_id = var
        section = session.get(Section, section_id)
        course = session.get(Course, course_id)

        for value in domains[var]:
            ts_id, room_id, instructor_id = value
            ts = session.get(TimeSlot, ts_id)
            room = session.get(Room, room_id)
            instructor = session.get(Instructor, instructor_id)

            yield {"type": "log", "message": f"⏳ Trying {section.id} - {course.name} in {room.id} at {ts.startTime} for {instructor.name}."}

            if is_assignment_valid(value, assignment):
                assignment[var] = value
                progress = int((len(assignment) / total_vars) * 100)
                yield {"type": "progress", "progress": progress}

                yield from backtrack(assignment, depth + 1)
                if len(assignment) == total_vars:
                    return

                # Backtrack
                yield {"type": "log", "message": f"↩️ Backtracking {section.id} - {course.name}."}
                del assignment[var]

    # Helper: format final assignment
    def format_timetable(assignment):
        timetable = []
        for (section_id, course_id), (ts_id, room_id, instructor_id) in assignment.items():
            section = session.get(Section, section_id)
            course = session.get(Course, course_id)
            ts = session.get(TimeSlot, ts_id)
            room = session.get(Room, room_id)
            instructor = session.get(Instructor, instructor_id)

            timetable.append({
                "section": getattr(section, "name", f"Section {section.id}"),
                "course": getattr(course, "name", f"Course {course.id}"),
                "timeslot": {
                    "day": ts.day,
                    "startTime": ts.startTime,
                    "endTime": ts.endTime
                },
                "room": getattr(room, "name", f"Room {room.id}"),
                "instructor": getattr(instructor, "name", f"Instructor {instructor.id}")
            })
        return timetable

    # Start solving
    yield from backtrack({})
