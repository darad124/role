// In a real application, this would be a server-side service
// Here, we're simulating it client-side for demonstration purposes

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function generateAIResponse(prompt) {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text || 'No text found in AI response.';
    } else {
      throw new Error('No valid candidate response returned from API.');
    }
  } catch (error) {
    console.error('Error in generateAIResponse:', error);
    throw error;
  }
}