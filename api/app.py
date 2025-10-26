import os
import json
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS

from utils.models import Course, Instructor, Room, Section, TimeSlot, Timetable
from utils.db import SessionLocal
from utils.seed import seed
from utils.file import isAllowed
from solver import generateTimetable

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"]) # Make sure to accept requests from the frontend link. Ideally provide this in a .env variable.

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.route('/session', methods=['GET'])
def session():
    db = SessionLocal()

    timetables = db.query(
        Timetable.id,
        Timetable.name,
        Timetable.createdAt
    ).all()

    data = {
        "timetables": [
            {"id": t.id, "name": t.name, "createdAt": t.createdAt}
            for t in timetables
        ]
    }

    return jsonify({"message": "Fetched timetables successfully.", "data": data})

@app.route('/dataset', methods=['GET'])
def dataset():
    db = SessionLocal()

    try:
        data = {
            "courses": [c.toDict() for c in db.query(Course).all()],
            "instructors": [i.toDict() for i in db.query(Instructor).all()],
            "rooms": [r.toDict() for r in db.query(Room).all()],
            "sections": [s.toDict() for s in db.query(Section).all()],
            "timeslots": [t.toDict() for t in db.query(TimeSlot).all()],
        }

        return jsonify({"message": "Fetched dataset data successfully.", "data": data})
    
    except Exception as e:
        print("❌ Error saving timetable:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        db.close()

@app.route('/generate', methods=['GET'])
def generate():
    print("Hit /generate endpoint. Handling generating timetable.")

    def event_stream():
        session = SessionLocal()
        timetable = None
        try:
            for event in generateTimetable():
                yield f"data: {json.dumps(event)}\n\n"

                if event.get("type") == "done":
                    timetable = event.get("data")

            # After generation completes:
            rooms = [
                {"id": r.id, "type": r.type, "capacity": r.capacity}
                for r in session.query(Room).all()
            ]
            timeslots = [
                {"day": t.day, "startTime": t.startTime, "endTime": t.endTime}
                for t in session.query(TimeSlot).all()
            ]

            data = {
                "message": "Generated timetable successfully.",
                "rooms": rooms,
                "timeslots": timeslots,
                "timetable": timetable
            }

            yield f"data: {json.dumps({'type': 'complete', 'data': data})}\n\n"

        except GeneratorExit:
            print("Client disconnected during streaming.")
        except Exception as e:
            print(f"Error in event_stream: {e}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
        finally:
            session.close()
            print("Database session closed.")

    return Response(stream_with_context(event_stream()), content_type="text/event-stream")

@app.route('/save', methods=['POST'])
def save():
    print("Hit /save endpoint. Parsing and handling saving timetable.")

    session = SessionLocal()

    try:
        payload = request.get_json()

        # If frontend sends an array of timetable items
        if isinstance(payload, list):
            name = "Untitled Timetable"
            data = payload  # Save entire list
        # If frontend sends an object with "name" and "data"
        elif isinstance(payload, dict):
            name = payload.get("name", "Untitled Timetable")
            data = payload.get("data")
        else:
            return jsonify({"error": "Invalid payload format"}), 400

        if not data:
            return jsonify({"error": "Timetable data is required"}), 400

        timetable = Timetable(name=name, data=data)
        session.add(timetable)
        session.commit()
        session.refresh(timetable)

        return jsonify({
            "message": "✅ Timetable saved successfully",
            "timetable": {
                "id": timetable.id,
                "name": timetable.name,
                "data": timetable.data,
                "createdAt": timetable.createdAt,
            },
        }), 201

    except Exception as e:
        print("❌ Error saving timetable:", e)
        session.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        session.close()

@app.route('/upload', methods=['POST'])
def upload():
    print("Hit /upload endpoint. Parsing and handling csv/xlsx upload.")

    if 'files' not in request.files:
        return jsonify({"error": "No files field in form data. Please provide a valid upload request."}), 400
    
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    files = request.files.getlist('files')

    # Validate the request.
    if not files or all(f.filename == '' for f in files):
        return jsonify({"error": "No selected files. Please provide a valid upload request."}), 400
    
    # Validate the number of files.
    if len(files) != 5:
        return jsonify({"error": "Exactly 5 files are required. Please provide a valid upload request."}), 400
    
    # Make sure all files are in the correct format.
    invalid = [f.filename for f in files if not isAllowed(f.filename)]
    if invalid:
        return jsonify({
            "error": f"Invalid file types: {', '.join(invalid)}"
        }), 400
    
    # Remove the current existing folder to overwrite data.
    for f in os.listdir(UPLOAD_DIR):
        path = os.path.join(UPLOAD_DIR, f)
        if os.path.isfile(path):
            os.remove(path)

    savedFiles = []

    for file in files:
        filename = file.filename
        savePath = os.path.join("uploads", filename)
        file.save(savePath)
        savedFiles.append(filename)

    # Seed the database with the uploaded files.
    try:
        seed(UPLOAD_DIR)
    except Exception as e:
        print(f"❌ Seeding failed: {e}")
        return jsonify({"error": str(e)}), 500

    print(f"{len(savedFiles)} files uploaded successfully.")

    return jsonify({
        "message": f"{len(savedFiles)} files uploaded successfully.",
        "files": savedFiles
    }), 200

@app.route('/timetable/<string:id>', methods=['GET'])
def fetchTimetable(id):
    print(f"Hit /timetable/id. Fetching timetable with ID: {id}.")
    db = SessionLocal()

    try:
        timetable = db.query(Timetable).filter(Timetable.id == id).first()

        if not timetable:
            return jsonify({"error": f"Timetable with id {id} not found"}), 404

        rooms = [{"id": r.id, "type": r.type, "capacity": r.capacity} for r in db.query(Room).all()]
        timeslots = [{"day": t.day, "startTime": t.startTime, "endTime": t.endTime} for t in db.query(TimeSlot).all()]

        data = {
            "timetable": {
                "id": timetable.id,
                "name": timetable.name,
                "data": timetable.data,
                "createdAt": timetable.createdAt,
            },
            "rooms": rooms,
            "timeslots": timeslots
        }

        return jsonify({
            "message": "Fetched timetable successfully",
            "data": data
        }), 200

    except Exception as e:
        print("❌ Error fetching timetable:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        db.close()

if __name__ == '__main__':
    app.run(debug=True)
