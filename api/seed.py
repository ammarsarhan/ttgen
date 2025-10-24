import os
import csv
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from models import Base, Course, Instructor, Room, Section, TimeSlot

# Load environment variables
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

# Connect to Postgres
engine = create_engine(f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

# Create tables (if not exist)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# Test connection
with engine.connect() as conn:
    result = conn.execute(text("SELECT NOW()"))
    print("✅ Connected to database at:", result.scalar())

print("\n📦 Seeding database...\n")

# Clear all of the data in the database
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

# Courses
with open("data/Courses.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        course = Course(
            id = row["CourseID"],
            name = row["CourseName"],
            credits = int(row["Credits"]),
            type = row["Type"]
        )
        print(f"Adding course {course.id}")
        session.add(course)

session.commit()

# Instructors
with open("data/Instructor.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        id = row["InstructorID"]
        name = row["Name"]
        role = row["Role"]
        preferredSlots = row["PreferredSlots"]
        courseIDs = [cid.strip() for cid in row["QualifiedCourses"].split(",")]

        instructor = Instructor(id=id, name=name, role=role, preferredSlots=preferredSlots)
        print(f"Adding instructor {instructor.id}")
        session.add(instructor)
        
        # Link course
        for cid in courseIDs:
            course = session.query(Course).filter_by(id = cid).first()
            if not course:
                print(f"Could not find course {cid}. Creating course with placeholder data...")
                # Create placeholder if course not found
                course = Course(id=cid, name=f"Placeholder {cid}", credits=3, type="Lecture")
                print(f"Adding course {course.id}")
                session.add(course)
            instructor.courses.append(course)

session.commit()

# Rooms
with open("data/Rooms.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        room = Room(
            id = row["RoomID"],
            type = row["Type"],
            capacity = int(row["Capacity"])
        )
        print(f"Adding room {room.id}")
        session.add(room)

session.commit()

# Sections
with open("data/Sections.csv", newline="", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    for row in reader:
        id = row["SectionID"]
        studentCount = int(row["StudentCount"])
        courseIDs = [c.strip() for c in row["Courses"].split(",")]

        section = Section(id=id, studentCount=studentCount)
        print(f"Adding section {section.id}")
        session.add(section)

        for cid in courseIDs:
            course = session.query(Course).filter_by(id=cid).first()
            if not course:
                # Create placeholder if course not found
                course = Course(id=cid, name=f"Placeholder {cid}", credits=3, type="Lecture")
                print(f"Adding course {course.id}")
                session.add(course)
            section.courses.append(course)

session.commit()

# Time Slots
with open("data/TimeSlots.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        timeSlot = TimeSlot(
            id = row["TimeSlotID"],
            day = row["Day"],
            startTime = row["StartTime"],
            endTime = row["EndTime"],
        )
        print(f"Adding time slot {timeSlot.id}")
        session.add(timeSlot)

# Commit and close
session.commit()
session.close()

print("✅ Database seeded successfully!")
