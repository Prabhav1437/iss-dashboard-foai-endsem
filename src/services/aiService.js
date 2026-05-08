import axios from 'axios';

/**
 * AI Assistant Service using HuggingFace Inference API (Mistral-7B)
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
    If a user asks about something not in the data (like weather on Earth, general history, or personal questions), 
    you must politely state: "I can only answer based on dashboard data."
    Keep your responses brief and professional.
  `;

  const finalPrompt = `<s>[INST] ${context}\n\nUser Question: ${userMessage} [/INST]`;

  try {
    const response = await axios.post(
      "/api/ai",
      {
        inputs: finalPrompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${hfToken.trim()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // HF Inference API returns an array: [{ generated_text: "..." }]
    if (response.data && response.data[0] && response.data[0].generated_text) {
      let content = response.data[0].generated_text;
      // Clean up any remaining instruction tags if the model leaks them
      content = content.replace(/\[\/INST\]/g, '').trim();
      return content;
    }
    
    return "I'm having trouble processing that right now. Please try again.";

  } catch (error) {
    console.error('AI Inference Error:', error.response?.data || error.message);
    return "I am currently offline. Please check your connection or AI token.";
  }
};
