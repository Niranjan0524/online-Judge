import { useState, useRef } from "react";
import { Circles } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";

const ResumeReviewer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setReview("");
  };

  const handleUpload = async () => {
    if (!resumeFile) return;
    setLoading(true);
    setReview("");
    const formData=new FormData();
    formData.append("resume",resumeFile);

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resume/getReview`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        setReview(data.review);
      })
      .catch((error) => {
        setLoading(false);
        setReview(error.message);
      });
  };

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#0a1020] to-[#1e293b] rounded-xl shadow-lg p-8 border border-[#2a3447] ">

      <h2 className="text-3xl font-bold text-yellow-400 mb-2">
        Resume Reviewer
      </h2>
      <p className="text-gray-300 mb-6">
        Upload your resume (PDF or DOCX) and get instant AI-powered feedback!
      </p>
      <div className="w-full flex flex-col items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          className="bg-gradient-to-r from-yellow-500 to-red-800 text-white font-semibold px-6 py-2 rounded-lg shadow hover:scale-105 transition"
          onClick={() => fileInputRef.current.click()}
        >
          {resumeFile ? "Change Resume" : "Choose Resume"}
        </button>
        {resumeFile && (
          <div className="text-blue-300 text-sm font-mono">
            Selected: {resumeFile.name}
          </div>
        )}
        <button
          className="bg-gradient-to-r from-green-400 to-green-600 text-black font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition disabled:opacity-60"
          onClick={handleUpload}
          disabled={!resumeFile || loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Circles height="20" width="20" color="#fff" visible={true} />
              Uploading...
            </span>
          ) : (
            "Upload & Get Review"
          )}
        </button>
      </div>
      <div className="w-full mt-8">
        <h3 className="text-xl font-semibold text-pink-300 mb-2">AI Review</h3>
        <div className="bg-gray-900/80 border border-yellow-400 rounded-xl p-4 min-h-[80px] text-gray-100 font-mono shadow transition-all duration-300 scrollbar-thin scrollbar-thumb-yellow-500/50 scrollbar-track-gray-800/50">
          {loading ? (
            <span className="text-yellow-400">Analyzing your resume...</span>
          ) : review ? (
            <ReactMarkdown>
              {review}
            </ReactMarkdown>
          ) : (
            <span className="text-gray-500">
              Your review will appear here after uploading.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeReviewer;
