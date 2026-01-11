import mongoose from 'mongoose';

const timerSchema = new mongoose.Schema({
  startTime: { type: Date, default: null },
  duration: { type: Number, default: 90 * 60 }, // 90 minutes in seconds
  running: { type: Boolean, default: false },
});

export default mongoose.model('Timer', timerSchema);