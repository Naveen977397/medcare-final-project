"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
    user_name: string;
    user_emailid: string;
    user_id: number;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const LoginContext = createContext<UserContextType | undefined>(
    undefined
);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    
    
    const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/v1/status", {
              credentials: "include",
              cache: "no-cache",
              headers: {
                  "Cache-Control": "no-cache, no-store, must-revalidate",
                  Pragma: "no-cache",
                },
            });
            
            const text = await res.text();
            console.log("Raw Response:", text);
            
            if (!res.ok) {
                console.log("Not authenticated, setting user to null");
                setUser(null);
                return;
            }
            
            const userData = JSON.parse(text); 
            console.log("User Data:", userData);
            
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUser();
    }, []);
    
    const logout = async () => {
        try {
            await fetch("http://localhost:5000/api/v1/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            window.location.href = "/login"
        } catch (error) {
            console.log("error in logout");
        }
    };
    
    if (isLoading) {
        return null; 
    }

    return (
        <LoginContext.Provider value={{ user, setUser, fetchUser, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context)
        throw new Error("useLogin must be used within a LoginProvider");
    return context;
};