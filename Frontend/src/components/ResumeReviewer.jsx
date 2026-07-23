import { useRef, useState } from "react";
import { Circles } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { FiCheckCircle, FiFileText, FiUpload, FiXCircle } from "react-icons/fi";

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
    const formData = new FormData();
    formData.append("resume", resumeFile);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      toast.error("You need to be logged in to upload a resume.");
      return;
    }

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/resume/getReview`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const hasReview = review && typeof review === "object" && Object.keys(review).length > 0;

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
            AI Review
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-vibe-text">
            Resume Reviewer
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-vibe-subtext">
            Upload a PDF or DOCX resume and get structured feedback on strengths,
            weaknesses, and practical improvements.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-4 py-3 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
              onClick={() => fileInputRef?.current.click()}
              type="button"
            >
              <FiFileText size={16} />
              {resumeFile ? "Change Resume" : "Choose Resume"}
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-3 text-sm font-semibold text-white hover:bg-vibe-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleUpload}
              disabled={hasReview || !resumeFile || loading}
              type="button"
            >
              {loading ? (
                <>
                  <Circles height="18" width="18" color="#fff" visible={true} />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload size={16} />
                  Upload & Get Review
                </>
              )}
            </button>
          </div>

          {resumeFile && (
            <div className="mt-4 rounded-xl border border-vibe-border bg-vibe-background px-4 py-3 font-mono text-xs text-vibe-subtext">
              Selected: {resumeFile.name}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel sm:p-8">
          <h2 className="font-heading text-2xl font-semibold text-vibe-text">
            AI-Powered Resume Review
          </h2>

          <div className="mt-5 min-h-40 rounded-2xl border border-vibe-border bg-vibe-background p-5">
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-vibe-subtext">
                <Circles height="20" width="20" color="#6366F1" visible={true} />
                Analyzing your resume...
              </div>
            ) : hasReview ? (
              <div className="grid gap-4 lg:grid-cols-3">
                <ReviewSection
                  title="Strengths"
                  icon={FiCheckCircle}
                  tone="success"
                  content={review.strengths || "No strengths found."}
                />
                <ReviewSection
                  title="Weaknesses"
                  icon={FiXCircle}
                  tone="danger"
                  content={review.weaknesses || "No weaknesses found."}
                />
                <ReviewSection
                  title="Recommendations"
                  icon={FiUpload}
                  tone="primary"
                  content={review.recommendations || "No recommendations found."}
                />
              </div>
            ) : (
              <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-vibe-border text-center text-sm text-vibe-subtext">
                Upload your resume to generate a detailed review.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const ReviewSection = ({ title, icon: Icon, tone, content }) => {
  const toneClass = {
    success: "text-vibe-success border-vibe-success/30 bg-vibe-success/10",
    danger: "text-vibe-danger border-vibe-danger/30 bg-vibe-danger/10",
    primary: "text-vibe-primary border-vibe-primary/30 bg-vibe-primary/10",
  }[tone];

  return (
    <article className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="mb-3 flex items-center gap-2 font-semibold">
        <Icon size={17} />
        {title}
      </div>
      <div className="prose prose-invert max-w-none text-sm leading-7 text-vibe-subtext">
        <ReactMarkdown>
          {Array.isArray(content) ? content.join("\n") : content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default ResumeReviewer;
