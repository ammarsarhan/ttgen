"use client";

import { useState } from "react";
import { BiPlus, BiSearch } from "react-icons/bi";
import { MdOutlineUploadFile } from "react-icons/md";

export default function HistoryToolbar() {
    const [activeFiles, setActiveFiles] = useState([]);
    const [history, setHistory] = useState([]);

    return (
        <>
            <aside className="h-full border-r w-80 border-gray-200 text-[0.83rem]">
                <div className="h-16 border-b border-gray-200">

                </div>
                <div className="p-4">
                    <div className="flex flex-col gap-y-1">
                        <button className="flex w-full items-center gap-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                            <BiPlus className="size-4.5"/>
                            <span className="font-medium">Generate Timetable</span>
                        </button>
                        <div className="flex flex-col gap-y-1.5 my-2">
                            <button className="flex w-full items-center gap-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                <MdOutlineUploadFile className="size-4.5"/>
                                <span className="font-medium">Upload Files</span>
                            </button>
                            <div className="flex flex-col gap-y-1 text-[0.8125rem]">
                                <span>Active Files</span>
                                {
                                    activeFiles.length > 0 ?
                                    <ul>
                                        {
                                            activeFiles.map((file, index) => {
                                                return <li key={index}>{file}</li>
                                            })
                                        }
                                    </ul> :
                                    <p className="text-[0.8rem] text-gray-500">No active files, using default seeded files.</p>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2.5 my-2">
                            <div className="w-full relative">
                                <BiSearch className="text-gray-500 absolute top-1/2 left-2.5 -translate-y-1/2 size-3.5"/>
                                <input type="text" className="rounded-md border w-full border-gray-200 pl-7 pr-3 py-1.5 text-[0.8rem]" placeholder="Search timetables"/>
                            </div>
                            <div className="flex flex-col gap-y-1 text-[0.8125rem]">
                                <span>History</span>
                                {
                                    history.length > 0 ?
                                    <ul>
                                        {
                                            history.map((file, index) => {
                                                return <li key={index}>{file}</li>
                                            })
                                        }
                                    </ul> :
                                    <p className="text-[0.8rem] text-gray-500">No timetables yet, upload files and generate.</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}