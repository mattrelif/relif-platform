function saveToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key: string): any | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

function removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
}

function updateLocalStorage(key: string, newData: any) {
    saveToLocalStorage(key, newData);
}

export { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage, updateLocalStorage };

