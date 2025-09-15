// models/cube.js
const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
  cubeId: { type: String, required: true, unique: true },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  rotationSpeed: { type: Number, default: 1 }, // radians/sec
  lastSaved: { type: Date }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Cube', cubeSchema);
