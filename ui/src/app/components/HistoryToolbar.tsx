"use client";

import useAppContext from "@/app/context/useAppContext";
import GenerateModal from "@/app/components/modals/Generate";
import UploadModal from "@/app/components/modals/Upload";

import { BiPlus, BiSearch } from "react-icons/bi";
import { MdOutlineUploadFile } from "react-icons/md";

export default function HistoryToolbar() {
    const { 
        isGenerateModalOpen, 
        setIsGenerateModalOpen, 
        isUploadModalOpen, 
        setIsUploadModalOpen,
        timetables 
    } = useAppContext();

    const GroundModalProps = {
        isOpen: isGenerateModalOpen,
        onClose: () => setIsGenerateModalOpen(false)
    };
    
    const UploadModalProps = {
        isOpen: isUploadModalOpen,
        onClose: () => setIsUploadModalOpen(false)
    };

    return (
        <>
            <GenerateModal {...GroundModalProps}/>
            <UploadModal {...UploadModalProps}/>
            <aside className="h-full border-r w-80 border-gray-200 text-[0.83rem]">
                <div className="h-16 border-b border-gray-200">

                </div>
                <div className="p-4">
                    <div className="flex flex-col">
                        <button className="flex w-full items-center gap-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => setIsGenerateModalOpen(true)}>
                            <BiPlus className="size-4.5"/>
                            <span className="font-medium">Generate Timetable</span>
                        </button>
                        <div className="flex flex-col gap-y-3 my-2">
                            <button className="flex w-full items-center gap-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer" onClick={() => setIsUploadModalOpen(true)}>
                                <MdOutlineUploadFile className="size-4.5"/>
                                <span className="font-medium">Upload Files</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-y-4 my-2">
                            <div className="w-full relative">
                                <BiSearch className="text-gray-500 absolute top-1/2 left-2.5 -translate-y-1/2 size-3.5"/>
                                <input type="text" className="rounded-md border w-full border-gray-200 pl-7 pr-3 py-1.5 text-[0.8rem]" placeholder="Search timetables"/>
                            </div>
                            <div className="flex flex-col gap-y-1 text-[0.8125rem]">
                                <span className="font-medium">History</span>
                                {
                                    timetables.length > 0 ?
                                    <ul>
                                        {
                                            timetables.map((timetable, index) => {
                                                return <li key={index}>{timetable}</li>
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