export function evaluateClassifier(classifier, examples) {
  const predictions = examples.map((example) => ({
    expected: example.category,
    predicted: classifier.predict(example.text).category,
  }));
  const correct = predictions.filter((entry) => entry.expected === entry.predicted).length;
  return {
    examples: examples.length,
    correct,
    accuracy: examples.length === 0 ? 0 : correct / examples.length,
    predictions,
  };
}

