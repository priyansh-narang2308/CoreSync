import { adminClient } from "@/lib/sanity/client";

export async function POST(request: Request) {
    try {
        const { routineData } = await request.json();
        console.log("SaveRoutineAPI: Received routine data for user:", routineData?.userId);

        if (!routineData) {
            return Response.json({ error: "No routine data provided" }, { status: 400 });
        }

        const result = await adminClient.create(routineData);
        console.log("SaveRoutineAPI: Successfully saved routine to Sanity, ID:", result._id);

        return Response.json({
            success: true,
            routineId: result._id,
            message: "Routine saved successfully",
        });
    } catch (error) {
        console.error("SaveRoutineAPI: Error details:", error);
        return Response.json({
            error: "Failed to save routine",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
