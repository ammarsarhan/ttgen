import uuid
from sqlalchemy import Column, Integer, String, Enum, Table, ForeignKey, JSON, DateTime, func
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.inspection import inspect
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

# Extend Base class to add toDict function
class BaseMixin:
    def toDict(self, include_relationships: bool = True, _visited: set = None):
        if _visited is None:
            _visited = set()

        # Identify object by (class, PK tuple) to avoid revisiting
        pk_vals = tuple(getattr(self, col.key) for col in inspect(self.__class__).primary_key)
        identity = (self.__class__, pk_vals)
        
        if identity in _visited:
            # Return primary key reference if already visited
            return {"_ref": {c.name: getattr(self, c.name) for c in inspect(self.__class__).primary_key}}

        _visited.add(identity)

        mapper = inspect(self.__class__)
        result = {}

        # columns
        for column in mapper.columns:
            result[column.key] = getattr(self, column.key)

        # relationships
        if include_relationships:
            for rel_name, relation in mapper.relationships.items():
                val = getattr(self, rel_name)
                if val is None:
                    result[rel_name] = None
                elif relation.uselist:
                    result[rel_name] = [
                        v.toDict(include_relationships=False, _visited=_visited) if hasattr(v, "toDict") else None
                        for v in val
                    ]
                else:
                    result[rel_name] = (
                        val.toDict(include_relationships=False, _visited=_visited)
                        if hasattr(val, "toDict")
                        else None
                    )

        return result

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

class Course(Base, BaseMixin):
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


class Instructor(Base, BaseMixin):
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

class Room(Base, BaseMixin):
    __tablename__ = "rooms"

    TypeEnum = Enum("Lecture", "Lab", name="room_type_enum")

    id = Column(String, primary_key=True)
    type = Column(TypeEnum, nullable=False)
    capacity = Column(Integer, nullable=False)

class Section(Base, BaseMixin):
    __tablename__ = "sections"

    id = Column(String, primary_key=True)
    studentCount = Column(Integer, nullable=False)
    
    courses = relationship(
        "Course",
        secondary=sectionCourse,
        back_populates="sections",
        cascade="all, delete"
    )

class TimeSlot(Base, BaseMixin):
    __tablename__ = "time_slots"

    DayEnum = Enum("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", name="day_enum")
    StartTimeEnum = Enum("9:00 AM", "10:45 AM", "12:30 PM", "2:15 PM", name="start_time_enum")
    EndTimeEnum = Enum("10:30 AM", "12:15 PM", "2:00 PM", "3:45 PM", name="end_time_enum")

    id = Column(String, primary_key=True)
    day = Column(DayEnum, nullable=False)
    startTime = Column(StartTimeEnum, nullable=False)
    endTime = Column(EndTimeEnum, nullable=False)

class Timetable(Base, BaseMixin):
    __tablename__ = "timetables"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    data = Column(JSON, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
