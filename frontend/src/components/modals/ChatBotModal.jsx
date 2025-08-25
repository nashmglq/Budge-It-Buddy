import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { X, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown"; // 👈 Markdown renderer

export const ChatBotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! I'm Buddy. How can I help you with your finances today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Fetch chat history ---
  useEffect(() => {
    if (isOpen && messages.length <= 1) {
      const fetchHistory = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const response = await axios.get(
            "http://localhost:5001/api/chatbot/getChat",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const historyFromDB = response.data.success.map((msg) => ({
            role: msg.isAI ? "model" : "user",
            text: msg.message,
          }));

          setMessages((prev) => [prev[0], ...historyFromDB]);
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        }
      };

      fetchHistory();
    }
  }, [isOpen, messages.length]);

  // --- Auto scroll ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Handle new message ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      const response = await axios.post(
        "http://localhost:5001/api/chatbot/summary",
        { userMessage: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = { role: "model", text: response.data.success };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      const errorMessage = {
        role: "model",
        text:
          error.response?.data?.error ||
          "Sorry, I'm having trouble connecting right now.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    setMessages([
      {
        role: "model",
        text: "Hello! I'm Buddy. How can I help you with your finances today?",
      },
    ]);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

    await axios.delete("http://localhost:5001/api/chatbot/delete", {
      headers: { Authorization: `Bearer ${token}` },
    });
    } catch (error) {
      console.error("Failed to clear chat history:", error);
    }
  };


  if (!isOpen) return null;

  return (

    <div className="fixed bottom-20 right-4 sm:right-10 w-full max-w-sm bg-white rounded-lg shadow-xl z-40 flex flex-col max-h-[70vh] border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
        <h2 className="font-semibold">Chat with Buddy</h2>
        <div className="flex gap-2">
          <button
            onClick={handleClearHistory}
            className="p-1 rounded-full hover:bg-blue-600"
            title="Clear history"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-blue-600"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg whitespace-pre-wrap shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {/* 👇 Markdown rendering with list + bold support */}
              <ReactMarkdown
                components={{
                  li: ({ children }) => (
                    <li className="list-disc list-inside">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold">{children}</strong>
                  ),
                  p: ({ children }) => <p className="mb-1">{children}</p>,
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <p className="max-w-lg p-3 rounded-lg bg-white text-gray-500 italic shadow-sm">
              Buddy is typing...
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200 rounded-b-lg">
        <form className="flex space-x-2" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Buddy..."
            disabled={isLoading}
            className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
