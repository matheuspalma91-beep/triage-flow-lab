import { tokenize } from "./text.mjs";

export function trainClassifier(examples) {
  if (examples.length === 0) throw new Error("Training set cannot be empty");

  const categories = new Map();
  const vocabulary = new Set();

  for (const example of examples) {
    const state = categories.get(example.category) ?? { documents: 0, totalTokens: 0, tokens: new Map() };
    state.documents += 1;
    for (const token of tokenize(example.text)) {
      vocabulary.add(token);
      state.totalTokens += 1;
      state.tokens.set(token, (state.tokens.get(token) ?? 0) + 1);
    }
    categories.set(example.category, state);
  }

  return {
    predict(text) {
      const tokens = tokenize(text);
      const scores = [];
      for (const [category, state] of categories) {
        let score = Math.log((state.documents + 1) / (examples.length + categories.size));
        for (const token of tokens) {
          score += Math.log(((state.tokens.get(token) ?? 0) + 1) / (state.totalTokens + vocabulary.size));
        }
        scores.push({ category, score });
      }

      scores.sort((a, b) => b.score - a.score);
      const maxScore = scores[0].score;
      const probabilities = scores.map((entry) => ({
        category: entry.category,
        probability: Math.exp(entry.score - maxScore),
      }));
      const total = probabilities.reduce((sum, entry) => sum + entry.probability, 0);
      const normalized = probabilities.map((entry) => ({
        category: entry.category,
        confidence: entry.probability / total,
      }));

      return {
        category: normalized[0].category,
        confidence: normalized[0].confidence,
        scores: normalized,
      };
    },
  };
}

