// utils/vectorOps.js

const franc = require('franc-min');
const leven = require('leven');
const nlp = require('compromise');

class VectorOps {
  // İki vektör arasındaki öklidyen mesafeyi hesapla
  static euclideanDistance(vec1, vec2) {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must be of same length');
    }

    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      sum += Math.pow(vec1[i] - vec2[i], 2);
    }
    return Math.sqrt(sum);
  }

  // İki vektör arasındaki kosinüs benzerliğini hesapla
  static cosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must be of same length');
    }

    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      magA += vec1[i] * vec1[i];
      magB += vec2[i] * vec2[i];
    }

    if (magA === 0 || magB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  // Küpte belirli bir hücrenin vektörü ile en benzer N vektörü bulur
  static findTopNSimilarVectors(cube, x, y, z, N = 5, threshold = 0.0) {
    const key = `${x}:${y}:${z}`;
    const targetEntry = cube.data.get(key);

    if (!targetEntry || !Array.isArray(targetEntry.vector)) {
      throw new Error(`Target cell at ${key} does not have a vector`);
    }

    const targetVector = targetEntry.vector;
    const results = [];

    for (const [cellKey, cellValue] of cube.data.entries()) {
      if (!Array.isArray(cellValue.vector)) continue;

      const sim = this.cosineSimilarity(targetVector, cellValue.vector);

      if (sim >= threshold && cellKey !== key) {
        results.push({ key: cellKey, similarity: sim });
      }
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, N);
  }

  // Vektör uzunluğu
  static vectorLength(vector) {
    return vector.length;
  }

  // Vektör tipi belirleme
  static vectorType(vector) {
    const types = new Set(vector.map(v => typeof v));
    if (types.size === 1) {
      return Array.from(types)[0];
    }
    return 'mixed';
  }

  // İlk ve son eleman
  static firstElement(vector) {
    return vector[0];
  }

  static lastElement(vector) {
    return vector[vector.length - 1];
  }

  // Belirli indeksteki eleman
  static elementAt(vector, index) {
    return vector[index];
  }

  // İstatistikler (sayısal vektörlerde)
  static sum(vector) {
    return vector.reduce((acc, val) => acc + val, 0);
  }

  static mean(vector) {
    return this.sum(vector) / vector.length;
  }

  static variance(vector) {
    const mean = this.mean(vector);
    return vector.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / vector.length;
  }

  static stdDev(vector) {
    return Math.sqrt(this.variance(vector));
  }

  static stdMeanProductPositive(vector) {
    return this.stdDev(vector) * this.mean(vector);
  }

  static stdMeanProductNegative(vector) {
    return -this.stdDev(vector) * this.mean(vector);
  }

  static normalize(vector) {
    const min = Math.min(...vector);
    const max = Math.max(...vector);
    if (max - min === 0) return vector.map(() => 0);

    return vector.map(val => (val - min) / (max - min));
  }

  static denormalize(normalizedVector, originalMin, originalMax) {
    return normalizedVector.map(val => val * (originalMax - originalMin) + originalMin);
  }

  static min(vector) {
    return Math.min(...vector);
  }

  static max(vector) {
    return Math.max(...vector);
  }

  static median(vector) {
    const sorted = [...vector].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      return sorted[mid];
    }
  }

  static percentile(vector, p) {
    const sorted = [...vector].sort((a, b) => a - b);
    const index = (sorted.length - 1) * p;
    const lower = Math.floor(index);
    const upper = lower + 1;
    const weight = index - lower;

    if (upper >= sorted.length) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  static skewness(vector) {
    const mean = this.mean(vector);
    const stdDev = this.stdDev(vector);
    const n = vector.length;

    return (
      (n / ((n - 1) * (n - 2))) *
      vector.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0)
    );
  }

  static kurtosis(vector) {
    const mean = this.mean(vector);
    const stdDev = this.stdDev(vector);
    const n = vector.length;

    return (
      (n * (n + 1)) /
      ((n - 1) * (n - 2) * (n - 3)) *
      vector.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) -
      (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3))
    );
  }

  static stringLengthInfo(vector) {
    const lengths = vector.map(str => str.length);
    const isUniform = lengths.every(len => len === lengths[0]);
    return { isUniform, length: isUniform ? lengths[0] : null };
  }

  static detectLanguage(vector) {
    const langs = vector.map(str => franc(str));
    const freq = langs.reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  }

  static stringSimilarity(str1, str2) {
    const distance = leven(str1, str2);
    const maxLen = Math.max(str1.length, str2.length);
    return 1 - distance / maxLen;
  }

  static pairwiseStringSimilarity(vector) {
    const results = [];
    for (let i = 0; i < vector.length; i++) {
      for (let j = i + 1; j < vector.length; j++) {
        const sim = this.stringSimilarity(vector[i], vector[j]);
        results.push({ pair: [i, j], similarity: sim });
      }
    }
    return results;
  }

  static async expandWithWord2Vec(vector, word2VecModel, topN = 3) {
    const results = {};
    for (const word of vector) {
      try {
        const similarWords = await word2VecModel.mostSimilar(word, topN);
        results[word] = similarWords;
      } catch (err) {
        results[word] = [];
      }
    }
    return results;
  }
  static posTags(vector) {
    return vector.map(str => {
      const doc = nlp(str);
      return doc.out('tags');
    });
  }

  static namedEntities(vector) {
    return vector.map(str => {
      const doc = nlp(str);
      return {
        people: doc.people().out('array'),
        places: doc.places().out('array'),
        organizations: doc.organizations().out('array')
      };
    });
  }

  static detectHashOrGuidInfo(vector) {
    const patterns = {
      guid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      md5: /^[a-f0-9]{32}$/i,
      sha1: /^[a-f0-9]{40}$/i,
      sha256: /^[a-f0-9]{64}$/i,
      sha512: /^[a-f0-9]{128}$/i,
      base64: /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/,
      hex: /^[a-f0-9]+$/i
    };

    const summary = {
      guid: 0,
      md5: 0,
      sha1: 0,
      sha256: 0,
      sha512: 0,
      base64: 0,
      hex: 0,
      none: 0
    };

    vector.forEach(str => {
      let matched = false;
      for (const [key, regex] of Object.entries(patterns)) {
        if (regex.test(str)) {
          summary[key]++;
          matched = true;
          break;
        }
      }
      if (!matched) {
        summary.none++;
      }
    });

    const majorityType = Object.entries(summary)
      .sort((a, b) => b[1] - a[1])[0][0];

    return {
      summary,
      majorityType
    };
  }

  static extractKeywords(vector, topN = 5) {
    return vector.map(str => {
      const doc = nlp(str);
      const terms = doc.terms().out('array');
      const nouns = doc.nouns().out('array');
      const uniqueTerms = Array.from(new Set([...terms, ...nouns]));

      // Basit frekans bazlı sıralama
      const freqMap = {};
      uniqueTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        const count = (str.match(regex) || []).length;
        freqMap[term] = count;
      });

      const sortedTerms = Object.entries(freqMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(entry => entry[0]);

      return sortedTerms;
    });

  }
  static elementWiseSum(vector1, vector2) {
    if (vector1.length !== vector2.length) {
      throw new Error('Vectors must be of same length');
    }
    return vector1.map((val, i) => val + vector2[i]);
  }

  static elementWiseSubtract(vector1, vector2) {
    if (vector1.length !== vector2.length) {
      throw new Error('Vectors must be of same length');
    }
    return vector1.map((val, i) => val - vector2[i]);
  }

  static multiplyByScalar(vector, scalar) {
    return vector.map(val => val * scalar);
  }

  static squareElements(vector) {
    return vector.map(val => val * val);
  }

  static cubeElements(vector) {
    return vector.map(val => val * val * val);
  }

}

module.exports = VectorOps;