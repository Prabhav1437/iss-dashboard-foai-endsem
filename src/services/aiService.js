import axios from 'axios';

/**
 * Predefined responses for common questions to reduce API calls
 */
const getPredefinedResponse = (userMessage, dashboardData) => {
  const msg = userMessage.toLowerCase().trim();

  // Greetings
  if (['hi', 'hello', 'hey', 'hola', 'namaste'].some(g => msg === g || msg === g + '!')) {
    return `Hey there! 👋 Welcome to the ISS Dashboard! I'm your AI assistant. I can help you with:\n• ISS real-time position & speed\n• Current crew aboard the station\n• Latest space news\n• Any questions about the ISS\n\nWhat would you like to know?`;
  }

  // ISS Location
  if (['where is iss', 'where is the iss', 'iss location', 'current iss location', 'iss position'].includes(msg)) {
    const lat = dashboardData.iss?.latitude?.toFixed(2);
    const lon = dashboardData.iss?.longitude?.toFixed(2);
    return `The ISS is currently at:\n📍 Latitude: ${lat}°\n📍 Longitude: ${lon}°\n⛰️ Altitude: ${dashboardData.iss?.altitude?.toFixed(1) || 'N/A'} km`;
  }

  // ISS Speed
  if (['iss speed', 'how fast is iss', 'iss velocity', 'what is the iss speed'].includes(msg)) {
    return `The ISS is traveling at approximately ${dashboardData.speed?.toFixed(0) || 27580} km/h! 🚀 That's about 7.66 km per second, which allows it to orbit Earth roughly every 90 minutes.`;
  }

  // Crew Count
  if (['how many astronauts', 'crew count', 'who is on iss', 'how many people on iss'].includes(msg)) {
    const count = dashboardData.astros?.number || 3;
    return `There are currently ${count} astronauts aboard the ISS! 👨‍🚀👩‍🚀\n\nThey conduct scientific research and maintain the station while orbiting Earth.`;
  }

  // Crew List
  if (['astronauts list', 'list of astronauts', 'who are the astronauts', 'crew members'].includes(msg)) {
    if (dashboardData.astros?.people?.length > 0) {
      const crew = dashboardData.astros.people.map(p => `• ${p.name}`).join('\n');
      return `👨‍🚀 Current ISS Crew:\n${crew}`;
    }
    return `There are ${dashboardData.astros?.number || 3} astronauts aboard the ISS.`;
  }

  // News
  if (['latest news', 'space news', 'what\'s new', 'any news'].includes(msg)) {
    if (dashboardData.news?.length > 0) {
      const headlines = dashboardData.news.slice(0, 3).map((n, i) => `${i + 1}. ${n.title}`).join('\n');
      return `🗞️ Latest Space News:\n${headlines}\n\nCheck the News section for more details!`;
    }
    return `📰 Check the News section for the latest space updates!`;
  }

  // Help
  if (['help', 'what can you do', 'commands', 'how to use'].includes(msg)) {
    return `🤖 I can answer questions about:\n• ISS location & altitude\n• ISS speed & velocity\n• Number of astronauts aboard\n• Crew member names\n• Latest space news\n\nJust ask naturally, like "Where is the ISS?" or "How fast is it traveling?"`;
  }

  // Altitude
  if (['iss altitude', 'height of iss', 'how high is iss'].includes(msg)) {
    return `The ISS orbits at an altitude of approximately ${dashboardData.iss?.altitude?.toFixed(1) || 408} km above Earth's surface. 🌍`;
  }

  return null; // No predefined response - use AI
};

/**
 * Direct AI Assistant Service using HuggingFace Inference API
 */
export const getAIResponse = async (userMessage, dashboardData) => {
  // Check for predefined responses first
  const predefinedResponse = getPredefinedResponse(userMessage, dashboardData);
  if (predefinedResponse) {
    console.log('✅ Using predefined response');
    return predefinedResponse;
  }

  const hfToken = import.meta.env.VITE_AI_TOKEN;

  if (!hfToken || hfToken.includes('your_huggingface_token_here')) {
    console.error('❌ HuggingFace token not configured. Add VITE_AI_TOKEN to .env.local');
    return "⚠️ AI service not configured. Please add your HuggingFace token to .env.local and restart the server.";
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
    // Call through Vite proxy to bypass CORS
    const response = await axios.post(
      "/api/ai",
      {
        inputs: finalPrompt,
      },
      {
        headers: {
          'Authorization': `Bearer ${hfToken.trim()}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    // HF Direct Response Format
    if (response.data && Array.isArray(response.data)) {
      const text = response.data[0]?.generated_text || "";
      return text.split('[/INST]')[1]?.trim() || text || "No response generated";
    }
    
    return "Unexpected response format from AI service.";

  } catch (error) {
    console.error('AI Service Error:', error.message);
    return "API key token limit reached. Please try again later.";
  }
};
