// server/routes/machineRoutes.js
const express = require('express');
const router = express.Router();
const MachineData = require('../models/MachineData');
const authMiddleware = require('../middleware/authMiddleware');

// GET ข้อมูลทั้งหมด
router.get('/', authMiddleware, async (req, res) => {
  const data = await MachineData.find();
  res.json(data);
});

// POST เพิ่มข้อมูลใหม่
router.post('/', authMiddleware, async (req, res) => {
  const newData = new MachineData(req.body);
  await newData.save();
  res.status(201).json(newData);
});

// PUT แก้ไขข้อมูลตาม ID
router.put('/:id', authMiddleware, async (req, res) => {
  const updatedData = await MachineData.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedData);
});

// DELETE ลบข้อมูลตาม ID
router.delete('/:id', authMiddleware, async (req, res) => {
  await MachineData.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
