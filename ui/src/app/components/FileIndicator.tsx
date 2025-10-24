"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useAppContext from "@/app/context/useAppContext";

export default function FileIndicator() {
  const { activeFiles } = useAppContext();

  return (
        <AnimatePresence>
            <motion.div
                key="file-indicator"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed bottom-4 right-4 flex flex-col gap-y-0.5 w-56 p-4 rounded-md border border-gray-200 bg-gray-50"
            >
                {
                    activeFiles.length > 0 ? (
                        <>
                            <span className="font-medium text-[0.8125rem] mb-1">
                                Active files ({activeFiles.length})
                            </span>
                            <p className="flex flex-wrap">
                                {
                                    activeFiles.map((file, index) => (
                                        <motion.span
                                            key={file + index}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-xs mb-1 mr-[3px] last:m-0 text-gray-500 text-wrap"
                                        >
                                            {file}{index != activeFiles.length - 1 && ","}
                                        </motion.span>
                                    ))
                                }
                            </p>
                        </>
                    ) : (
                        <>
                            <span className="font-medium text-[0.8125rem] mb-1">
                                You do not have any active files yet.
                            </span>
                            <p className="text-gray-500 text-xs">
                                Generator will fall back to the default files until a custom dataset is uploaded.
                            </p>
                        </>
                    )
                }
                <Link 
                    href="/view/dataset" 
                    target="_blank"
                    className="text-blue-700 hover:underline cursor-pointer mt-2 text-xs text-left w-fit"
                >
                    View Dataset
                </Link>
            </motion.div>
        </AnimatePresence>
  );
}
