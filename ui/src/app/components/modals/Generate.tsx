import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface GenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GenerateModal({ isOpen, onClose } : GenerateModalProps) {
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
                        <div className="flex items-start justify-between gap-x-32 p-6">
                            <div className="flex flex-col gap-y-0.5 max-w-80">
                                <h1 className="font-medium text-sm">Generate Timetable</h1>
                                <p className="text-gray-500 text-[0.775rem]">
                                    Use the uploaded files to generate a timetable using the CSP backtracking solver.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="cursor-pointer hover:text-gray-700 transition-colors"
                            >
                                <IoClose className="size-4" />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}