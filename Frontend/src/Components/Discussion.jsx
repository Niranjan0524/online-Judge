import { useState, useEffect } from "react";
import { useAuth } from "../store/authContext";
import { toast } from "react-hot-toast";

const Discussion = ({ problemId }) => {
  const { token } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadLoading, setNewThreadLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [postingMessage, setPostingMessage] = useState(false);

  useEffect(() => {
    setLoadingThreads(true);
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/discussion/getAllDiscussions/${problemId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setThreads(data.discussions || []);
        setLoadingThreads(false);
      })
      .catch(() => setLoadingThreads(false));
  }, [problemId, token]);

  useEffect(() => {
    if (!selectedThread) return;
    setLoadingMessages(true);
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/message/getAllMessages/${
        selectedThread._id
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setLoadingMessages(false);
      })
      .catch(() => setLoadingMessages(false));
  }, [selectedThread]);

  const handleCreateThread = async () => {
    console.log("Creating thread with title:", newThreadTitle);
    if (!newThreadTitle.trim()) return;

    setNewThreadLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/discussion/newDiscussion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ problemId, title: newThreadTitle }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setThreads([data.discussion, ...threads]);
        setSelectedThread(data.discussion); // Select the new thread automatically
        setNewThreadTitle("");
        toast.success("Thread created successfully!");
      } else {
        toast.error(data.message || "Failed to create thread.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setNewThreadLoading(false);
    }
  };


  const handlePostMessage = async () => {
    console.log("Posting message:", newMessage);
    if (!newMessage.trim() || !selectedThread) return;
    setPostingMessage(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/newMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            discussionId: selectedThread._id,
            message: newMessage,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessages([...messages, data.message]);
        setNewMessage("");
        toast.success("Message posted!");
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (error) {
      toast.error("Failed to post message. Please try again.");
    } finally {
      setPostingMessage(false);
    }
  };

 

  return (
    <div className="flex flex-col md:flex-row gap-8 bg-gradient-to-br from-[#181f2e] to-[#232b3e] rounded-2xl shadow-2xl p-8 border border-[#2a3447] min-h-[500px]">
      {/* Thread List */}
      <div className="md:w-1/3 w-full">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 tracking-tight">
          Discussions
        </h2>
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 bg-gray-900 text-gray-100 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="Start a new thread..."
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            maxLength={80}
          />
          <button
            className={`px-4 py-2 rounded-lg font-semibold shadow transition-all duration-150 min-w-[80px] flex items-center justify-center
          ${
            newThreadLoading
              ? "bg-yellow-300 text-gray-700 opacity-70 cursor-not-allowed"
              : !newThreadTitle.trim()
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 to-red-700 text-white hover:scale-105 hover:shadow-lg"
          }`}
            onClick={handleCreateThread}
            disabled={newThreadLoading || !newThreadTitle.trim()}
          >
            {newThreadLoading ? "Creating..." : "Create"}
          </button>
        </div>
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
          {loadingThreads ? (
            <div className="flex justify-center py-8 text-gray-400">
              Loading threads...
            </div>
          ) : threads.length === 0 ? (
            <div className="text-gray-400 italic text-center">
              No threads yet.
              <br />
              Be the first to start a discussion!
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread._id}
                className={`p-4 rounded-xl mb-3 cursor-pointer border-2 transition-all shadow-sm group
              ${
                selectedThread?._id === thread._id
                  ? "bg-yellow-900/90 border-yellow-400 text-yellow-100 scale-[1.03]"
                  : "bg-gray-900 border-gray-700 text-gray-100 hover:bg-yellow-900/60 hover:border-yellow-400"
              }`}
                onClick={() => setSelectedThread(thread)}
              >
                <div className="font-semibold text-lg truncate flex items-center gap-2">
                  <span>{thread.title}</span>
                  {selectedThread?._id === thread._id && (
                    <span className="ml-1 text-yellow-400 text-xs font-bold">
                      ●
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  By {thread.createdBy?.name || "User"} •{" "}
                  {thread.messageCount || 0} messages
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages in Selected Thread */}
      <div className="md:w-2/3 w-full flex flex-col">
        {selectedThread ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold text-blue-300 truncate max-w-[70%]">
                {selectedThread.title}
              </h3>
              <span className="text-xs text-gray-400 truncate">
                Started by {selectedThread.createdBy?.name || "User"}
              </span>
            </div>
            <div className="flex-1 bg-gray-900/95 rounded-2xl border border-gray-700 p-6 mb-3 overflow-y-auto max-h-[350px] custom-scrollbar">
              {loadingMessages ? (
                <div className="flex justify-center py-8 text-gray-400">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-gray-400 italic text-center">
                  No messages yet.
                  <br />
                  Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id} className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-yellow-300">
                        {msg.user?.name || "User"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-gray-800 rounded-lg px-4 py-2 text-gray-100 font-mono shadow">
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Message input */}
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 bg-gray-800 text-gray-100 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                maxLength={500}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && newMessage.trim()) {
                    e.preventDefault();
                    handlePostMessage();
                  }
                }}
              />
              <button
                className={`px-4 py-2 rounded-lg font-semibold shadow transition-all duration-150 min-w-[80px] flex items-center justify-center
              ${
                postingMessage
                  ? "bg-blue-300 text-gray-700 opacity-70 cursor-not-allowed"
                  : !newMessage.trim()
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-400 to-blue-700 text-white hover:scale-105 hover:shadow-lg"
              }`}
                onClick={handlePostMessage}
                disabled={postingMessage || !newMessage.trim()}
              >
                {postingMessage ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 italic text-lg">
            <span className="mb-2">Select a thread to view messages.</span>
            <span className="text-3xl">💬</span>
          </div>
        )}
      </div>
      <style>
        {`
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #2a3447;
      border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #1a2233;
      border-radius: 8px;
    }
    `}
      </style>

    </div>
  );
};

export default Discussion;
