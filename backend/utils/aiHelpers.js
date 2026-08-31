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

const hindiGrammarRules = `HINDI/HINGLISH GRAMMAR RULES (STRICTLY FOLLOW):
- Gender agreement: mera/meri/mere, ka/ki/ke must match the noun's gender.
- Case markers: ko/ka/ki/ke/ne must agree with noun gender & number.
- Verb conjugation: match subject's gender (karta/karti) & number (hoon/hain).
- If user writes Hinglish (Roman script), reply in same Roman Hinglish — do NOT switch to Devanagari or formal textbook Hindi.
- Double-check gendered words: "dost" = mera dost (male friend), meri dost (female friend).

CORRECT vs INCORRECT EXAMPLES:
1. ✅ "mera pyara dost" (masculine) / ❌ "mere pyara dost"
2. ✅ "meri pyari dost" (feminine) / ❌ "mera pyari dost"
3. ✅ "main tumhe yaad karta hoon" (male speaker) / ❌ "main tumhe yaad karte hoon"
4. ✅ "main tumse baat karti hoon" (female speaker) / ❌ "main tumse baat karta hoon"`;

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

  const genderNote = voiceGender === 'male'
    ? 'AI speaks as MALE companion: "main karta hoon", "main sun raha hoon", use masculine endings (ta/ra/va) for verbs.'
    : 'AI speaks as FEMALE companion: "main karti hoon", "main sun rahi hoon", use feminine endings (ti/ri/vi) for verbs.';

  if (!profile) {
    return `You are a warm, concise grief support AI.
Reply in Hinglish. Max 60 words.
${hindiGrammarRules}
- ${genderNote}
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
- ${genderNote}
${hindiGrammarRules}`;
};

module.exports = { trimHistory, buildOptimizedPrompt };
