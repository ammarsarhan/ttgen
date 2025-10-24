from sqlalchemy import Column, Integer, String, Enum, Table, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

instructorCourse = Table(
    "instructor_course",
    Base.metadata,
    Column("instructor_id", String, ForeignKey("instructors.id"), primary_key=True),
    Column("course_id", String, ForeignKey("courses.id"), primary_key=True)
)

sectionCourse = Table(
    "section_course",
    Base.metadata,
    Column("section_id", String, ForeignKey("sections.id"), primary_key=True),
    Column("course_id", String, ForeignKey("courses.id"), primary_key=True)
)

class Course(Base):
    __tablename__ = "courses"

    TypeEnum = Enum("Lecture", "Lecture and Lab", "Lab", name="course_type_enum")

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    credits = Column(Integer, nullable=False)
    type = Column(TypeEnum, nullable=False)

    instructors = relationship(
        "Instructor",
        secondary=instructorCourse,
        back_populates="courses",
        cascade="all, delete"
    )

    sections = relationship(
        "Section",
        secondary=sectionCourse,
        back_populates="courses",
        cascade="all, delete"
    )


class Instructor(Base):
    __tablename__ = "instructors"

    RoleEnum = Enum(
        "Professor", 
        "Assistant Professor", 
        name="instructor_role_enum"
    )

    PreferredSlotsEnum = Enum(
        "Any time",
        "Not on Sunday",
        "Not on Monday",
        "Not on Tuesday",
        "Not on Wednesday",
        "Not on Thursday",
        "Not on Friday",
        name="preferred_slots_enum"
    )

    id = Column(String, primary_key=True)
    name = Column(String, nullable=True)
    role = Column(RoleEnum, nullable=False)
    preferredSlots = Column(PreferredSlotsEnum, nullable=False)

    courses = relationship(
        "Course",
        secondary=instructorCourse,
        back_populates="instructors",
        cascade="all, delete"
    )

class Room(Base):
    __tablename__ = "rooms"

    TypeEnum = Enum("Lecture", "Lab", name="room_type_enum")

    id = Column(String, primary_key=True)
    type = Column(TypeEnum, nullable=False)
    capacity = Column(Integer, nullable=False)

class Section(Base):
    __tablename__ = "sections"

    id = Column(String, primary_key=True)
    studentCount = Column(Integer, nullable=False)
    
    courses = relationship(
        "Course",
        secondary=sectionCourse,
        back_populates="sections",
        cascade="all, delete"
    )

class TimeSlot(Base):
    __tablename__ = "time_slots"

    DayEnum = Enum("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", name="day_enum")
    StartTimeEnum = Enum("9:00 AM", "10:45 AM", "12:30 PM", "2:15 PM", name="start_time_enum")
    EndTimeEnum = Enum("10:30 AM", "12:15 PM", "2:00 PM", "3:45 PM", name="end_time_enum")

    id = Column(String, primary_key=True)
    day = Column(DayEnum, nullable=False)
    startTime = Column(StartTimeEnum, nullable=False)
    endTime = Column(EndTimeEnum, nullable=False)
