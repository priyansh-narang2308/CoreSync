import { adminClient } from "@/lib/sanity/client";

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return Response.json({ error: "No routine ID provided" }, { status: 400 });
        }

        // Double check it's actually a routine before deleting
        const routine = await adminClient.getDocument(id);
        if (!routine || routine._type !== 'routine') {
            return Response.json({ error: "Routine not found" }, { status: 404 });
        }

        await adminClient.delete(id);

        return Response.json({
            success: true,
            message: "Routine deleted successfully",
        });
    } catch (error) {
        console.error("DeleteRoutineAPI: Error details:", error);
        return Response.json({
            error: "Failed to delete routine",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
