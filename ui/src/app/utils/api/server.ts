export async function fetchDataset() {
    const target = "http://localhost:5000/dataset";

    const res = await fetch(target, {
        method: "GET"
    });

    const { data } = await res.json();
    return data;
};
