// adapters/redisAdapter.js

const redis = require('redis');
require('dotenv').config();

class RedisAdapter {
  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisAuth = process.env.REDIS_AUTH;

    this.client = redis.createClient({
      url: redisUrl,
      password: redisAuth
    });

    this.client.connect().catch(console.error);
  }

  async saveCube(key, cube) {
    const serialized = JSON.stringify({
      data: Array.from(cube.data.entries()),
      zIndex: cube.zIndex
    });
    await this.client.set(key, serialized);
  }

  async saveZLayerToRedisPrefix(cube, z, prefix) {
    for (const [key, value] of cube.data.entries()) {
      const [x, y, kz] = key.split(":").map(Number);
      if (kz === z) {
        const redisKey = `${prefix}:${x}:${y}`;
        await this.client.set(redisKey, JSON.stringify(value));
      }
    }
  }

  async loadCube(key, CubeCoreClass) {
    const raw = await this.client.get(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const cube = new CubeCoreClass();
    cube.zIndex = parsed.zIndex;
    cube.data = new Map(parsed.data);
    return cube;
  }

  async getRawData(key) {
    const raw = await this.client.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  async reconstructCubeFromKey(key, CubeCoreClass) {
    const parsed = await this.getRawData(key);
    if (!parsed) return null;

    const cube = new CubeCoreClass();
    cube.zIndex = parsed.zIndex;
    cube.data = new Map(parsed.data);
    return cube;
  }

  async disconnect() {
    await this.client.disconnect();
  }
}

module.exports = RedisAdapter;
