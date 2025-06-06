// test/test.hazelcastAdapter.js

const { expect } = require('chai');
const HazelcastAdapter = require('../adapters/adapterHazelcastAdapter');
const CubeCore = require('../src/coreCUBE');
require('dotenv').config();

describe('HazelcastAdapter', () => {
  let adapter;
  let cube;
  const testMapName = 'testCubeMap';
  const testPrefix = 'testcube:z2:';

  before(async () => {
    adapter = new HazelcastAdapter();
    await adapter.connect();
  });

  beforeEach(() => {
    cube = new CubeCore();
    cube.set(0, 0, 'val00');
    cube.set(1, 1, 'val11');
    cube.commit();
    cube.set(0, 0, 'val00-z2');
    cube.set(1, 1, 'val11-z2');
    cube.commit();
  });

  after(async () => {
    await adapter.disconnect();
  });

  it('should save and load entire cube', async () => {
    await adapter.saveCube(testMapName, cube);

    const loadedCube = await adapter.loadCube(testMapName, CubeCore);
    expect(loadedCube).to.be.an.instanceOf(CubeCore);
    expect(loadedCube.zIndex).to.equal(cube.zIndex);
    expect(loadedCube.get(0, 0)).to.equal('val00-z2');
    expect(loadedCube.get(1, 1)).to.equal('val11-z2');
  });

  it('should save Z layer entries to Hazelcast map with prefix keys', async () => {
    await adapter.saveZLayerToMap(cube, 1, testMapName, testPrefix);

    const map = await adapter.client.getMap(testMapName);
    const val00 = await map.get(`${testPrefix}0:0`);
    const val11 = await map.get(`${testPrefix}1:1`);

    expect(JSON.parse(val00)).to.equal('val00-z2');
    expect(JSON.parse(val11)).to.equal('val11-z2');
  });
});
