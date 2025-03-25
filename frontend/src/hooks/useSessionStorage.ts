import { useState, useEffect } from 'react';

export const useSessionStorage = (key: string, defaultValue: any = null) => {
    const [storedValue, setStoredValue] = useState(defaultValue);
    useEffect(() => {
        const item = sessionStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : defaultValue);
    }, [defaultValue, key]);

    return storedValue;
};
