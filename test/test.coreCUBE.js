// test/test.cubeCore.js

const { expect } = require('chai');
const CubeCore = require('../src/coreCUBE');

describe('CubeCore', () => {
  let cube;

  beforeEach(() => {
    cube = new CubeCore();
  });

  it('should set and get a value', () => {
    cube.set(0, 0, 'test');
    expect(cube.get(0, 0)).to.equal('test');
  });

  it('should increment zIndex on commit', () => {
    expect(cube.zIndex).to.equal(0);
    cube.commit();
    expect(cube.zIndex).to.equal(1);
  });

  it('should rollback to a previous state', () => {
    cube.set(0, 0, 'v1');
    cube.commit();
    cube.set(0, 0, 'v2');
    cube.commit();
    expect(cube.get(0, 0, 1)).to.equal('v2');
    cube.rollback(0);
    expect(cube.get(0, 0)).to.equal('v1');
  });

  it('should return correct diff between versions', () => {
    cube.set(1, 1, 'old');
    cube.commit();
    cube.set(1, 1, 'new');
    cube.commit();

    const changes = cube.diff(0, 1);
    expect(changes).to.deep.equal([
      { x: 1, y: 1, from: 'old', to: 'new' }
    ]);
  });

  it('should generate correct snapshot', () => {
    cube.set(0, 0, 'A');
    cube.set(0, 1, 'B');
    cube.commit();
    const snapshot = cube.snapshot(0);
    expect(snapshot).to.deep.equal({
      0: {
        0: 'A',
        1: 'B'
      }
    });
  });

  it('should get value using getSmart from latest version', () => {
    cube.set(2, 2, 'Z');
    cube.commit();
    cube.set(2, 2, 'Y');
    cube.commit();
    cube.rollback(0);
    expect(cube.getSmart(2, 2)).to.equal('Z');
  });

  it('should not overwrite value with smartSet if value is same', () => {
    cube.set(3, 3, 'A');
    cube.commit();
    cube.smartSet(3, 3, 'A');
    cube.commit();

    const diff = cube.diff(0, 1);
    expect(diff).to.deep.equal([]); // Değişiklik yapılmadıysa diff boş olmalı
  });

  it('should overwrite value with smartSet if value is different', () => {
    cube.set(4, 4, 'A');
    cube.commit();
    cube.smartSet(4, 4, 'B');
    cube.commit();

    const diff = cube.diff(0, 1);
    expect(diff).to.deep.equal([
      { x: 4, y: 4, from: 'A', to: 'B' }
    ]);
  });
});
