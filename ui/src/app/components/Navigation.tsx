"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import useAppContext from "@/app/context/useAppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveTimetable } from "@/app/utils/api/client";

export default function Navigation() {
    const { data, activeFiles } = useAppContext();
    const queryClient = useQueryClient();
    const pathname = usePathname();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [lastSavedData, setLastSavedData] = useState<any>(null);
    const isSaved = lastSavedData && data?.timetable
        ? JSON.stringify(lastSavedData) === JSON.stringify(data.timetable)
        : false;

    const isPopulated = Boolean(data);

    const mutation = useMutation({
        mutationFn: saveTimetable,
        mutationKey: ["session"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            setLastSavedData(data?.timetable);
        }
    });

    const handleSaveTimetable = () => {
        if (data) {
            mutation.mutate(data.timetable);
        }
    };

    const isTimetableRoute = pathname.startsWith("/timetable/");
    const isDisabled = !isPopulated || isSaved || isTimetableRoute;

    return (
        <nav className="fixed w-[calc(100%-18rem)] bg-white flex items-center justify-between h-16 border-b border-gray-200 z-50 px-4">
            <div className="text-gray-500 text-xs">
                {activeFiles.length > 0 ? (
                    <ul>
                        {activeFiles.map((file, index) => (
                            <span
                                className="text-gray-500 mr-1.5 last:mr-0"
                                key={index}
                            >
                                {index + 1}) {file}
                            </span>
                        ))}
                    </ul>
                ) : (
                    <p>
                        You do not have any active files scheduled for generation yet. <br />
                        Please upload files or else fallback sample files will be used instead.
                    </p>
                )}
            </div>

            <button
                className={`
                    px-4 py-2 rounded-md transition-colors text-xs text-nowrap
                    ${
                        isDisabled
                            ? "cursor-not-allowed border border-gray-200"
                            : "cursor-pointer text-white bg-indigo-800 hover:bg-indigo-800/90"
                    }
                `}
                disabled={isDisabled}
                onClick={handleSaveTimetable}
            >
                {isTimetableRoute
                    ? "Viewing Timetable"
                    : !isPopulated
                    ? "Save Timetable"
                    : isSaved
                    ? "Saved"
                    : "Save Timetable"}
            </button>
        </nav>
    );
}
