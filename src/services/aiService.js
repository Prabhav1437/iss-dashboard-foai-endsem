import axios from 'axios';

/**
 * AI Assistant Service using HuggingFace Router (DeepSeek-V4-Flash)
 * Restricted to dashboard context (RAG-lite)
 */
export const getAIResponse = async (userMessage, dashboardData) => {
  const hfToken = import.meta.env.VITE_AI_TOKEN;

  if (!hfToken || hfToken.includes('YOUR_')) {
    return "AI service is currently unavailable. Please provide a valid token.";
  }

  // Inject dashboard context into the prompt
  const context = `
    DASHBOARD DATA:
    - ISS Telemetry: Latitude ${dashboardData.iss?.latitude}, Longitude ${dashboardData.iss?.longitude}, Speed ${dashboardData.speed?.toFixed(0)}km/h.
    - Crew: There are ${dashboardData.astros?.number} astronauts currently on board.
    - Latest News: ${dashboardData.news?.slice(0, 3).map(n => n.title).join(' | ')}.
    
    INSTRUCTION: You are the ISS Intelligent Assistant. You only answer questions using the dashboard data provided above.
    If a user asks about something not in the data, say: "I can only answer based on dashboard data."
    Keep your responses brief and professional.
  `;

  try {
    // Using unified proxy path /api/ai/v1/...
    const response = await axios.post(
      "/api/ai/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-V4-Flash:novita",
        messages: [
          {
            role: "user",
            content: `Data: ${context}\n\nQuestion: ${userMessage}`,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${hfToken.trim()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Router uses OpenAI format: choices[0].message.content
    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    }
    
    return "I'm having trouble processing that right now. Please try again.";

  } catch (error) {
    console.error('AI Router Error:', error.response?.data || error.message);
    return "I am currently offline. Please check your connection or AI token.";
  }
};
