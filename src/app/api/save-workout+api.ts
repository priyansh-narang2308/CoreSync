// all fetchec from the sanity data same to samt

import { adminClient } from "@/lib/sanity/client";
import { WorkoutData } from "../../types/workout";

export async function POST(request: Request) {
  const { workoutData }: { workoutData: WorkoutData } = await request.json();

  try {
    //saving t sanity by the client
    const result = await adminClient.create(workoutData);


    return Response.json({
      success: true,
      workoutId: result._id,
      message: "Workout saved successfully",
    });
  } catch (error) {
    console.error("Error saving workout:", error);
    return Response.json({ error: "Failed to save workout" }, { status: 500 });
  }
}
