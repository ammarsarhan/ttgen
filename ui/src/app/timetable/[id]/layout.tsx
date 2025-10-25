import { fetchTimetable } from "@/app/utils/api/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

export default async function TimetableLayout({ children, params } : { children: ReactNode, params: Promise<{ id: string }> }) {
    const queryClient = new QueryClient();
    const { id } = await params;

    await queryClient.prefetchQuery({
        queryFn: () => fetchTimetable(id),
        queryKey: ["timetable", id]
    })

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    )
}