import { CalendarProps, TimetableItem } from "@/app/components/Calendar";

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

export type FetchTimetableResult = CalendarProps & { message: string };

export function fetchTimetableStatus(onUpdate?: (update: { progress?: number; log?: string }) => void): Promise<FetchTimetableResult> {
    return new Promise((resolve, reject) => {
        const source = new EventSource("http://localhost:5000/generate");

        source.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "log") {
                    // Log message event
                    onUpdate?.({ log: data.message });
                }
                else if (data.type === "progress") {
                    // Progress update
                    onUpdate?.({ progress: data.progress });
                }
                else if (data.type === "done") {
                    onUpdate?.({ log: "✅ Finished generating timetable." });
                }
                else if (data.type === "complete") {
                    source.close();
                    resolve(data.data);
                }
            } catch (err) {
                console.error("Error parsing SSE event:", err);
            }
        };

        source.onerror = (err) => {
            console.error("SSE connection error:", err);
            source.close();
            reject(new Error("Failed to stream timetable generation."));
        };
    });
};

export async function saveTimetable(payload: Array<TimetableItem>) {
    const target = "http://localhost:5000/save";

    const res = await fetch(target, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json();
    return data;
};

export async function fetchSession() {
    const target = "http://localhost:5000/session";

    const res = await fetch(target, {
        method: 'GET'
    });

    const { data } = await res.json();
    return data;    
};

export async function fetchTimetable(id: string) {
    const target = `http://localhost:5000/timetable/${id}`;

    const res = await fetch(target, {
        method: 'GET'
    });

    const { data } = await res.json();
    return data;  
};
