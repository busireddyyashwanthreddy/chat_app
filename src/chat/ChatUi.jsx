import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Users,
  Smile,
  Paperclip,
  MoreVertical,
  Search,
  Check,
  CheckCheck,
} from "lucide-react";

export default function ChatUi() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Yashwanth",
      text: "Hey everyone! How are you doing today?",
      timestamp: new Date(Date.now() - 3600000),
      avatar: "Y",
      status: "read",
      isSelf: false,
    },
    {
      id: 2,
      sender: "varshini",
      text: "Hi Alice! Doing great, thanks for asking!",
      timestamp: new Date(Date.now() - 3500000),
      avatar: "V",
      status: "read",
      isSelf: true,
    },
    {
      id: 3,
      sender: "Nihari",
      text: "Good morning team! Ready for today's meeting?",
      timestamp: new Date(Date.now() - 3000000),
      avatar: "N",
      status: "read",
      isSelf: false,
    },
    {
      id: 4,
      sender: "You",
      text: "Absolutely! I've prepared all the documents.",
      timestamp: new Date(Date.now() - 2500000),
      avatar: "Y",
      status: "delivered",
      isSelf: true,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, name: "Yashwanth Reddy", avatar: "Y", status: "online" },
    { id: 2, name: "Are Nihari", avatar: "A", status: "online" },
    { id: 3, name: "Varshini Vadana", avatar: "V", status: "offline" },
    { id: 4, name: "Nihari", avatar: "N", status: "offline" },
  ]);

  const [isTyping, setIsTyping] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(true);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      const randomUsers = ["Yashwanth", "Nihari", "Varshini"];
      const randomMessages = [
        "That sounds great!",
        "I agree with that approach.",
        "Let me check on that.",
        "Thanks for the update!",
        "Will do!",
        "Perfect timing!",
      ];

      if (Math.random() > 0.7) {
        const randomUser =
          randomUsers[Math.floor(Math.random() * randomUsers.length)];
        const randomMessage =
          randomMessages[Math.floor(Math.random() * randomMessages.length)];

        simulateIncomingMessage(randomUser, randomMessage);
      }
    }, 10000);

    return () => {
      clearInterval(messageInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateIncomingMessage = (sender, text) => {
    const userInitials = sender
      .split(" ")
      .map((n) => n[0])
      .join("");
    setIsTyping({ name: sender, avatar: userInitials });

    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        sender,
        text,
        timestamp: new Date(),
        avatar: userInitials,
        status: "delivered",
        isSelf: false,
      };

      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(null);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "read" } : msg
          )
        );
      }, 2000);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: "You",
        text: inputMessage,
        timestamp: new Date(),
        avatar: "YR",
        status: "sent",
        isSelf: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "read" } : msg
          )
        );
      }, 3000);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // Typing stopped
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? "Just now" : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div
        className={`${
          showUserList ? "w-80" : "w-0"
        } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users size={24} />
            Online Users (
            {onlineUsers.filter((u) => u.status === "online").length})
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {onlineUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                      user.status
                    )}`}
                  ></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Team Chat</h1>
                <p className="text-sm text-gray-500">
                  {onlineUsers.filter((u) => u.status === "online").length}{" "}
                  members online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isSelf ? "justify-end" : "justify-start"
              } animate-fadeIn`}
            >
              <div
                className={`flex gap-3 max-w-2xl ${
                  message.isSelf ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      message.isSelf
                        ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                        : "bg-gradient-to-br from-pink-500 to-orange-500"
                    }`}
                  >
                    {message.avatar}
                  </div>
                </div>

                <div
                  className={`flex flex-col ${
                    message.isSelf ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-md ${
                      message.isSelf
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {!message.isSelf && (
                      <p className="text-xs font-semibold mb-1 text-indigo-600">
                        {message.sender}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-2">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    {message.isSelf && (
                      <span className="text-xs">
                        {message.status === "sent" && (
                          <Check size={14} className="text-gray-400" />
                        )}
                        {message.status === "delivered" && (
                          <CheckCheck size={14} className="text-gray-400" />
                        )}
                        {message.status === "read" && (
                          <CheckCheck size={14} className="text-indigo-600" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-fadeIn">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
                {isTyping.avatar}
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-md">
                <p className="text-xs font-semibold mb-1 text-indigo-600">
                  {isTyping.name}
                </p>
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Paperclip size={24} className="text-gray-600" />
            </button>

            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Smile size={24} className="text-gray-600" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputMessage.trim()}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}
