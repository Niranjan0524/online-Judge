import { useState, useRef } from "react";
import { Circles } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

function extractSection(markdown, sectionTitle) {
  const pattern = new RegExp(
    `\\*\\*${sectionTitle}:\\*\\*[\\s\\S]*?(?=\\*\\*\\w+:\\*\\*|$)`,
    "i"
  );
  const match = markdown.match(pattern);
  if (!match) return `No ${sectionTitle.toLowerCase()} found.`;
  return match[0].replace(`**${sectionTitle}:**`, "").trim();
}



const ResumeReviewer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [review, setReview] = useState({});
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
    const token = localStorage.getItem("token");
    if(!token){
      setLoading(false);
      toast.error("You need to be logged in to upload a resume.");
      return;
    }
    
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resume/getReview`, {
      method: "POST",
      headers:{
        authorization:`Bearer ${localStorage.getItem("token")}`,
      },
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
    <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0a1020] to-[#1e293b] rounded-xl shadow-lg p-8 border border-[#2a3447] ">
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
          onClick={() => fileInputRef?.current.click()}
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
        <h3 className="text-2xl font-bold text-yellow-300 mb-4">
          ✨ AI-Powered Resume Review
        </h3>

        <div className="bg-gray-900/80 border border-yellow-400 rounded-2xl p-6 min-h-[120px] text-gray-100 font-mono shadow-lg transition-all duration-300 ease-in-out scrollbar-thin scrollbar-thumb-yellow-500/50 scrollbar-track-gray-800/50">
          {loading ? (
            <div className="text-yellow-400 text-lg animate-pulse">
              ⏳ Analyzing your resume...
            </div>
          ) : Object.keys(review).length ? (
            <div className="space-y-6 text-base leading-relaxed animate-fade-in">
              <section className="bg-green-1000 p-4 rounded-xl shadow-sm border border-green-300">
                <h2 className="text-green-700 text-xl font-semibold mb-2">
                  ✅ Strengths
                </h2>
                <ReactMarkdown>
                  {Array.isArray(review.strengths)
                    ? review.strengths.join("\n")
                    : review.strengths || "No strengths found."}
                </ReactMarkdown>
              </section>

              <section className="bg-pink-1000 p-4 rounded-xl shadow-sm border border-pink-800">
                <h2 className="text-pink-700 text-xl font-semibold mb-2">
                  ⚠️ Weaknesses
                </h2>
                <ReactMarkdown>
                  {Array.isArray(review.weaknesses)
                    ? review.weaknesses.join("\n")
                    : review.weaknesses || "No weaknesses found."}
                </ReactMarkdown>
              </section>

              <section className="bg-blue-1000 p-4 rounded-xl shadow-sm border border-blue-300">
                <h2 className="text-blue-700 text-xl font-semibold mb-2">
                  💡 Recommendations
                </h2>
                <ReactMarkdown>
                  {Array.isArray(review.recommendations)
                    ? review.recommendations.join("\n")
                    : review.recommendations || "No recommendations found."}
                </ReactMarkdown>
              </section>
            </div>
          ) : (
            <span className="text-gray-400 italic">
              📄 Upload your resume to generate a detailed review.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeReviewer;
