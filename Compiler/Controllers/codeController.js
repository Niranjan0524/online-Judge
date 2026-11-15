const fs = require("fs");
const mongoose = require("mongoose");
const { generateFile, cleanupJob } = require("./generateFile");
const { executeCpp } = require("./executecpp");
const { executePython } = require("./executePython");
const { executeJavaScript } = require("./executeJavaScript");
const { executeJava } = require("./executeJava");
const TestCase = require("../Models/testCases");
const { generateInputFile } = require("./generateInputFiles");
const { generateInput } = require("./generateInput");
const Problem = require("../Models/problems");
const Solution = require("../Models/solution");

const MAX_CODE_LENGTH = 50_000;
const MAX_INPUT_LENGTH = 32_000;
const runLanguage = { cpp: executeCpp, py: executePython, js: executeJavaScript, java: executeJava };
const normalizeLanguage = (lang = "cpp") => (lang === "c++" ? "cpp" : lang);

const validateCodeRequest = (body, needsInput = false) => {
  if (!body || typeof body.code !== "string" || !body.code.trim()) {
    return "Code is required";
  }
  if (body.code.length > MAX_CODE_LENGTH) {
    return "Code exceeds the 50000 character limit";
  }
  if (!runLanguage[normalizeLanguage(body.lang)]) {
    return "Unsupported programming language";
  }
  if (!mongoose.Types.ObjectId.isValid(body.problemId)) {
    return "A valid problem ID is required";
  }
  if (needsInput) {
    let inputLength;
    try {
      inputLength = JSON.stringify(body.input ?? "").length;
    } catch {
      return "Input is invalid";
    }
    if (inputLength > MAX_INPUT_LENGTH) return "Input exceeds the 32000 character limit";
  }
  return null;
};

const removeInputFile = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") console.error("Unable to remove temporary input file.");
  }
};

const cleanupRequestFiles = async (req, filePath, inputFilePath) => {
  try {
    if (filePath) cleanupJob(filePath);
  } catch {
    console.error("Unable to remove temporary code files.");
  }

  try {
    await removeInputFile(inputFilePath);
  } finally {
    req.releaseExecutionSlot?.();
  }
};

const getExecutionErrorStatus = (error) =>
  error?.error === "Execution timed out" ? 504 : 400;

exports.runCode = async (req, res) => {
  req.executionManaged = true;
  const validationError = validateCodeRequest(req.body, true);
  if (validationError) {
    req.releaseExecutionSlot?.();
    return res.status(400).json({ message: validationError });
  }

  const { code, problemId, input, className } = req.body;
  const lang = normalizeLanguage(req.body.lang);
  let filePath;
  let inputFilePath;
  const signal = req.executionSignal;

  try {
    if (signal?.aborted) return;
    filePath = generateFile(code, lang, className);
    inputFilePath = generateInputFile(input);
    const output = await runLanguage[lang](filePath, inputFilePath, signal);
    if (signal?.aborted || res.destroyed) return;
    return res.status(200).json({ message: "Code ran successfully", output });
  } catch (error) {
    if (signal?.aborted || res.destroyed) return;
    return res.status(getExecutionErrorStatus(error)).json({
      message: error?.error === "Execution timed out" ? "Execution timed out" : "Code execution failed",
      error: error?.stderr || error?.error || "Execution failed",
    });
  } finally {
    await cleanupRequestFiles(req, filePath, inputFilePath);
  }
};

exports.submitCode = async (req, res) => {
  req.executionManaged = true;
  const validationError = validateCodeRequest(req.body);
  if (validationError) {
    req.releaseExecutionSlot?.();
    return res.status(400).json({ message: validationError });
  }

  const { code, problemId, id } = req.body;
  const lang = normalizeLanguage(req.body.lang);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.releaseExecutionSlot?.();
    return res.status(400).json({ message: "A valid user ID is required" });
  }

  let filePath;
  let inputFilePath;
  const signal = req.executionSignal;

  try {
    const [problem, testCases] = await Promise.all([
      Problem.findById(problemId),
      TestCase.find({ problemId }).sort({ _id: 1 }),
    ]);

    if (signal?.aborted) return;
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    filePath = generateFile(code, lang, req.body.className);
    const results = [];
    for (const testCase of testCases) {
      if (signal?.aborted) return;
      inputFilePath = generateInput(testCase.input);
      const output = await runLanguage[lang](filePath, inputFilePath, signal);
      results.push({
        id: testCase._id,
        output,
        correct: String(output).trim() === String(testCase.output).trim(),
      });
      await removeInputFile(inputFilePath);
      inputFilePath = undefined;
    }

    if (signal?.aborted || res.destroyed) return;
    const testCasesPassed = results.filter((result) => result.correct).length;
    const solution = await Solution.create({
      problemId,
      userId: id,
      code,
      titleName: problem.title,
      testCasesPassed,
      status: testCasesPassed === testCases.length ? "Accepted" : "Wrong Answer",
      submittedAt: new Date(),
    });

    return res.status(200).json({
      message: "Code submitted successfully",
      output: results,
      solution,
      solutionId: solution._id,
    });
  } catch (error) {
    if (signal?.aborted || res.destroyed) return;
    return res.status(getExecutionErrorStatus(error)).json({
      message: error?.error === "Execution timed out" ? "Execution timed out" : "Submission failed",
      error: error?.stderr || error?.error || "Execution failed",
    });
  } finally {
    await cleanupRequestFiles(req, filePath, inputFilePath);
  }
};
