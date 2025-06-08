// utils/aiUtils.js

class AIUtils {
  static softmax(vector) {
    const max = Math.max(...vector);
    const exps = vector.map(x => Math.exp(x - max));
    const sum = exps.reduce((acc, val) => acc + val, 0);
    return exps.map(val => val / sum);
  }

  static sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  static tanh(x) {
    return Math.tanh(x);
  }

  static cosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must be of same length');
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vec1.length; i++) {
      dot += vec1[i] * vec2[i];
      normA += vec1[i] * vec1[i];
      normB += vec2[i] * vec2[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  static normalizeVector(vector) {
    const min = Math.min(...vector);
    const max = Math.max(...vector);

    if (max - min === 0) return vector.map(() => 0);
    return vector.map(val => (val - min) / (max - min));
  }

  static zScoreNormalize(vector) {
    const mean = vector.reduce((acc, val) => acc + val, 0) / vector.length;
    const variance = vector.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / vector.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return vector.map(() => 0);

    return vector.map(val => (val - mean) / stdDev);
  }
}

module.exports = AIUtils;
