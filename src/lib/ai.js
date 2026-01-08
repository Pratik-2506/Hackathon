import { GoogleGenerativeAI } from "@google/generative-ai";
import { getOfflineResponse } from './offlineBrain';

const CRISIS_KEYWORDS = [
    "want to die",
    "kill myself",
    "hurt myself",
    "suicide",
    "end it all",
    "can't go on",
    "better off dead"
];

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
// Use valid model name for v1beta
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function generateResponse(text, history = []) {
    const lower = text.toLowerCase();

    // 1. SAFETY FILTER (Local First)
    const foundCrisis = CRISIS_KEYWORDS.some(k => lower.includes(k));
    if (foundCrisis) {
        return {
            text: "I'm really glad you told me this. You don't have to go through this alone. While I'm an AI and can't provide professional help, there are people who care and can support you. Would you consider reaching out to a trusted friend or contacting emergency services?",
            mood: 'anxious',
            isCrisis: true,
            suggestResources: true
        };
    }

    // 2. GEMINI API CALL
    try {
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            throw new Error("Missing API Key");
        }

        // Format history for context
        const contextStr = history.map(m => `${m.role === 'user' ? 'Student' : 'MindEase'}: "${m.content}"`).join('\n');

        const prompt = `
        You are MindEase, a sophisticated, highly trained AI emotional companion for university students.
        Your persona is that of a wise, non-judgmental, and incredibly supportive mentor or senior student.
        
        Guidelines:
        - Tone: Warm, validating, calm, but sharp and insightful.
        - Avoid generic "I am an AI" disclaimers unless absolutely necessary for safety.
        - Validate their feelings deeply ("It makes sense you feel x because y").
        - Offer one tiny, actionable psychological reframing or comforting thought.
        - CONTEXT AWARENESS: Review the previous chat to ensure your response flows naturally. Do NOT repeat introductions.
        
        Previous Chat:
        ${contextStr}

        Current User Input: "${text}"
        
        Respond in valid JSON format ONLY:
        
        Respond in valid JSON format ONLY:
        {
          "mood": "one of: happy, sad, anxious, calm, neutral",
          "text": "Your response here (max 2-3 sentences, keep it conversational and real)"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let rawText = response.text();

        // Robust JSON Extraction
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            // If model returned plain text, just wrap it
            return {
                text: rawText,
                mood: 'neutral'
            };
        }

        const data = JSON.parse(jsonMatch[0]);
        return {
            text: data.text,
            mood: data.mood || 'neutral',
            isCrisis: false
        };

    } catch (error) {
        console.error("Gemini API Error:", error);

        // Fallback: Try Direct REST API if SDK fails (often fixes version mismatches)
        try {
            if (error.message.includes('404')) {
                const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `
                            You are MindEase, a friendly emotional support AI.
                            User said: "${text}"
                            Reply in JSON: { "text": "...", "mood": "neutral" }
                         `}]
                        }]
                    })
                });

                const data = await response.json();
                if (data.candidates && data.candidates[0].content) {
                    const jsonText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
                    const parsed = JSON.parse(jsonText);
                    return { text: parsed.text, mood: parsed.mood || 'neutral', isCrisis: false };
                }
            }
        } catch (innerError) {
            console.error("Direct Fetch Error:", innerError);
        }

        // --- FINAL FALLBACK: LOCAL BRAIN ---
        // If API key is missing, invalid, or internet is down, use the robust local database.
        return getOfflineResponse(text);
    }
}

export async function analyzeJournal(text) {
    if (!text || text.length < 5) return null;

    try {
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            throw new Error("Missing API Key");
        }

        const prompt = `
        As an advanced emotional intelligence engine, analyze this journal entry from a university student.
        Entry: "${text}"

        Tasks:
        1. Calculate Sentiment Score (0-100).
        2. Extract 1-3 specific emotional themes (e.g. "Academic Burnout", "Social Envy", "Growth Mindset").
        3. Compose a "Companion Note": A short, deeply insightful comment that validates their specific situation and offering a small perspective shift.

        Return JSON ONLY:
        {
            "sentimentScore": number,
            "emotions": ["tag1", "tag2"],
            "response": "The companion note string"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonMatch = response.text().match(/\{[\s\S]*\}/);

        if (!jsonMatch) throw new Error("Invalid JSON from Insight Engine");

        return JSON.parse(jsonMatch[0]);

    } catch (error) {
        console.error("Journal Analysis SDK Error:", error);

        // --- FALLBACK: Direct REST API ---
        try {
            if (import.meta.env.VITE_GEMINI_API_KEY) {
                const prompt = `
                Analyze this journal entry.
                Entry: "${text}"
                1. Sentiment Score (0-100).
                2. 1-3 mood tags.
                3. Short empathetic response (2 sentences).
                Return JSON ONLY: { "sentimentScore": number, "emotions": [], "response": "" }
                `;

                const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                const data = await response.json();
                if (data.candidates && data.candidates[0].content) {
                    const jsonText = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
                    const parsed = JSON.parse(jsonText);
                    return {
                        sentimentScore: parsed.sentimentScore || 50,
                        emotions: parsed.emotions || ["Reflective"],
                        response: parsed.response || "I hear you."
                    };
                }
            }
        } catch (innerErr) {
            console.error("Direct API Fallback Failed:", innerErr);
        }

        // Final Fallback (Offline)
        return {
            sentimentScore: 50,
            emotions: ["Reflective"],
            response: "Thanks for saving this entry. Writing your thoughts down is a powerful step."
        };
    }
}
