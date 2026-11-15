const MAX_ACTIVE_JOBS = 2;
let activeJobs = 0;

const limitConcurrentJobs = (req, res, next) => {
  if (activeJobs >= MAX_ACTIVE_JOBS) {
    return res.status(429).json({ message: "Compiler is busy; retry shortly" });
  }

  activeJobs += 1;
  const controller = new AbortController();
  req.executionSignal = controller.signal;

  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    activeJobs -= 1;
    req.removeListener("aborted", onRequestAborted);
    res.removeListener("finish", onResponseFinish);
    res.removeListener("close", onResponseClose);
  };
  const onRequestAborted = () => controller.abort();
  const onResponseFinish = () => {
    if (!req.executionManaged) release();
  };
  const onResponseClose = () => {
    if (!res.writableEnded) {
      controller.abort();
      return;
    }
    if (!req.executionManaged) release();
  };

  req.releaseExecutionSlot = release;
  req.once("aborted", onRequestAborted);
  res.once("finish", onResponseFinish);
  res.once("close", onResponseClose);

  if (req.aborted || res.destroyed) controller.abort();
  return next();
};

module.exports = limitConcurrentJobs;
