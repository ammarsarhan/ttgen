"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface AppContextType {
    isGenerateModalOpen: boolean;
    setIsGenerateModalOpen: (value: boolean) => void;
    isUploadModalOpen: boolean;
    setIsUploadModalOpen: (value: boolean) => void;
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
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const value = {
        isGenerateModalOpen,
        setIsGenerateModalOpen,
        isUploadModalOpen,
        setIsUploadModalOpen
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}