import Timer from '../models/Timer.js';

// Get timer status and remaining time
export const getTimer = async (req, res) => {
  let timer = await Timer.findOne();
  if (!timer) {
    timer = await Timer.create({});
  }
  let remaining = timer.duration;
  if (timer.running && timer.startTime) {
    const elapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000);
    remaining = Math.max(timer.duration - elapsed, 0);
  }
  res.json({ running: timer.running, remaining });
};

// Start or reset timer to 90 minutes
export const startTimer = async (req, res) => {
  let timer = await Timer.findOne();
  if (!timer) timer = await Timer.create({});
  timer.startTime = new Date();
  timer.duration = 90 * 60;
  timer.running = true;
  await timer.save();
  res.json({ success: true });
};

// Stop timer (optional, not required by your spec)
export const stopTimer = async (req, res) => {
  let timer = await Timer.findOne();
  if (!timer) timer = await Timer.create({});
  timer.running = false;
  await timer.save();
  res.json({ success: true });
};
