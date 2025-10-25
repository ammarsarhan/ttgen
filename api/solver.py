from utils.models import Section, Course, Instructor, Room, TimeSlot
from utils.db import SessionLocal

def generateTimetable():
    session = SessionLocal()

    # Build variables
    variables = []
    for section in session.query(Section).all():
        for course in section.courses:
            variables.append((section.id, course.id))

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
                for instructor in course.instructors:  # only qualified instructors
                    valid_combinations.append((ts.id, room.id, instructor.id))

        domains[var] = valid_combinations

    # Validity check
    def is_assignment_valid(value, assignment):
        time_slot_id, room_id, instructor_id = value
        for _, assigned_value in assignment.items():
            assigned_time, assigned_room, assigned_instructor = assigned_value
            if assigned_time == time_slot_id:
                if assigned_room == room_id:
                    return False  # room conflict
                if assigned_instructor == instructor_id:
                    return False  # instructor conflict
        return True

    # Backtracking CSP solver
    def backtrack(assignment, variables, domains):
        if len(assignment) == len(variables):
            return assignment

        var = next(v for v in variables if v not in assignment)
        for value in domains[var]:
            if is_assignment_valid(value, assignment):
                assignment[var] = value
                result = backtrack(assignment, variables, domains)
                if result:
                    return result
                del assignment[var]  # backtrack

        return None

    # Generate timetable
    assignment = backtrack({}, variables, domains)
    if not assignment:
        return {"error": "No valid timetable found!"}

    # Convert assignment to JSON-friendly structure
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
