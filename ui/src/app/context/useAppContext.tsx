"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

interface AppContextType {
    isGenerateModalOpen: boolean;
    setIsGenerateModalOpen: (value: boolean) => void;
    isUploadModalOpen: boolean;
    setIsUploadModalOpen: (value: boolean) => void;
    activeFiles: Array<string>;
    setActiveFiles: (value: Array<string>) => void;
    timetables: Array<string>;
    setTimetables: (value: Array<string>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function useAppContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    }

    return context;
}

interface AppContextProviderProps { 
    children: ReactNode
}

export function AppContextProvider({ children } : AppContextProviderProps) {
    const queryClient = new QueryClient();

    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [activeFiles, setActiveFiles] = useState<string[]>([]);
    const [timetables, setTimetables] = useState<string[]>([]);

    const value = {
        isGenerateModalOpen,
        setIsGenerateModalOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        activeFiles,
        setActiveFiles,
        timetables,
        setTimetables
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={value}>
                {children}
            </AppContext.Provider>
        </QueryClientProvider>
    )
}