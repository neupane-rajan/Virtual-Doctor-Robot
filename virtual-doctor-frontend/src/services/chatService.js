// Using Django backend for responses - updated to match your API structure
const API_URL = 'http://localhost:8000/api/chat/';  // This matches your URL pattern

// Simple function to get a unique session ID
function getSessionId() {
  let sessionId = localStorage.getItem('virtualDoctorSessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now();
    localStorage.setItem('virtualDoctorSessionId', sessionId);
  }
  return sessionId;
}

// Main chat function
export const getChatResponse = async (message) => {
  try {
    const sessionId = getSessionId();
    
    // Send request to Django backend
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        session_id: sessionId
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      response: data.response,
      specialty: data.specialty,
      isMedical: data.isMedical
    };
  } catch (error) {
    console.error('Error sending message to backend:', error);
    
    // Fallback in case the backend request fails
    return {
      response: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or ask me another health question.",
      specialty: 'general medicine',
      isMedical: true
    };
  }
};