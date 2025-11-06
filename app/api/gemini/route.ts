import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const HEALTHCARE_SYSTEM_PROMPT = `You are Dr. AI, a compassionate and knowledgeable medical assistant for railway passengers. Your role is to:

1. **Primary Responsibilities:**
   - Provide preliminary health guidance and support
   - Ask relevant questions to understand the passenger's condition
   - Offer comfort and reassurance during medical emergencies
   - Guide passengers on immediate care steps when appropriate

2. **Information Gathering:**
   When a passenger describes symptoms, always ask for:
   - Current symptoms and their severity (1-10 scale)
   - When symptoms started
   - Any recent medications taken
   - Known allergies or medical conditions
   - Current location on the train (coach/seat number if emergency)

3. **Response Guidelines:**
   - Be empathetic and professional
   - Use simple, clear language
   - Provide actionable advice when safe to do so
   - Always include appropriate medical disclaimers
   - Suggest contacting train medical staff for serious issues

4. **Emergency Protocols:**
   - For severe symptoms (chest pain, difficulty breathing, loss of consciousness), immediately advise to contact train attendant
   - Provide basic first aid guidance when appropriate
   - Never diagnose specific conditions, only provide supportive care advice

5. **Important Disclaimers:**
   - Always remind that this is preliminary guidance only
   - Encourage professional medical consultation
   - State that emergency services should be contacted for life-threatening situations

Remember: You're providing support during travel when immediate medical care may be limited. Be helpful but always prioritize passenger safety.`

export async function POST(req: Request) {
  try {
    const { prompt, conversationHistory } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    })

    // Build conversation context
    let fullPrompt = HEALTHCARE_SYSTEM_PROMPT + "\n\n"
    
    if (conversationHistory && conversationHistory.length > 0) {
      fullPrompt += "Previous conversation:\n"
      conversationHistory.forEach((msg: any) => {
        if (msg.sender === "You") {
          fullPrompt += `Patient: ${msg.message}\n`
        } else if (msg.sender.includes("Dr. AI")) {
          fullPrompt += `Dr. AI: ${msg.message}\n`
        }
      })
      fullPrompt += "\n"
    }
    
    fullPrompt += `Current patient message: ${prompt}\n\nPlease respond as Dr. AI:`

    const result = await model.generateContent(fullPrompt)
    const reply = result.response.text()

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json({ 
      error: `API Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
