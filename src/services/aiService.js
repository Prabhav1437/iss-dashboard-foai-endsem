import axios from 'axios';

/**
 * Direct AI Assistant Service using HuggingFace Inference API
 */
export const getAIResponse = async (userMessage, dashboardData) => {
  const hfToken = import.meta.env.VITE_AI_TOKEN;

  if (!hfToken || hfToken.includes('YOUR_')) {
    return "AI service is currently unavailable. Please provide a valid token.";
  }

  const context = `
    DASHBOARD DATA:
    - ISS Telemetry: Latitude ${dashboardData.iss?.latitude?.toFixed(2)}, Longitude ${dashboardData.iss?.longitude?.toFixed(2)}, Speed ${dashboardData.speed?.toFixed(0)}km/h.
    - Crew: ${dashboardData.astros?.number || 3} astronauts.
    - News: ${dashboardData.news?.slice(0, 2).map(n => n.title).join(' | ')}.
    
    RULE: Answer ONLY using this data. If unknown, say "I can only answer based on dashboard data."
  `;

  const finalPrompt = `<s>[INST] ${context}\n\nQuestion: ${userMessage} [/INST]`;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        inputs: finalPrompt,
      },
      {
        headers: {
          'Authorization': `Bearer ${hfToken.trim()}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    // HF Direct Response Format
    return response.data[0]?.generated_text?.split('[/INST]')[1]?.trim() || response.data[0]?.generated_text || "No response";

  } catch (error) {
    console.error('HF Direct Error:', error);
    return "AI service temporarily unavailable.";
  }
};
