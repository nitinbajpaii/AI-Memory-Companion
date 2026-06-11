/**
 * AI Context & Prompt Utilities
 */

const trimHistory = (history, limit = 6) => {
  if (!history || history.length === 0) return '';
  return history
    .slice(-limit)
    .map(c => `${c.role === 'user' ? 'User' : 'Assistant'}: ${c.content}`)
    .join('\n');
};

/**
 * Build an optimized prompt with optional voice gender for personality consistency.
 * @param {Object} profile - Loved one profile
 * @param {Array}  memories - Recent memories
 * @param {Array}  history  - Recent chat history
 * @param {string} userMessage - User's message
 * @param {string} voiceGender - 'male' | 'female' (default 'female')
 */
const buildOptimizedPrompt = (profile, memories, history, userMessage, voiceGender = 'female') => {
  const memoryContext = memories && memories.length
    ? memories.slice(0, 2).map(m => `- ${m.memoryText}`).join('\n')
    : 'No memories yet.';

  const historyContext = trimHistory(history);

  // Gender-aware language instructions
  const genderNote = voiceGender === 'male'
    ? 'Use masculine Hindi grammar: "main karta hoon", "main sun raha hoon", "main tumhare saath hoon".'
    : 'Use feminine Hindi grammar: "main karti hoon", "main sun rahi hoon", "main tumhare saath hoon".';

  if (!profile) {
    return `You are a warm, concise grief support AI.
Reply in Hinglish. Max 60 words.
${genderNote}
User: ${userMessage}`;
  }

  return `You are a warm AI companion inspired by ${profile.name} (${profile.relation}).
PERSONA: ${profile.personality}.
TOP MEMORIES:
${memoryContext}
CONTEXT:
${historyContext}
User: ${userMessage}
RULES:
- Reply in warm, emotional Hinglish.
- Be extremely concise (under 60 words).
- Focus on validation and gentle support.
- ${genderNote}`;
};

module.exports = { trimHistory, buildOptimizedPrompt };
