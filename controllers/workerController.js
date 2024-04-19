// controllers/workerController.js

const Worker = require('../models/Worker');

// Controller actions for workers
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createWorker = async (req, res) => {
  const newWorker = new Worker(req.body);
  try {
    const savedWorker = await newWorker.save();
    res.status(201).json(savedWorker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedWorker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(updatedWorker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteWorker = async (req, res) => {
  try {
    const deletedWorker = await Worker.findByIdAndDelete(req.params.id);
    if (!deletedWorker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json({ message: 'Worker deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
