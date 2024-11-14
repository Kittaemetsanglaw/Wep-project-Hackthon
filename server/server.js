// server/server.js
require('dotenv').config();
const mongoose = require('mongoose');
const WebSocket = require('ws');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const MachineData = require('./models/MachineData'); // เพิ่มการ import Model ที่สร้างไว้
const DataKey = process.env.DATA_KEY; // ใช้ DataKey จาก .env

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// สร้าง WebSocket Client สำหรับเชื่อมต่อกับ API
const ws = new WebSocket('ws://technest.ddns.net:8001/ws');
ws.on('open', () => {
  console.log('Connected to WebSocket server');
  ws.send(DataKey); // ส่ง DataKey เพื่อยืนยันตัวตน
});
ws.on('message', async (message) => {
  try {
    const data = JSON.parse(message);
    const machineData = new MachineData({
      energyConsumption: data['Energy Consumption'].Power,
      voltage: {
        L1_GND: data.Voltage['L1-GND'],
        L2_GND: data.Voltage['L2-GND'],
        L3_GND: data.Voltage['L3-GND'],
      },
      pressure: data.Pressure,
      force: data.Force,
      cycleCount: data['Cycle Count'],
      punchPosition: data['Position of the Punch'],
    });
    await machineData.save();
    console.log('Data saved to DB:', machineData);
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

const machineRoutes = require('./routes/machineRoutes');
app.use('/api/machines', machineRoutes);

app.post('/register', async (req, res) => {
    // Logic การลงทะเบียนจะอยู่ที่นี่
  });
  app.post('/login', async (req, res) => {
    // Logic การเข้าสู่ระบบและส่ง token JWT กลับไปจะอยู่ที่นี่
  });
  

ws.on('error', console.error);
ws.on('close', () => console.log('WebSocket connection closed'));
