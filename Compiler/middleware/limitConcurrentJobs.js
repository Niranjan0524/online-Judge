const MAX_ACTIVE_JOBS = 2;
let activeJobs = 0;

const limitConcurrentJobs = (req, res, next) => {
  if (activeJobs >= MAX_ACTIVE_JOBS) {
    return res.status(429).json({ message: "Compiler is busy; retry shortly" });
  }

  activeJobs += 1;
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    activeJobs -= 1;
  };

  res.once("finish", release);
  res.once("close", release);
  return next();
};

module.exports = limitConcurrentJobs;
