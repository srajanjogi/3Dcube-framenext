// routes/cubes.js
const express = require('express');
const router = express.Router();
const Cube = require('../models/cube');

// GET /api/cubes/:id
router.get('/:id', async (req, res) => {
  try {
    const cube = await Cube.findOne({ cubeId: req.params.id });
    if (!cube) return res.status(404).json({ error: 'Cube not found' });
    res.json(cube);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cubes/:id/save
router.post('/:id/save', async (req, res) => {
  try {
    const { position, rotationSpeed } = req.body;
    if (!position || typeof rotationSpeed !== 'number') {
      return res.status(400).json({ error: 'Invalid body: position & rotationSpeed required' });
    }
    const updated = await Cube.findOneAndUpdate(
      { cubeId: req.params.id },
      { position, rotationSpeed, lastSaved: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, cube: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cubes/:id/reset
router.post('/:id/reset', async (req, res) => {
  try {
    const defaults = { position: { x: 0, y: 0, z: 0 }, rotationSpeed: 1, lastSaved: new Date() };
    const updated = await Cube.findOneAndUpdate(
      { cubeId: req.params.id },
      defaults,
      { upsert: true, new: true }
    );
    res.json({ success: true, cube: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
