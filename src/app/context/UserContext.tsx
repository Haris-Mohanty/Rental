"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = { name?: string; role?: string } | null;

interface UserContextType {
    user: User;
    setUser: (user: User) => void;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    const refreshUser = async () => {
        try {
            const res = await fetch("/api/auth/user");
            const data = await res.json();
            if (res.ok && data.success) {
                setUser(data.data);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used inside UserProvider");
    return ctx;
};