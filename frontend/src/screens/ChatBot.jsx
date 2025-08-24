import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// A simple, self-contained chatbot component
function ChatBot() {
  // --- STATE MANAGEMENT ---
  // Manages the list of messages, the user's input, and the loading status
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! I'm Buddy. How can I help you with your finances today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // Used for auto-scrolling

  // --- LOGIC ---

  // 1. Fetch chat history when the component first loads
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // Don't fetch if the user isn't logged in

        // API call to your backend to get past messages
        const response = await axios.get(
          "http://localhost:5001/api/chatbot/getChat",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Format the data from the DB to match our state's structure
        const historyFromDB = response.data.success.map((msg) => ({
          role: msg.isAI ? "model" : "user",
          text: msg.message,
        }));

        // Add the loaded history to the current messages
        setMessages((prev) => [prev[0], ...historyFromDB]);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchHistory();
  }, []); // The empty array [] ensures this runs only once on load

  // 2. Automatically scroll to the bottom whenever a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Handle the form submission when a user sends a message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return; // Prevent sending empty or multiple messages

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]); // Add user's message to UI immediately
    setInput(""); // Clear the input field
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");

      // Send the user's message to the backend AI
      const response = await axios.post(
        "http://localhost:5001/api/chatbot/summary",
        { userMessage: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // CORRECTED: Changed 'reply' to 'success' to match your backend's response
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
      setIsLoading(false); // Stop the loading indicator
    }
  };

  // --- UI (THE VISUAL PART) ---
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`max-w-lg p-3 rounded-lg whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 shadow rounded-bl-none"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <p className="max-w-lg p-3 rounded-lg bg-white text-gray-500 italic shadow">
              Buddy is typing...
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form className="flex space-x-4" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Buddy a question..."
            disabled={isLoading}
            className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 disabled:bg-blue-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
