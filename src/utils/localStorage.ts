function saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key: string): any | null {
    try {
        if (typeof window === 'undefined') return null; // SSR safety
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
    }
}

function removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
}

function updateLocalStorage(key: string, newData: any): void {
    saveToLocalStorage(key, newData);
}

export { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage, updateLocalStorage };
