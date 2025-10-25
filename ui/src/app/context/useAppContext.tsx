"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { FetchTimetableResult, fetchTimetableStatus } from "@/app/utils/api/client";

interface AppContextType {
    isGenerateModalOpen: boolean;
    setIsGenerateModalOpen: (value: boolean) => void;
    isUploadModalOpen: boolean;
    setIsUploadModalOpen: (value: boolean) => void;
    activeFiles: Array<string>;
    setActiveFiles: (value: Array<string>) => void;
    timetables: Array<string>;
    setTimetables: (value: Array<string>) => void;
    generateTimetable: (onComplete?: () => void) => void;
    data: FetchTimetableResult | null;
    setData: (value: FetchTimetableResult | null) => void;
    progress: number;
    setProgress: (value: number) => void;
    logs: string[];
    setLogs: (value: Array<string>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export default function useAppContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    };

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

    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [data, setData] = useState<FetchTimetableResult | null>(null);

    const generateTimetable = async (onComplete?: () => void) => {
        setProgress(0);
        setLogs([]);
        setData(null);

        try {
            const result = await fetchTimetableStatus(({ progress, log }) => {
                if (progress !== undefined) setProgress(progress);
                if (log) setLogs((prev) => [...prev, log]);
            });

            setData(result);
            queryClient.setQueryData(["home"], result);

            if (onComplete) onComplete();
        } catch (err) {
            console.error(err);
        }
    };

    const value = {
        isGenerateModalOpen,
        setIsGenerateModalOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        activeFiles,
        setActiveFiles,
        timetables,
        setTimetables,
        generateTimetable,
        data,
        setData,
        logs,
        setLogs,
        progress,
        setProgress
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={value}>
                {children}
            </AppContext.Provider>
        </QueryClientProvider>
    )
}