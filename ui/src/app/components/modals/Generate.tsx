import useAppContext from "@/app/context/useAppContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface GenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GenerateModal({ isOpen, onClose } : GenerateModalProps) {
    const { activeFiles, progress, logs, generateTimetable, setProgress, setLogs } = useAppContext(); 
    const [isGeneratable, setIsGeneratable] = useState(true); 

    const handleGenerate = () => {
        setIsGeneratable(false);
        generateTimetable(() => {
            setIsGeneratable(true);
            handleClose();
        });
    }

    const handleClose = () => {
        if (!isGeneratable) return;

        setIsGeneratable(true);
        setProgress(0);
        setLogs([]);
        onClose();
    }
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-black/50 z-99"
                    onClick={handleClose}
                >
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-md shadow-md"
                    >
                        <div className="flex flex-col">
                            <div className="flex items-start justify-between gap-x-8 px-6 pt-6 mb-3">
                                <div className="flex flex-col gap-y-0.5 max-w-lg">
                                    <h1 className="font-medium text-sm">Generate Timetable</h1>
                                    <p className="text-gray-500 text-[0.775rem]">
                                        Use the uploaded files to generate a timetable using the CSP backtracking solver. You may only generate one timetable at a time.
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="cursor-pointer hover:text-gray-700 transition-colors"
                                >
                                    <IoClose className="size-4" />
                                </button>
                            </div>
                            <div className="px-6 pb-6 mt-3">
                                {
                                    isGeneratable ?
                                    <>
                                        <h2 className="text-[0.8125rem]">Generating timetable for the following files:</h2>
                                        {
                                            activeFiles.length > 0 ?
                                            activeFiles.map((file, index) => {
                                                return (
                                                    <span key={index} className="text-gray-500 text-[0.775rem] mr-2">{index + 1}) {file}</span>
                                                )
                                            }) :
                                            <p className="text-[0.775rem] text-gray-500">You do not have any current files scheduled. Falling back to the <Link href="/view/dataset" className="text-indigo-700 hover:underline">default dataset</Link> in samples folder.</p>
                                        }
                                    </> :
                                    <>
                                        <h2 className="text-[0.8125rem] mb-3">Resolving timetable</h2>
                                        <div className="flex items-center gap-x-4">
                                            <div className="flex flex-col gap-y-2 w-full flex-1">
                                                <span className="text-[0.8rem] w-lg">{logs[logs.length - 1]}</span>
                                                <div className="bg-indigo-700 h-1 rounded-md" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <div className="flex flex-col gap-y-2 flex-0">
                                                <span className="text-black text-xs">{progress}% Completed</span>
                                            </div>
                                        </div>
                                    </>
                                }
                                <div className="w-full flex items-center justify-end mt-8">
                                    <button
                                        className={`
                                            px-4 py-2 rounded-md transition-colors text-xs
                                            ${isGeneratable ? "cursor-pointer text-white bg-black hover:bg-black/90" : "cursor-not-allowed border border-gray-200"}
                                        `}
                                        disabled={!isGeneratable}
                                        onClick={handleGenerate}
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}