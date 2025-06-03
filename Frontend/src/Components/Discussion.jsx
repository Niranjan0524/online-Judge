import { useState, useEffect } from "react";
import { useAuth } from "../store/authContext";
import { toast } from "react-hot-toast";

const Discussion = ({ problemId }) => {
  const { token} = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  // Fetch all discussions for this problem
  const fetchDiscussions = async () => {
    // TODO: Implement API call to fetch discussions

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/discussion/getAllDiscussions/${problemId}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "No discussions found for this problem") {
          setDiscussions([]);
        } else {
          setDiscussions(data.discussions);
        }
      })
      .catch((err) => {
        setDiscussions([]);
        console.error("Error fetching discussions:", err);
        toast.error("Failed to fetch discussions");
      });
  };

  // Fetch all messages for a discussion
  const fetchMessages = async (discussionId) => {
    // TODO: Implement API call to fetch messages
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/discussion/getAllMessages/${discussionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
      })
      .catch((err) => {
        setMessages([]);
        console.error("Error fetching messages:", err);
        toast.error("Failed to fetch messages");
      });
  };

  useEffect(() => {
    fetchDiscussions();
    setSelectedDiscussion(null);
    setMessages([]);
  }, [problemId]);

  useEffect(() => {
    if (selectedDiscussion) {
      fetchMessages(selectedDiscussion._id);
    } else {
      setMessages([]);
    }
  }, [selectedDiscussion]);

  // Handle new discussion creation
  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscussionTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    setLoading(true);
    // TODO: Implement API call to create discussion
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/discussion/newDiscussion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newDiscussionTitle,
        problemId,
      }),
    })
      .then(async (res)=>{
        const data= await res.json();

        if( res.status !== 201) {
          toast.error(data.message || "Failed to create discussion");
          console.error("Error creating discussion:", data.message || "Failed to create discussion");
          return;
        }
        setDiscussions([...discussions, data.discussion]);
        setSelectedDiscussion(data.discussion);
      })
      .catch((err) => {
        setLoading(false);
        setNewDiscussionTitle("");
        console.error("Error creating discussion:", err);
        toast.error("Failed to create discussion");
      })
      .finally(() => {
        setNewDiscussionTitle("");
        setLoading(false);
      });
   
  };

  // Handle new message creation
  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    setMsgLoading(true);
    // TODO: Implement API call to add message

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/discussion/newMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: newMessage,
        discussionId: selectedDiscussion._id,
      }),
    })
    .then(async(res)=>{
      const data = await res.json();
      if (res.status !== 201) {
        console.error("Error adding message:", data.message || "Failed to add message");
        toast.error(data.message || "Failed to add message");
        return;
      }
      // Assuming the API returns the new message
      setMessages([...messages, data.newMessage]);
    })
    .catch((err) => {
      setMessages([]);
      console.error("Error adding message:", err);
      toast.error("Failed to add message");
    })
    .finally(() => {
      setNewMessage("");
      setMsgLoading(false);
    });
  };

  return (
    <div className="bg-zinc-900/90 text-zinc-100 rounded-2xl p-8 max-w-3xl mx-auto shadow-xl min-h-[500px] border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 tracking-wide text-indigo-400">
        Discussions
      </h2>

      {/* New Discussion */}
      <form
        className="mb-8 bg-zinc-800/80 rounded-xl p-4 border border-zinc-700 shadow"
        onSubmit={handleCreateDiscussion}
      >
        <label className="block mb-2 font-semibold text-indigo-300">
          Start a new discussion
        </label>
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder="Discussion title..."
            value={newDiscussionTitle}
            onChange={(e) => setNewDiscussionTitle(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4 py-2 rounded-md font-semibold transition"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      {/* Discussions List */}
      <div className="mb-8">
        <div className="mb-2 text-lg font-semibold text-indigo-300">
          All Discussions
        </div>
        {discussions.length === 0 ? (
          <div className="text-zinc-400 italic">No discussions yet.</div>
        ) : (
          <div className="space-y-2">
            {discussions.map((d) => (
              <div
                key={d._id}
                className={`cursor-pointer bg-zinc-800/80 rounded-lg px-4 py-3 border transition shadow ${
                  selectedDiscussion && selectedDiscussion._id === d._id
                    ? "border-indigo-500 bg-zinc-900/80"
                    : "border-zinc-700 hover:bg-zinc-700/80"
                }`}
                onClick={() => setSelectedDiscussion(d)}
              >
                <div className="font-medium text-zinc-100">{d.title}</div>
                <div className="text-xs text-zinc-400">
                  {new Date(d.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages Section */}
      {selectedDiscussion && (
        <div className="bg-zinc-800/80 rounded-xl p-4 border border-zinc-700 mt-4 shadow">
          <div className="mb-2 font-semibold text-lg text-indigo-300">
            {selectedDiscussion.title}
          </div>
          <div className="mb-4 text-sm text-zinc-400">Messages</div>
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
            {messages.length === 0 ? (
              <div className="text-zinc-400 italic">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className="bg-zinc-900/80 rounded-md px-3 py-2 border border-zinc-700"
                >
                  <div className="text-zinc-200">{msg.message}</div>
                  <div className="text-xs text-zinc-500 mt-1 flex justify-between">
                    <span>{msg.userId?.username || "User"}</span>
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* New Message */}
          <form className="flex gap-2" onSubmit={handleAddMessage}>
            <input
              className="flex-1 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={msgLoading}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4 py-2 rounded-md font-semibold transition"
              disabled={msgLoading}
            >
              {msgLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Discussion;
