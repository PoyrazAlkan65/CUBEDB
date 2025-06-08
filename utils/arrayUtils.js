// utils/arrayUtils.js

class ArrayUtils {
  static unique(array) {
    return Array.from(new Set(array));
  }

  static flatten(array) {
    return array.reduce((acc, val) => acc.concat(Array.isArray(val) ? ArrayUtils.flatten(val) : val), []);
  }

  static chunk(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  static shuffle(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  static compact(array) {
    return array.filter(Boolean);
  }

  static intersection(array1, array2) {
    const set2 = new Set(array2);
    return array1.filter(item => set2.has(item));
  }

  static difference(array1, array2) {
    const set2 = new Set(array2);
    return array1.filter(item => !set2.has(item));
  }

  static groupBy(array, keyFn) {
    return array.reduce((acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }
}

module.exports = ArrayUtils;
