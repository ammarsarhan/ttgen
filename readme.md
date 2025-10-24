# 🧠 Automated Timetable Generator (CSP Project)

## 📘 Overview

**Automated Timetable Generator** is a full-stack system that models timetable generation as a **Constraint Satisfaction Problem (CSP)**.  
It dynamically generates valid university schedules using **Python (Flask)** for the backend and **Next.js + React Query** for the frontend.

This system can:
- Read timetable data (from Excel or a database)
- Automatically assign time slots, rooms, and instructors using a **CSP backtracking solver**
- Store generated timetables in a **PostgreSQL** database for history tracking
- Allow users to **view, update, and regenerate** timetables through a **modern Next.js dashboard**

---

## 🧩 System Architecture


- **Frontend**: Interactive UI for uploading data, generating timetables, and viewing history.
- **Backend**: Flask API implementing CSP solver logic, file parsing, and persistence.
- **Database**: Stores courses, instructors, rooms, sections, timeslots, and generated timetables.

---

## 🎯 Features

### ✅ Core Features
- Upload Excel/CSV file with department data
- Automatically generate a feasible timetable
- Store and retrieve previous generations (history)
- View, edit, and re-run generation with updated constraints

### 💡 Advanced Features (Planned)
- Visual timetable UI
- Support for soft constraint optimization
- Integration with Google OR-Tools or genetic algorithms
- Authentication & role-based access

---

## 🧠 CSP Model

### Variables
Each variable = a lecture to schedule → `(CourseID, SectionID)`

### Domains
Each variable’s possible values = combinations of:
- Available `timeslots`
- Suitable `rooms`
- Qualified `instructors`

### Hard Constraints
1. No instructor can teach two classes at the same time.
2. No room can host more than one class at the same time.
3. Room type must match course type (Lab/Lecture).
4. Each course section must meet its required weekly lectures.

### Soft Constraints (optional)
1. Avoid timetable gaps.
2. Avoid early morning or late evening slots.
3. Avoid consecutive distant classes for the same instructor.
4. Distribute lectures evenly across the week.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Next.js 15 (React 19, React Query, TailwindCSS) |
| Backend | Flask (Python 3.12) |
| Database | PostgreSQL + SQLAlchemy ORM |
| CSP Engine | Custom Backtracking Solver |
| Deployment | Docker Compose |
| File Upload | Flask Uploads / REST API |

---

## 🚀 Quick Start

### 1- Clone & Setup

```bash
git clone https://github.com/ammarsarhan/ttgen.git
cd ttgen

cd api
pip install -r requirements.txt
python seed.py   # Optional: seed sample data
flask run

cd ui
npm install
npm run dev
```

### 2- Basic Usage


### 3- Project Layout
Frontend Overview

/ui built with:

Next.js App Router
React Query for caching + data fetching
TailwindCSS

Backend Overview
| File | Description |
|------|-------------|
| app.py | Flask app & route definitions |
| models.py	| SQLAlchemy ORM models |
| solver.py | Backtracking CSP solver logic |
| routes/timetable.py | Routes for generation, history, etc. |
| utils | Miscellaneous utility functions |
| seed.py | Populates database with initial test data |

---

API Documentation
| Endpoint | Method | Description |
|----------|--------|-------------|
| /upload | POST | Upload Excel/CSV file to populate the database |
| /generate | POST | Run the CSP solver to create a timetable |
| /history | GET | Fetch all previously generated timetables |
| /history/<id> | GET | Get a single timetable by ID |
| /timetable/latest | GET | Fetch the most recent generated timetable |
| /courses | GET | List all courses |
| /sections | GET | List all sections |
| /rooms | GET | List all rooms |
| /instructors | GET | List all instructors |
| /timeslots | GET | List all time slots |

---

Database Schema
| Table | Description |
|-------|-------------|
| courses | CourseID, CourseName, Type, Credits |
| instructors | InstructorID, Name, QualifiedCourses, PreferredSlots |
| rooms | RoomID, Type, Capacity |
| sections | SectionID, Semester, StudentCount |
| timeslots | Day, StartTime, EndTime |
| timetables | ID, CreatedAt, Metadata |
| assignments | TimetableID, CourseID, SectionID, RoomID, InstructorID, TimeSlotID |

---

### 4- Evaluation Metrics
| Metric | Description |
|--------|-------------|
| violations | Number of hard constraint violations |
| runtime | Time taken to generate timetable |
| soft_score | (optional) measure of preference satisfaction |

---

📈 Future Work

Add visual timetable grid UI
Introduce soft constraint optimization scoring
Use OR-Tools for faster solving
Enable multi-department scheduling
Add user authentication and roles (admin, instructor, student)

🧑‍💻 Author

Ammar Sarhan
CSIT Department, E-JUST – Fall 2025/2026
Alexandria, Egypt
