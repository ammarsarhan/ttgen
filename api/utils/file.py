import os

ALLOWED_EXTENSIONS = {".csv", ".xlsx"}

def isAllowed(filename: str) -> bool:
    _, ext = os.path.splitext(filename.lower())
    return ext in ALLOWED_EXTENSIONS