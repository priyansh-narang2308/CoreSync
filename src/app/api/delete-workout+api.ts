import { adminClient } from "@/lib/sanity/client";

export async function POST(request: Request) {
  const { workoutId }: { workoutId: string } = await request.json();

  try {
    await adminClient.delete(workoutId as string);

    return Response.json({
      success: true,
      message: "Workout deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting workout: ", error);
    return Response.json(
      { error: "Failed to delete workout" },
      { status: 500 }
    );
  }
}
