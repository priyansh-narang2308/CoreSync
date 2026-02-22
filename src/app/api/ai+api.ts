import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const { exerciseName } = await request.json();

  if (!exerciseName) {
    return Response.json(
      { error: "Exercise name is required" },
      { status: 400 }
    );
  }

  const prompt = `You are a professional fitness coach.
  You are given an exercise name and must provide clear instructions on how to perform it.
  Include if any equipment is required.
  Keep the explanation beginner-friendly, detailed, and formatted in markdown.

  Exercise: ${exerciseName}

  Use this exact markdown structure:
  ## Equipment Required
  ## Instructions
  ### Tips
  ### Variations
  ### Safety
  Keep spacing between sections and avoid extra commentary.`;

  try {
    // Correct pattern for @google/genai (official SDK)
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // gemini-1.5-flash is very stable and widely available
    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const message =
      result.candidates &&
        result.candidates[0] &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts[0] &&
        result.candidates[0].content.parts[0].text
        ? result.candidates[0].content.parts[0].text
        : "No response from AI model.";

    return Response.json({ message });
  } catch (error) {
    console.error("Error fetching Gemini guidance:", error);
    return Response.json(
      { error: "Failed to get AI guidance" },
      { status: 500 }
    );
  }
}
