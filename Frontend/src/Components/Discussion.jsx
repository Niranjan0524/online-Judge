import { useState, useEffect } from "react";
import { useAuth } from "../store/authContext";
import { toast } from "react-hot-toast";
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaTrashAlt,
  FaUserCircle,
} from "react-icons/fa";
import { AiTwotoneDislike } from "react-icons/ai";
import { AiTwotoneLike } from "react-icons/ai";

const Discussion = ({ problemId }) => {
  const { token ,user} = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  



  // Fetch all discussions for this problem
  const fetchDiscussions = async () => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/discussion/getAllDiscussions/${problemId}`,
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

  // Fetch all messages for a discussion
  const fetchMessages = async (discussionId) => {
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/discussion/getAllMessages/${discussionId}`,
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

  // Handle new discussion creation
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

  // Handle new message creation
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
    console.log("Like clicked for message:", messageId);
   

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
            msg._id === messageId ? { ...msg, likes: data.likes, dislikes: data.dislikes } : msg
          )
        );
    
      })
      .catch((err) => {
        console.error("Error liking message:", err);
       
      });
  }

  const handleDislike=(messageId)=>{
    console.log("Dislike clicked for message:", messageId);
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
            msg._id === messageId ? { ...msg, dislikes: data.dislikes, likes: data.likes } : msg
          )
        );
        
      })
      .catch((err) => {
        console.error("Error disliking message:", err);
       
      });
  }

  const handleDelete=async(messageId)=>{ 
    console.log("Delete clicked for message:", messageId);

    if(!messageId){
      toast.error("Message ID is required to delete a message");
      return;
    }

    const deleteLoader=toast.loading("Deleting message...");
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/discussion/deleteMessage/${messageId}`, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      }
    })
    .then(async(res)=>{
      const data=await res.json();

      if(res.status!==200){
        console.error("Error deleting message:", data.message || "Failed to delete message");
        toast.error(data.message || "Failed to delete message");
        return;
      }

      setMessages(data.remainingMessages || []);
      toast.success("Message deleted successfully");
    })
    .catch((err)=>{
      setMessages([]);
      console.error("Error deleting message:", err);
      toast.error("Failed to delete message");
    })
    .finally(()=>{
      toast.dismiss(deleteLoader);
    });
  }


  return (
    <div className="bg-gray-800/80 text-gray-100 rounded-2xl p-8 max-w-3xl mx-auto shadow-xl min-h-[500px] border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 tracking-wide text-blue-400">
        Discussions
      </h2>

      {/* New Discussion */}
      <form
        className="mb-8 bg-gray-800/80 rounded-xl p-4 border border-gray-700 shadow"
        onSubmit={handleCreateDiscussion}
      >
        <label className="block mb-2 font-semibold text-blue-300">
          Start a new discussion
        </label>
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder="Discussion title..."
            value={newDiscussionTitle}
            onChange={(e) => setNewDiscussionTitle(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2 rounded-md font-semibold transition"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>

      {/* Discussions List */}
      <div className="mb-8">
        <div className="mb-2 text-lg font-semibold text-blue-300">
          All Discussions
        </div>
        {discussions.length === 0 ? (
          <div className="text-gray-400 italic">No discussions yet.</div>
        ) : (
          <div className="space-y-2">
            {discussions.map((d) => (
              <div
                key={d._id}
                className={`cursor-pointer bg-gray-800/80 rounded-xl px-4 py-3 border transition shadow hover:shadow-lg ${
                  selectedDiscussion && selectedDiscussion._id === d._id
                    ? "border-indigo-500 bg-gray-900/80 text-gray-100"
                    : "border-gray-700 hover:bg-gray-700/50 hover:text-gray-100"
                }`}
                onClick={() => setSelectedDiscussion(d)}
              >
                <div className="font-semibold text-gray-100">{d.title}</div>
                <div className="text-xs text-gray-400">
                  {new Date(d.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages Section */}
      {selectedDiscussion && (
        <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700 mt-4 shadow">
          <div className="mb-2 font-semibold text-lg text-indigo-300">
            {selectedDiscussion.title}
          </div>
          <div className="mb-4 text-sm text-gray-400">Messages</div>

          <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
            {messages.length === 0 ? (
              <div className="text-gray-400 italic">No messages yet.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className="bg-gray-900/80 rounded-md px-3 py-2 border border-gray-700 flex flex-col"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-1">
                    {/* Avatar */}
                    <FaUserCircle className="text-2xl text-indigo-400" />
                    {/* Username */}
                    <span className="font-semibold text-gray-200">
                      {msg.userId === user._id
                        ? "You"
                        : msg.username || "Anonymous"}
                    </span>
                  </div>
                  {/* Message */}
                  <div className="text-gray-200 mb-2 ml-8">{msg.message}</div>
                  {/* Footer: Like/Unlike/Delete */}
                  <div className="flex items-center justify-between mt-2 px-1">
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-1 text-gray-400 hover:text-indigo-400 transition"
                        onClick={() => handleLike(msg._id)}
                        title="Like"
                      >
                        {msg.likes?.includes(user._id) ? (
                          <AiTwotoneLike
                            className="text-indigo-400"
                            size={20}
                          />
                        ) : (
                          <FaRegThumbsUp />
                        )}
                        <span className="text-xs">
                          {msg.likes?.length || 0}
                        </span>
                      </button>
                      <button
                        className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition"
                        onClick={() => handleDislike(msg._id)}
                        title="Dislike"
                      >
                        {msg.dislikes?.includes(user._id) ? (
                          <AiTwotoneDislike
                            className="text-indigo-400"
                            size={20}
                          />
                        ) : (
                          <FaRegThumbsDown />
                        )}
                        <span className="text-xs">
                          {msg.dislikes?.length || 0}
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                      {user?._id === msg.userId && (
                        <>
                          <button
                            className="text-gray-400 hover:text-red-500 transition"
                            onClick={() => handleDelete(msg._id)}
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* New Message */}
          <form className="flex gap-2" onSubmit={handleAddMessage}>
            <input
              className="flex-1 px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
