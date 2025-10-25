"use client";

import useAppContext from "@/app/context/useAppContext"

export default function Navigation() {
    const { data, activeFiles, saveTimetable } = useAppContext();
    const isPopulated = data ? true : false;

    return (
        <nav className="fixed w-[calc(100%-18rem)] bg-white flex items-center justify-between h-16 border-b border-gray-200 z-50 px-4">
            <div className="text-gray-500 text-xs">
                {
                    activeFiles.length > 0 ?
                    <ul>
                        {
                            activeFiles.map((file, index) => {
                                return <span className="text-gray-500 mr-1.5 last:mr-0" key={index}>{index + 1}) {file}</span>
                            })
                        }
                    </ul> :
                    <p>You do not have any active files scheduled for generation yet. <br/> Please upload files or else fallback sample files will be used instead.</p>
                }
            </div>
            <button
                className={`
                    px-4 py-2 rounded-md transition-colors text-xs text-nowrap
                    ${isPopulated ? "cursor-pointer text-white bg-indigo-800 hover:bg-indigo-800/90" : "cursor-not-allowed border border-gray-200"}
                `}
                disabled={!isPopulated}
                onClick={saveTimetable}
            >
                Save timetable
            </button>
        </nav>
    )
}