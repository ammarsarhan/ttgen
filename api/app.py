from flask import Flask, request, jsonify
import os

app = Flask(__name__)

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

    if not files or all(f.filename == '' for f in files):
        return jsonify({"error": "No selected files. Please provide a valid upload request."}), 400

    savedFiles = []

    for file in files:
        filename = file.filename
        savePath = os.path.join("uploads", filename)
        file.save(savePath)
        savedFiles.append(filename)

    return jsonify({
        "message": f"{len(savedFiles)} files uploaded successfully",
        "files": savedFiles
    }), 200

if __name__ == '__main__':
    app.run(debug=True)