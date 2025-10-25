export async function uploadFiles(files: FormData) {
    const target = "http://localhost:5000/upload";

    const res = await fetch(target, {
        method: "POST",
        body: files, // Browser will automatically handle resolving the request type
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed. Please try again later.");
    };

    const data = await res.json();
    return data;
};

export async function fetchDataset() {
    const target = "http://localhost:5000/dataset";

    const res = await fetch(target, {
        method: "GET"
    });

    const { data } = await res.json();
    return data;
};

export async function fetchTimetable() {
    const target = "http://localhost:5000/generate";

    const res = await fetch(target, {
        method: "GET"
    });

    const { data } = await res.json();
    return data;
}
