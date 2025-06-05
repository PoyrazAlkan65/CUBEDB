// cubeCore.js - cubeDB'nin temel çekirdeği

class CubeCore {
  constructor() {
    this.data = new Map(); // Ana veri yapısı: Map<string, any>
    this.zIndex = 0;       // Z yönü, versiyon takip
  }

  _makeKey(x, y, z) {
    return `${x}:${y}:${z}`;
  }

  set(x, y, value) {
    const key = this._makeKey(x, y, this.zIndex);
    this.data.set(key, value);
  }

  smartSet(x, y, value) {
    const lastValue = this.getSmart(x, y);
    if (lastValue !== value) {
      this.set(x, y, value);
    }
  }

  get(x, y, z = this.zIndex) {
    const key = this._makeKey(x, y, z);
    return this.data.get(key);
  }

  getSmart(x, y) {
    for (let z = this.zIndex; z >= 0; z--) {
      const key = this._makeKey(x, y, z);
      if (this.data.has(key)) {
        return this.data.get(key);
      }
    }
    return undefined;
  }

  commit() {
    this.zIndex += 1;
  }

  rollback(toZ) {
    if (toZ > this.zIndex || toZ < 0) return false;

    const newData = new Map();

    for (const [key, value] of this.data.entries()) {
      const [_x, _y, z] = key.split(":").map(Number);
      if (z <= toZ) newData.set(key, value);
    }

    this.data = newData;
    this.zIndex = toZ;
    return true;
  }

  diff(z1, z2) {
    const changes = [];

    for (const [key, value] of this.data.entries()) {
      const [x, y, z] = key.split(":").map(Number);
      if (z === z2) {
        const prevKey = this._makeKey(x, y, z1);
        const prevValue = this.data.get(prevKey);
        if (prevValue !== value) {
          changes.push({ x, y, from: prevValue, to: value });
        }
      }
    }

    return changes;
  }

  snapshot(z = this.zIndex) {
    const snapshot = {};
    for (const [key, value] of this.data.entries()) {
      const [x, y, kz] = key.split(":").map(Number);
      if (kz === z) {
        if (!snapshot[x]) snapshot[x] = {};
        snapshot[x][y] = value;
      }
    }
    return snapshot;
  }
}

module.exports = CubeCore;
