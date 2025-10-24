import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

interface TableProps {
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

export default function Table({ title, description, data } : TableProps) {
    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("name", {
            header: () => <span>Name</span>,
        }),
        
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
}