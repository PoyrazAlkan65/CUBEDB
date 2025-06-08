// test/test.vectorOps.js

const { expect } = require('chai');
const VectorOps = require('../utils/vectorOps');

describe('VectorOps', () => {
  it('should extract keywords from vector', () => {
    const vector = [
      "Türkiye'nin en büyük teknoloji fuarı İstanbul'da başladı.",
      "Yapay zeka modelleri metin özetleme alanında büyük başarı sağladı."
    ];

    const keywords = VectorOps.extractKeywords(vector, 3);

    expect(keywords).to.be.an('array').with.lengthOf(2);
    expect(keywords[0]).to.be.an('array');
    expect(keywords[1]).to.be.an('array');
  });

  it('should detect hash or guid info', () => {
    const vector = [
      '6f9619ff-8b86-d011-b42d-00cf4fc964ff',
      'd41d8cd98f00b204e9800998ecf8427e',
      '3ca25ae354e192b26879f651a51d92aa8a34d8d3',
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      'Zm9vYmFy',
      'abcdef123456',
      'normalstringtext'
    ];

    const result = VectorOps.detectHashOrGuidInfo(vector);
    expect(result).to.have.property('summary');
    expect(result).to.have.property('majorityType');
    expect(result.summary).to.be.an('object');
  });

  it('should extract named entities', () => {
    const vector = [
      "John works at Microsoft in London.",
      "Elon Musk founded SpaceX."
    ];

    const entities = VectorOps.namedEntities(vector);

    expect(entities).to.be.an('array').with.lengthOf(2);
    expect(entities[0]).to.have.keys(['people', 'places', 'organizations']);
    expect(entities[1]).to.have.keys(['people', 'places', 'organizations']);
  });

  it('should extract POS tags', () => {
    const vector = [
      "The quick brown fox jumps over the lazy dog.",
      "Artificial intelligence is transforming industries."
    ];

    const tags = VectorOps.posTags(vector);

    expect(tags).to.be.an('array').with.lengthOf(2);
    expect(tags[0]).to.be.an('array');
    expect(tags[1]).to.be.an('array');
  });

  it('should detect language', () => {
    const vector = [
      "Merhaba dünya.",
      "Nasılsın bugün?",
      "Bugün hava çok güzel."
    ];

    const lang = VectorOps.detectLanguage(vector);
    expect(lang).to.be.a('string');
  });

  it('should compute string length info', () => {
    const vector = ["abc", "def", "ghi"];
    const info = VectorOps.stringLengthInfo(vector);

    expect(info).to.have.keys(['isUniform', 'length']);
    expect(info.isUniform).to.equal(true);
    expect(info.length).to.equal(3);
  });

  it('should compute string similarity', () => {
    const sim = VectorOps.stringSimilarity("hello", "hallo");
    expect(sim).to.be.a('number');
    expect(sim).to.be.within(0, 1);
  });

  it('should compute pairwise string similarity', () => {
    const vector = ["hello", "hallo", "hullo"];
    const results = VectorOps.pairwiseStringSimilarity(vector);

    expect(results).to.be.an('array');
    expect(results[0]).to.have.keys(['pair', 'similarity']);
  });

  it('should denormalize vector', () => {
    const normalized = [0, 0.5, 1];
    const denorm = VectorOps.denormalize(normalized, 10, 20);

    expect(denorm).to.deep.equal([10, 15, 20]);
  });

  it('should compute basic statistics (sum, mean, variance, stdDev)', () => {
    const vector = [1, 2, 3, 4, 5];

    expect(VectorOps.sum(vector)).to.equal(15);
    expect(VectorOps.mean(vector)).to.equal(3);
    expect(VectorOps.variance(vector)).to.be.closeTo(2.0, 0.001);
    expect(VectorOps.stdDev(vector)).to.be.closeTo(Math.sqrt(2.0), 0.001);
  });

  it('should compute stdMeanProductPositive and Negative', () => {
    const vector = [1, 2, 3];

    const positive = VectorOps.stdMeanProductPositive(vector);
    const negative = VectorOps.stdMeanProductNegative(vector);

    expect(positive).to.be.closeTo(VectorOps.stdDev(vector) * VectorOps.mean(vector), 0.001);
    expect(negative).to.be.closeTo(-VectorOps.stdDev(vector) * VectorOps.mean(vector), 0.001);
  });

  it('should normalize vector', () => {
    const vector = [2, 4, 6, 8];
    const normalized = VectorOps.normalize(vector);

    expect(normalized[0]).to.be.closeTo(0.0, 0.001);
    expect(normalized[normalized.length - 1]).to.be.closeTo(1.0, 0.001);
  });

  it('should compute min, max, median, percentile, skewness, kurtosis', () => {
    const vector = [1, 2, 3, 4, 5];

    expect(VectorOps.min(vector)).to.equal(1);
    expect(VectorOps.max(vector)).to.equal(5);
    expect(VectorOps.median(vector)).to.equal(3);
    expect(VectorOps.percentile(vector, 0)).to.equal(1);
    expect(VectorOps.percentile(vector, 1)).to.equal(5);
    expect(VectorOps.percentile(vector, 0.5)).to.equal(3);

    const skewness = VectorOps.skewness(vector);
    const kurtosis = VectorOps.kurtosis(vector);

    expect(skewness).to.be.a('number');
    expect(kurtosis).to.be.a('number');
  });
});
