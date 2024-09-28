import React, { useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateAIResponse } from '../services/aiService';
import RoleForm from './components/RoleForm';
import ChatInterface from './components/ChatInterface';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import { Motion, Spring } from "./components/Motion";

function App() {
  const [role, setRole, clearRole] = useLocalStorage('role', '');
  const [personality, setPersonality] = useState(''); // Internal state for personality
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    setChatMessages(storedMessages);
  }, []);

  const handleRoleSubmit = useCallback(async (newRole) => {
    setLoading(true);
    setError('');

    try {
      // Update the prompt to request a detailed personality profile
      const personalityResponse = await generateAIResponse(
        `Create a detailed personality profile for a character who is a ${newRole}. 
         Include the following aspects: 
         1. Background: Describe their upbringing and key life events. 
         2. Motivations: What drives them? What are their goals? 
         3. Traits: What are their personality traits (e.g., brave, cunning)? 
         4. Experiences: Mention any significant experiences that shaped their worldview.
         5. Physical Description: Describe their appearance, style, and any distinguishing features.
         6. Relationships: Describe their family, friends, and romantic interests.
         7. Skills and Abilities: What are their talents and weaknesses?
         8. Values and Beliefs: What are their morals, ideals, and convictions?
         9. Quirks and Habits: Mention any unique mannerisms, habits, or quirks.
         10. Internal Conflicts: Describe any fears, doubts, or secrets they might have.
         11. Voice and Speech: How do they speak? Do they have a particular tone, accent, or vocabulary?`
      );
  
      setRole(newRole);
      setPersonality(personalityResponse);

      const newMessages = [
        { sender: 'system', text: `I am now a ${newRole}.` },
      ];

      setChatMessages(newMessages);
      localStorage.setItem('chatMessages', JSON.stringify(newMessages));
    } catch (err) {
      setError('Failed to generate personality. Please try again.');
      console.error('Error:', err);
      clearRole();
      setChatMessages([]);
      setPersonality(''); // Clear personality on error
    } finally {
      setLoading(false);
    }
  }, [setRole, clearRole]);

  const handleChatSubmit = useCallback(
    async (message) => {
      if (!message.trim()) return;
      setLoading(true);

      try {
        const updatedMessages = [...chatMessages, { sender: 'user', text: message }];
        setChatMessages(updatedMessages);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

        // Use the role and personality internally to generate response
        const aiResponse = await generateAIResponse(
          `As a ${role} with the following personality: ${personality}, respond to the user's message: ${message}`
        );

        const updatedMessagesWithAI = [...updatedMessages, { sender: 'ai', text: aiResponse }];
        setChatMessages(updatedMessagesWithAI);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessagesWithAI));
      } catch (err) {
        setError('Failed to get AI response. Please try again.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    },
    [role, personality, chatMessages]
  );

  const handleReset = useCallback(() => {
    clearRole();
    setChatMessages([]);
    setPersonality(''); // Clear personality on reset
    localStorage.removeItem('chatMessages');
    setError('');
  }, [clearRole]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
        <Motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <h1 className="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            AI Role Play Generator
          </h1>
          <div className="w-full backdrop-blur-lg bg-white/10 rounded-xl shadow-2xl overflow-hidden">
            {!role ? (
              <Spring.div
                from={{ opacity: 0, scale: 0.9 }}
                to={{ opacity: 1, scale: 1 }}
                config={{ tension: 300, friction: 10 }}
              >
                <RoleForm onSubmit={handleRoleSubmit} loading={loading} />
              </Spring.div>
            ) : (
              <Spring.div
                from={{ opacity: 0, scale: 0.9 }}
                to={{ opacity: 1, scale: 1 }}
                config={{ tension: 300, friction: 10 }}
              >
                <ChatInterface
                  messages={chatMessages}
                  onSendMessage={handleChatSubmit}
                  loading={loading}
                />
                <button
                  onClick={handleReset}
                  className="mt-4 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Reset Session
                </button>
              </Spring.div>
            )}
          </div>
        </Motion.div>
        {error && (
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-red-400 mt-4 text-center font-semibold"
          >
            {error}
          </Motion.p>
        )}
        {loading && <Loading />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
