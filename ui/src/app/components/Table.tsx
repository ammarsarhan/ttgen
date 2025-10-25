/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface TableProps<T> {
    title: string;
    description: string;
    data: T[];
    columns: ColumnDef<T, any>[];
};

export default function Table<T>({ title, description, data, columns } : TableProps<T>) {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination: { pageIndex, pageSize },
        },
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(newPagination.pageIndex);
            setPageSize(newPagination.pageSize);
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="flex flex-col gap-y-4 last:pb-6">
            <div className="flex flex-col">
                <h1 className="text-base font-semibold">{title}</h1>
                <p className="text-[0.8rem] text-gray-500">{description}</p>
            </div>
            <div className="text-[0.8125rem]">
                {
                    table.getHeaderGroups().map(headerGroup => {
                        return (
                            <div className="flex w-full border border-gray-200 rounded-t-sm bg-gray-50" key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => {
                                        return (
                                            <div key={header.id} className="flex-1 p-2.5">
                                                <h6 className="text-center">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </h6>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
                {
                    table.getRowModel().rows.length > 0 &&
                    table.getRowModel().rows.map(row => {
                        return (
                            <div key={row.id} className="flex w-full border-b border-x border-gray-200 last:rounded-b-sm hover:bg-gray-50 transition-colors">
                                {
                                    row.getVisibleCells().map(cell => {
                                        return (
                                            <div key={cell.id} className="flex-1 flex items-center justify-center p-2">
                                                <span className="text-center">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div className="flex items-center justify-between mt-1.5 text-sm">
                <div className="flex items-center gap-x-1 text-[0.8rem]">
                    <span>Rows per page:</span>
                    <select 
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageIndex(0);
                        }}
                        className="outline-none"
                    >
                        {[5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-x-4 items-center">
                    <span className="text-[0.8rem]">Page: {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
                    <div className="flex items-center gap-x-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="disabled:opacity-30 cursor-pointer"
                        >
                            <FaChevronLeft className="size-3.5"/>
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="disabled:opacity-30 cursor-pointer"
                        >
                            <FaChevronRight className="size-3.5"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}