from utils.models import Section, Course, Instructor, Room, TimeSlot
from utils.db import SessionLocal

session = SessionLocal()

variables = []
for section in session.query(Section).all():
    for course in section.courses:
        # You can expand for multiple lectures per week here
        variables.append((section.id, course.id))

domains = {}
for var in variables:
    section_id, course_id = var
    section = session.get(Section, section_id)
    course = session.get(Course, course_id)

    valid_combinations = []
    for ts in session.query(TimeSlot).all():
        for room in session.query(Room).filter(Room.type == course.type).all():
            for instructor in course.instructors:  # only instructors qualified
                valid_combinations.append((ts.id, room.id, instructor.id))
    domains[var] = valid_combinations

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

def backtrack(assignment, variables, domains):
    if len(assignment) == len(variables):
        return assignment

    var = next(v for v in variables if v not in assignment)
    for value in domains[var]:
        if is_assignment_valid(var, value, assignment):
            assignment[var] = value
            result = backtrack(assignment, variables, domains)
            if result:
                return result
            del assignment[var]  # backtrack

    return None

if __name__ == "__main__":
    assignment = backtrack({}, variables, domains)
    if not assignment:
        print("No valid timetable found!")
    else:
        print("✅ Timetable generated:\n")
        for (section_id, course_id), (ts_id, room_id, instructor_id) in assignment.items():
            section = session.get(Section, section_id)
            course = session.get(Course, course_id)
            ts = session.get(TimeSlot, ts_id)
            room = session.get(Room, room_id)
            instructor = session.get(Instructor, instructor_id)

            print(
                f"Section: {section_id}, Course: {course.name}, "
                f"Time: {ts.day} {ts.startTime}-{ts.endTime}, "
                f"Room: {room.id}, Instructor: {instructor.name}"
            )
