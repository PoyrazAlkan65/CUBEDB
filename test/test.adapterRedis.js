
// test/test.redisAdapter.js

const { expect } = require('chai');

const RedisAdapter = require('../adapters/adapterRedis');
const CubeCore = require('../src/coreCUBE');
require('dotenv').config();

describe('RedisAdapter', () => {
  let adapter;
  let cube;
  const testPrefix = 'testcube:z2';

  before(async () => {
    adapter = new RedisAdapter();
  });

  beforeEach(() => {
    cube = new CubeCore();
    cube.set(0, 0, 'val00');
    cube.set(1, 1, 'val11');
    cube.commit();
    cube.set(0, 0, 'val00-z2');
    cube.set(1, 1, 'val11-z2');
    cube.commit(); // zIndex = 2
  });

  after(async () => {
    await adapter.disconnect();
  });

  it('should save Z layer entries to Redis with prefix keys', async () => {
    await adapter.saveZLayerToRedisPrefix(cube, 1, testPrefix);

    const client = adapter.client;
    const val00 = await client.get(`${testPrefix}:0:0`);
    const val11 = await client.get(`${testPrefix}:1:1`);

    expect(JSON.parse(val00)).to.equal('val00-z2');
    expect(JSON.parse(val11)).to.equal('val11-z2');
  });
});
