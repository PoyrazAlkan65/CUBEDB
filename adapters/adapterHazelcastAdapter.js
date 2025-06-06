// adapters/adapterHazelcast.js

const { Client } = require('hazelcast-client');
require('dotenv').config();

class HazelcastAdapter {
  constructor() {
    this.client = null;
  }

  async connect() {
    const hazelcastUrl = process.env.HAZELCAST_URL || 'localhost:5701';
    const hazelcastGroupName = process.env.HAZELCAST_GROUP_NAME || 'dev';
    const hazelcastGroupPassword = process.env.HAZELCAST_GROUP_PASSWORD || 'dev-pass';

    this.client = await Client.newHazelcastClient({
      network: {
        clusterMembers: [hazelcastUrl]
      },
      clusterName: hazelcastGroupName,
      security: {
        usernamePassword: {
          username: hazelcastGroupName,
          password: hazelcastGroupPassword
        }
      }
    });
  }

  async saveCube(mapName, cube) {
    const map = await this.client.getMap(mapName);
    await map.put('cubeData', JSON.stringify({
      data: Array.from(cube.data.entries()),
      zIndex: cube.zIndex
    }));
  }

  async loadCube(mapName, CubeCoreClass) {
    const map = await this.client.getMap(mapName);
    const raw = await map.get('cubeData');

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const cube = new CubeCoreClass();
    cube.zIndex = parsed.zIndex;
    cube.data = new Map(parsed.data);
    return cube;
  }

  async saveZLayerToMap(cube, z, mapName, prefix = '') {
    const map = await this.client.getMap(mapName);

    for (const [key, value] of cube.data.entries()) {
      const [x, y, kz] = key.split(":").map(Number);
      if (kz === z) {
        const hazelKey = `${prefix}${x}:${y}`;
        await map.put(hazelKey, JSON.stringify(value));
      }
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.shutdown();
    }
  }
}

module.exports = HazelcastAdapter;
