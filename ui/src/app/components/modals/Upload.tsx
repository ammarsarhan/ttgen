import { ChangeEvent, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { uploadFiles } from "@/app/utils/api/client";

import { IoClose } from "react-icons/io5";
import { MdOutlineUploadFile } from "react-icons/md";
import useAppContext from "@/app/context/useAppContext";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type UploadModalActionType = "NEW" | "OVERRIDE";
type UploadStatus = "IDLE" | "UPLOADING" | "SUCCESS" | "ERROR";

export default function UploadModal({ isOpen, onClose } : UploadModalProps) {
    const { setActiveFiles } = useAppContext();

    const [actionType, setActionType] = useState<UploadModalActionType>("NEW");
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<UploadStatus>("IDLE");

    const mutation = useMutation({
        mutationFn: uploadFiles,
        mutationKey: ["upload"],
        onSuccess: (data) => {
            console.log(data);

            // Show a success message to the user.

            setFiles([]);
            setActiveFiles(data.files);

            setStatus("IDLE");
            onClose();
        },
        onError: () => {

        }
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        };
    };

    const handleFileUpload = () => {
        if (files.length < 5) return;

        setStatus("UPLOADING");
        const formData = new FormData();

        Array.from(files).forEach(file => {
            formData.append(`files`, file);
        });

        mutation.mutate(formData);
    }

    const isUploadable = files && files.length === 5 && status != "UPLOADING";

    if (!isOpen) return null;

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
                    onClick={onClose}
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
                        <div className="flex flex-col w-full gap-y-4">
                            <div className="flex items-start justify-between gap-x-8 px-6 pt-6">
                                <div className="flex flex-col gap-y-0.5 max-w-lg">
                                    <h1 className="font-medium text-sm">Upload Files</h1>
                                    <p className="text-gray-500 text-[0.775rem]">The solver requires <span className="underline">5 files</span> in either .xlsx or .csv format. This will be used to seed the database with data to help with easier querying, storage, and auditing of data.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="cursor-pointer hover:text-gray-700 transition-colors"
                                >
                                    <IoClose className="size-4" />
                                </button>
                            </div>
                            <div className="px-6 pb-6">
                                <div className="border-b border-gray-200 text-[0.8rem] mb-4">
                                    <button 
                                        onClick={() => setActionType("NEW")}
                                        className={`
                                            p-2 border-b cursor-pointer transition-colors
                                            ${actionType === "NEW" ? 
                                            "border-indigo-700 text-indigo-700" : 
                                            "text-gray-700 border-transparent"}
                                        `}>
                                            New Files
                                        </button>
                                    <button 
                                        onClick={() => setActionType("OVERRIDE")}
                                        className={`
                                            p-2 border-b cursor-pointer transition-colors
                                            ${actionType === "OVERRIDE" ? 
                                            "border-indigo-700 text-indigo-700" :
                                            "text-gray-700 border-transparent"}
                                        `}>
                                            Override Files
                                        </button>
                                </div>
                                <div className="w-full h-60 border-dashed border flex flex-col items-center justify-center border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                    <MdOutlineUploadFile className="size-7 text-gray-800 mb-2"/>
                                    <h2 className="text-sm">
                                        Drag and drop files here, or
                                        <label className="ml-1 relative cursor-pointer text-indigo-700 hover:underline">
                                            <input type="file" multiple className="absolute inset-0 opacity-0" onChange={handleFileChange}/>
                                            <span className="cursor-pointer">browse</span>
                                        </label>
                                    </h2>
                                    <p className="text-xs text-gray-500">Supports 5 files in .csv or .xlsx format up to 10 MBs total.</p>
                                </div>
                                {
                                    files.length > 0 &&
                                    <div className="my-6">
                                        <span className="text-[0.85rem] font-medium">{status == "SUCCESS" ? "Uploaded" : "Scheduled"} Files:</span>
                                        <ul className="text-xs mt-2">
                                            {
                                                files.map((file, index) => {
                                                    return <li key={index} className="text-gray-500 mb-2 last:mb-0">{index + 1}) {file.name}</li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                }
                                <div className="w-full flex items-center justify-end mt-4">
                                    <button 
                                        className={`
                                            px-4 py-2 rounded-md transition-colors text-xs
                                            ${isUploadable ? "cursor-pointer text-white bg-indigo-800 hover:bg-indigo-800/90" : "cursor-not-allowed border border-gray-200"}
                                        `}
                                        disabled={!isUploadable}
                                        onClick={handleFileUpload}
                                    >
                                        Upload
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