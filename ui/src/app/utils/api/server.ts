export async function fetchDataset() {
    const target = "http://localhost:5000/dataset";

    const res = await fetch(target, {
        method: "GET"
    });

    const { data } = await res.json();
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
