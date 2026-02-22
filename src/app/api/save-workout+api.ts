// all fetchec from the sanity data same to samt

import { adminClient } from "@/lib/sanity/client";
import { WorkoutData } from "../../types/workout";

export async function POST(request: Request) {
  try {
    const { workoutData }: { workoutData: WorkoutData } = await request.json();
    console.log("SaveWorkoutAPI: Received workout data for user:", workoutData?.userId);

    if (!workoutData) {
      return Response.json({ error: "No workout data provided" }, { status: 400 });
    }

    // Ensure we are using the correct admin client with the token
    const result = await adminClient.create(workoutData);
    console.log("SaveWorkoutAPI: Successfully saved to Sanity, ID:", result._id);

    return Response.json({
      success: true,
      workoutId: result._id,
      message: "Workout saved successfully",
    });
  } catch (error) {
    console.error("SaveWorkoutAPI: Error details:", error);
    return Response.json({
      error: "Failed to save workout",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
