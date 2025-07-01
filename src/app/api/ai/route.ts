import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Construct the full prompt with context
    const fullPrompt = context 
      ? `Given this social media post context: "${context}"\n\nComplete this comment naturally and engagingly: "${prompt}"\n\nMake it sound human, conversational, and relevant to the post. Keep it concise (1-2 sentences max).`
      : `Complete this social media comment naturally and engagingly: "${prompt}"\n\nMake it sound human and conversational. Keep it concise (1-2 sentences max).`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 100,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response from Gemini API");
    }

    const generatedText = data.candidates[0].content.parts[0].text.trim();

    return NextResponse.json({ 
      success: true, 
      completion: generatedText 
    });

  } catch (error) {
    console.error("AI completion error:", error);
    return NextResponse.json(
      { error: "Failed to generate completion" },
      { status: 500 }
    );
  }
} 