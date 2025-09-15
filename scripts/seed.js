// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Cube = require('../models/cube');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const exists = await Cube.findOne({ cubeId: 'cube_1' });
    if (!exists) {
      await Cube.create({
        cubeId: 'cube_1',
        position: { x: 0, y: 0, z: 0 },
        rotationSpeed: 1,
        lastSaved: new Date()
      });
      console.log('✅ Seeded cube_1');
    } else {
      console.log('ℹ️ cube_1 already exists');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });

