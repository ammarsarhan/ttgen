import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.file import allowedFile

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"]) # Make sure to accept requests from the frontend link. Ideally provide this in a .env variable.

UPLOAD_DIR = "data"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload():
    print("Hit /upload endpoint. Parsing and handling csv/xlsx upload.")

    if 'files' not in request.files:
        return jsonify({"error": "No files field in form data. Please provide a valid upload request."}), 400
    
    folder = "uploads"
    os.makedirs(folder, exist_ok=True)

    files = request.files.getlist('files')

    # Validate the request.
    if not files or all(f.filename == '' for f in files):
        return jsonify({"error": "No selected files. Please provide a valid upload request."}), 400
    
    # Validate the number of files.
    if len(files) != 5:
        return jsonify({"error": "Exactly 5 files are required. Please provide a valid upload request."}), 400
    
    # Make sure all files are in the correct format.
    invalid = [f.filename for f in files if not allowedFile(f.filename)]
    if invalid:
        return jsonify({
            "error": f"Invalid file types: {', '.join(invalid)}"
        }), 400
    
    # Remove the current existing folder to overwrite data.
    for f in os.listdir(folder):
        path = os.path.join(folder, f)
        if os.path.isfile(path):
            os.remove(path)

    savedFiles = []

    for file in files:
        filename = file.filename
        savePath = os.path.join("uploads", filename)
        file.save(savePath)
        savedFiles.append(filename)

    print(f"{len(savedFiles)} files uploaded successfully.")

    return jsonify({
        "message": f"{len(savedFiles)} files uploaded successfully.",
        "files": savedFiles
    }), 200

if __name__ == '__main__':
    app.run(debug=True)