function saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key: string): any | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

function removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
}

function updateLocalStorage(key: string, newData: any): void {
    saveToLocalStorage(key, newData);
}

export { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage, updateLocalStorage };
