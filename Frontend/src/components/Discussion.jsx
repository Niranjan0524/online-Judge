import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiThumbsDown,
  FiThumbsUp,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../store/AuthContext";

const Discussion = ({ problemId }) => {
  const { token, user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  const fetchDiscussions = async () => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/discussion/getAllDiscussions/${problemId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
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

  const fetchMessages = async (discussionId) => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/discussion/getAllMessages/${discussionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
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

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscussionTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    setLoading(true);
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
      .then(async (res) => {
        const data = await res.json();

        if (res.status !== 201) {
          toast.error(data.message || "Failed to create discussion");
          console.error(
            "Error creating discussion:",
            data.message || "Failed to create discussion"
          );
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

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    setMsgLoading(true);

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
      .then(async (res) => {
        const data = await res.json();
        if (res.status !== 201) {
          console.error(
            "Error adding message:",
            data.message || "Failed to add message"
          );
          toast.error(data.message || "Failed to add message");
          return;
        }
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

  const handleLike = (messageId) => {
    if (!messageId) {
      toast.error("Message ID is required to like a message");
      return;
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/discussion/likeMessage/${messageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: user._id }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status !== 200) {
          console.error("Error liking message:", data.message || "Failed to like message");
          toast.error(data.message || "Failed to like message");
          return;
        }
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? { ...msg, likes: data.likes, dislikes: data.dislikes }
              : msg
          )
        );
      })
      .catch((err) => {
        console.error("Error liking message:", err);
      });
  };

  const handleDislike = (messageId) => {
    if (!messageId) {
      toast.error("Message ID is required to dislike a message");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/discussion/dislikeMessage/${messageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: user._id }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status !== 200) {
          console.error("Error disliking message:", data.message || "Failed to dislike message");
          toast.error(data.message || "Failed to dislike message");
          return;
        }
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? { ...msg, dislikes: data.dislikes, likes: data.likes }
              : msg
          )
        );
      })
      .catch((err) => {
        console.error("Error disliking message:", err);
      });
  };

  const handleDelete = async (messageId) => {
    if (!messageId) {
      toast.error("Message ID is required to delete a message");
      return;
    }

    const deleteLoader = toast.loading("Deleting message...");
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/discussion/deleteMessage/${messageId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.status !== 200) {
          console.error("Error deleting message:", data.message || "Failed to delete message");
          toast.error(data.message || "Failed to delete message");
          return;
        }

        setMessages(data.remainingMessages || []);
        toast.success("Message deleted successfully");
      })
      .catch((err) => {
        setMessages([]);
        console.error("Error deleting message:", err);
        toast.error("Failed to delete message");
      })
      .finally(() => {
        toast.dismiss(deleteLoader);
      });
  };

  return (
    <div className="min-h-[500px] rounded-2xl border border-vibe-border bg-vibe-surface p-4 text-vibe-text shadow-panel sm:p-5">
      <div className="mb-5 flex items-center gap-2">
        <FiMessageSquare className="text-vibe-primary" size={20} />
        <h2 className="font-heading text-xl font-semibold">Discussions</h2>
      </div>

      <form
        className="mb-6 rounded-2xl border border-vibe-border bg-vibe-background p-4"
        onSubmit={handleCreateDiscussion}
      >
        <label className="block text-sm font-medium text-vibe-subtext">
          Start a new discussion
        </label>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            className="min-w-0 flex-1 rounded-xl border border-vibe-border bg-vibe-surface px-3 py-2.5 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/60 focus:border-vibe-primary"
            type="text"
            placeholder="Discussion title..."
            value={newDiscussionTitle}
            onChange={(e) => setNewDiscussionTitle(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-vibe-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            <FiPlus size={15} />
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      <div className="mb-6">
        <div className="mb-3 text-sm font-semibold text-vibe-text">
          All Discussions
        </div>
        {discussions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-vibe-border bg-vibe-background p-6 text-center text-sm text-vibe-subtext">
            No discussions yet.
          </div>
        ) : (
          <div className="space-y-2">
            {discussions.map((d) => (
              <button
                key={d._id}
                className={`w-full rounded-xl border px-4 py-3 text-left ${
                  selectedDiscussion && selectedDiscussion._id === d._id
                    ? "border-vibe-primary bg-vibe-primary/10"
                    : "border-vibe-border bg-vibe-background hover:border-vibe-primary/60 hover:bg-vibe-elevated"
                }`}
                onClick={() => setSelectedDiscussion(d)}
                type="button"
              >
                <div className="font-semibold text-vibe-text">{d.title}</div>
                <div className="mt-1 text-xs text-vibe-muted">
                  {new Date(d.createdAt).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedDiscussion && (
        <section className="rounded-2xl border border-vibe-border bg-vibe-background p-4">
          <div className="font-heading text-lg font-semibold text-vibe-text">
            {selectedDiscussion.title}
          </div>
          <div className="mb-4 mt-1 text-sm text-vibe-subtext">Messages</div>

          <div className="mb-4 max-h-72 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="rounded-xl border border-dashed border-vibe-border p-6 text-center text-sm text-vibe-subtext">
                No messages yet.
              </div>
            ) : (
              messages.map((msg) => (
                <article
                  key={msg._id}
                  className="rounded-xl border border-vibe-border bg-vibe-surface p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vibe-primary/10 text-vibe-primary">
                      <FiUser size={16} />
                    </span>
                    <span className="font-semibold text-vibe-text">
                      {msg.userId === user._id ? "You" : msg.username || "Anonymous"}
                    </span>
                  </div>
                  <p className="ml-10 whitespace-pre-wrap text-sm leading-6 text-vibe-subtext">
                    {msg.message}
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        className={`inline-flex items-center gap-1 text-sm ${
                          msg.likes?.includes(user._id)
                            ? "text-vibe-primary"
                            : "text-vibe-muted hover:text-vibe-primary"
                        }`}
                        onClick={() => handleLike(msg._id)}
                        title="Like"
                        type="button"
                      >
                        <FiThumbsUp size={16} />
                        {msg.likes?.length || 0}
                      </button>
                      <button
                        className={`inline-flex items-center gap-1 text-sm ${
                          msg.dislikes?.includes(user._id)
                            ? "text-vibe-danger"
                            : "text-vibe-muted hover:text-vibe-danger"
                        }`}
                        onClick={() => handleDislike(msg._id)}
                        title="Dislike"
                        type="button"
                      >
                        <FiThumbsDown size={16} />
                        {msg.dislikes?.length || 0}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-vibe-muted">
                      {new Date(msg.createdAt).toLocaleString()}
                      {user?._id === msg.userId && (
                        <button
                          className="text-vibe-muted hover:text-vibe-danger"
                          onClick={() => handleDelete(msg._id)}
                          title="Delete"
                          type="button"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleAddMessage}>
            <input
              className="min-w-0 flex-1 rounded-xl border border-vibe-border bg-vibe-surface px-3 py-2.5 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/60 focus:border-vibe-primary"
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={msgLoading}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-vibe-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={msgLoading}
            >
              <FiSend size={15} />
              {msgLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default Discussion;
