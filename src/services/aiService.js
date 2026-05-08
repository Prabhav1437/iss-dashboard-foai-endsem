import axios from 'axios';

// Target the Router endpoint for DeepSeek model
const AI_PROXY_URL = '/api/ai/v1/chat/completions';
const MODEL_NAME = 'deepseek-ai/DeepSeek-V4-Flash:novita'; 

export const getAIResponse = async (userMessage, dashboardData) => {
  const hfToken = import.meta.env.VITE_AI_TOKEN;

  if (!hfToken || hfToken.includes('YOUR_')) {
    return "AI service is currently unavailable. Please provide a valid token.";
  }

  const context = `
    DASHBOARD DATA:
    - ISS: Lat ${dashboardData.iss?.latitude}, Lon ${dashboardData.iss?.longitude}, Speed ${dashboardData.speed?.toFixed(0)}km/h.
    - CREW: ${dashboardData.astros?.number} people.
    - NEWS: ${dashboardData.news?.slice(0, 2).map(n => n.title).join(' | ')}.
    
    SYSTEM RULE: You are an ISS Assistant. Answer ONLY based on this data. If the answer is not in the data, say "I can only answer based on dashboard data."
  `;

  try {
    // Matching User Snippet exactly
    const response = await axios.post(
      AI_PROXY_URL,
      { 
        messages: [
            {
                role: "user",
                content: `Data: ${context}\n\nQuestion: ${userMessage}`,
            },
        ],
        model: MODEL_NAME,
      },
      {
        headers: {
          'Authorization': `Bearer ${hfToken.trim()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices?.[0]?.message?.content || "No response received.";

  } catch (error) {
    console.error('AI Error Details:', error.response?.data || error.message);
    
    // Automatic fallback to V3 if V4-Flash is not recognized yet
    if (error.response?.status === 400 || error.response?.status === 404) {
       try {
           const isProd = import.meta.env.PROD;
           const API_URL = isProd 
             ? 'https://router.huggingface.co/v1/chat/completions' 
             : AI_PROXY_URL;

           const retryRes = await axios.post(API_URL, {
               messages: [{ role: "user", content: `Data: ${context}\n\nQuestion: ${userMessage}` }],
               model: "deepseek-ai/DeepSeek-V3:novita" 
           }, { headers: { 'Authorization': `Bearer ${hfToken.trim()}`, 'Content-Type': 'application/json' } });
           return retryRes.data.choices?.[0]?.message?.content || "No response.";
       } catch (e) {
           return "AI service error. Please ensure the model name is correct.";
       }
    }

    return "Connection error. Please check your token.";
  }
};
