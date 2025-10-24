import os
import csv
from utils.db import engine, SessionLocal
from models import Base, Course, Instructor, Room, Section, TimeSlot

def seed(folder: str):
    print(f"📦 Seeding database from {folder}...\n")

    # Drop & recreate all tables first
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    db = SessionLocal()

    try:
        # --- Courses ---
        with open(os.path.join(folder, "Courses.csv"), newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not db.query(Course).filter_by(id=row["CourseID"]).first():
                    db.add(Course(
                        id=row["CourseID"],
                        name=row["CourseName"],
                        credits=int(row["Credits"]),
                        type=row["Type"]
                    ))
        db.commit()

        # --- Instructors ---
        with open(os.path.join(folder, "Instructor.csv"), newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                instructor = Instructor(
                    id=row["InstructorID"],
                    name=row["Name"],
                    role=row["Role"],
                    preferredSlots=row["PreferredSlots"]
                )
                db.add(instructor)

                for cid in [c.strip() for c in row["QualifiedCourses"].split(",")]:
                    course = db.query(Course).filter_by(id=cid).first()
                    if not course:
                        course = Course(id=cid, name=f"Placeholder {cid}", credits=3, type="Lecture")
                        db.add(course)
                        db.flush()  # Ensures course.id is ready before linking
                    instructor.courses.append(course)
        db.commit()

        # --- Rooms ---
        with open(os.path.join(folder, "Rooms.csv"), newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not db.query(Room).filter_by(id=row["RoomID"]).first():
                    db.add(Room(
                        id=row["RoomID"],
                        type=row["Type"],
                        capacity=int(row["Capacity"])
                    ))
        db.commit()

        # --- Sections ---
        with open(os.path.join(folder, "Sections.csv"), newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                section = Section(id=row["SectionID"], studentCount=int(row["StudentCount"]))
                db.add(section)
                for cid in [c.strip() for c in row["Courses"].split(",")]:
                    course = db.query(Course).filter_by(id=cid).first()
                    if not course:
                        course = Course(id=cid, name=f"Placeholder {cid}", credits=3, type="Lecture")
                        db.add(course)
                        db.flush()
                    section.courses.append(course)
        db.commit()

        # --- TimeSlots ---
        with open(os.path.join(folder, "TimeSlots.csv"), newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if not db.query(TimeSlot).filter_by(id=row["TimeSlotID"]).first():
                    db.add(TimeSlot(
                        id=row["TimeSlotID"],
                        day=row["Day"],
                        startTime=row["StartTime"],
                        endTime=row["EndTime"]
                    ))
        db.commit()

        print("✅ Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise e
    finally:
        db.close()
