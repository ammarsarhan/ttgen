import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from utils.models import Course, Instructor, Room, Section, TimeSlot
from utils.db import SessionLocal
from utils.seed import seed
from utils.file import isAllowed

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"]) # Make sure to accept requests from the frontend link. Ideally provide this in a .env variable.

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.route('/dataset', methods=['GET'])
def dataset():
    db = SessionLocal()

    data = {
        "courses": [c.toDict() for c in db.query(Course).all()],
        "instructors": [i.toDict() for i in db.query(Instructor).all()],
        "rooms": [r.toDict() for r in db.query(Room).all()],
        "sections": [s.toDict() for s in db.query(Section).all()],
        "timeslots": [t.toDict() for t in db.query(TimeSlot).all()],
    }

    return jsonify({"message": "Fetched dataset data successfully.", "data": data})

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

if __name__ == '__main__':
    app.run(debug=True)