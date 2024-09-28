import React, { useState } from 'react';
import { Motion } from './Motion';

function RoleForm({ onSubmit, loading }) {
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role.trim()) {
      onSubmit(role.trim());
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md backdrop-blur-lg bg-white/10 p-8 shadow-2xl rounded-2xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        AI Role Play Generator
      </h2>
      <p className="text-white/80 text-center mb-4">
        Enter a role for the AI to play. Be creative! The AI will adopt this persona for your conversation.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-white text-lg font-semibold mb-2" htmlFor="role">
          AI's Role:
        </label>
        <input
          id="role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g., a wise wizard, a space explorer"
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-white placeholder-white/50"
          required
        />
        <button
          type="submit"
          className={`mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Creating AI Persona...' : 'Start Role Play'}
        </button>
      </form>
      <p className="text-white/60 text-sm text-center mt-4">
        The AI will generate a unique personality based on the role you provide.
      </p>
    </Motion.div>
  );
}

export default RoleForm;