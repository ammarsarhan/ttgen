import os
import csv
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from .db import SessionLocal
from .models import Course, Instructor, Room, Section, TimeSlot

def seed(folder: str):
    print(f"📦 Seeding database from {folder}...\n")
    db = SessionLocal()
    
    try:
        # Courses
        with open(os.path.join(folder, "Courses.csv"), newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                course = db.query(Course).filter_by(id=row["CourseID"]).first()
                if course:
                    # Update existing record
                    course.name = row["CourseName"]
                    course.credits = int(row["Credits"])
                    course.type = row["Type"]
                else:
                    course = Course(
                        id=row["CourseID"],
                        name=row["CourseName"],
                        credits=int(row["Credits"]),
                        type=row["Type"]
                    )
                    db.add(course)
                print(f"Upserted course: {row['CourseID']}")
        db.commit()

        # Instructors
        with open(os.path.join(folder, "Instructor.csv"), newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                instructor = db.query(Instructor).filter_by(id=row["InstructorID"]).first()
                if instructor:
                    instructor.name = row["Name"]
                    instructor.role = row["Role"]
                    instructor.preferredSlots = row["PreferredSlots"]
                    instructor.courses.clear()
                else:
                    instructor = Instructor(
                        id=row["InstructorID"],
                        name=row["Name"],
                        role=row["Role"],
                        preferredSlots=row["PreferredSlots"]
                    )
                    db.add(instructor)
                # Link courses
                for cid in [c.strip() for c in row["QualifiedCourses"].split(",")]:
                    course = db.query(Course).filter_by(id=cid).first()
                    if not course:
                        course = Course(id=cid, name=f"Placeholder {cid}", credits=3, type="Lecture")
                        db.add(course)
                        db.flush()
                    instructor.courses.append(course)
                print(f"Upserted instructor: {row['InstructorID']}")
        db.commit()

        # Rooms
        with open(os.path.join(folder, "Rooms.csv"), newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                room = db.query(Room).filter_by(id=row["RoomID"]).first()
                if room:
                    room.type = row["Type"]
                    room.capacity = int(row["Capacity"])
                else:
                    db.add(Room(
                        id=row["RoomID"],
                        type=row["Type"],
                        capacity=int(row["Capacity"])
                    ))
                print(f"Upserted room: {row['RoomID']}")
        db.commit()

        # Sections
        with open(os.path.join(folder, "Sections.csv"), newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                section = db.query(Section).filter_by(id=row["SectionID"]).first()
                if section:
                    section.studentCount = int(row["StudentCount"])
                    section.courses.clear()
                else:
                    section = Section(id=row["SectionID"], studentCount=int(row["StudentCount"]))
                    db.add(section)
                for cid in [c.strip() for c in row["Courses"].split(",")]:
                    course = db.query(Course).filter_by(id=cid).first()
                    if not course:
                        course = Course(id=cid, name=f"Placeholder {cid}", credits=3, type="Lecture")
                        db.add(course)
                        db.flush()
                    section.courses.append(course)
                print(f"Upserted section: {row['SectionID']}")
        db.commit()

        # TimeSlots
        with open(os.path.join(folder, "TimeSlots.csv"), newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                timeslot = db.query(TimeSlot).filter_by(id=row["TimeSlotID"]).first()
                if timeslot:
                    timeslot.day = row["Day"]
                    timeslot.startTime = row["StartTime"]
                    timeslot.endTime = row["EndTime"]
                else:
                    db.add(TimeSlot(
                        id=row["TimeSlotID"],
                        day=row["Day"],
                        startTime=row["StartTime"],
                        endTime=row["EndTime"]
                    ))
                print(f"Upserted timeslot: {row['TimeSlotID']}")
        db.commit()

        print("✅ Database seeded successfully (replaced/updated existing data).")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed("sample")
