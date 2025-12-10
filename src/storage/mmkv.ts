import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV()

export const zustandStorage = {
    getItem: (name: string) => {
        const value = storage.getString(name);
        return value ? JSON.parse(value) : null;
    },
    setItem: (name: string, value: any) => {
        storage.set(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
        storage.remove(name);
    },
};
