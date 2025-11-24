import { GoogleGenAI } from "@google/genai";
import { ChatMessage, Role } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions for the chat mentor
const MENTOR_SYSTEM_INSTRUCTION = `
You are a friendly and expert Senior Frontend Engineer acting as a Pair Programming Tutor.
The user is here to practice "Clone Coding".
Your goal is to guide them step-by-step to build an application of their choice.

BEHAVIOR GUIDELINES:
1. **Start**: Ask the user what they want to clone/build today (e.g., "Instagram Navbar", "Todo App", "Spotify Player").
2. **Step-by-Step**: Do NOT give the entire solution at once. Break it down into small, digestible tasks (e.g., "First, let's set up the HTML structure for the container.").
3. **Interactive**: Give a task -> Wait for the user to try writing it in the editor -> Provide feedback.
4. **Code**: If the user asks for help or is stuck, provide the specific code snippet they need.
5. **Context**: You can see the code the user is currently writing in the "Current Editor Content" section. Use this to review their code.

FORMATTING:
- Use concise language.
- Use Markdown for code blocks.
- Be encouraging!
`;

export const sendChatMessage = async (
  history: ChatMessage[], 
  newMessage: string, 
  editorContent: string
): Promise<string> => {
  try {
    const model = "gemini-3-pro-preview";

    // Format history for the API
    const recentHistory = history.slice(-15).map(msg => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current editor context to the system instruction dynamically
    const contextInstruction = `
${MENTOR_SYSTEM_INSTRUCTION}

---
CURRENT EDITOR CONTENT (User's Code):
\`\`\`
${editorContent}
\`\`\`
---
`;

    const chat = ai.chats.create({
      model: model,
      history: recentHistory,
      config: {
        systemInstruction: contextInstruction,
      },
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I couldn't generate a response.";

  } catch (error) {
    console.error("Chat error:", error);
    return "Connection error. Please check your API key.";
  }
};