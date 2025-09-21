import React, { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  Heart,
  Brain,
  Clock,
  RefreshCw,
} from "lucide-react";

const ChatbotPage = () => {
  // Use a mock user for this client-side example
  const mockUser = { full_name: "User" };
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: `Hello ${
        mockUser.full_name.split(" ")[0]
      }! I'm MindBot, your AI mental health companion. I'm here to provide support, resources, and a listening ear whenever you need it. How are you feeling today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Gemini API Configuration
  const apiKey = "AIzaSyDmlhen-vlDdK9k6Wvp38h39qaiJBZ6hrI";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  const systemPrompt =
    "You are MindBot, an AI mental health companion. Your primary goal is to provide supportive, empathetic, and informative responses. You are not a medical professional. Always encourage users to seek help from a qualified professional for serious issues. Keep responses concise, compassionate, and helpful. Use a friendly and non-clinical tone.";

  // Sample conversation starters
  const conversationStarters = [
    "I'm feeling stressed about exams.",
    "How can I manage my anxiety?",
    "Tell me a positive affirmation.",
    "I'm struggling to get motivated.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageContent) => {
    if (messageContent.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    };

    // Add user message to the conversation
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Build the prompt history for Gemini
      const chatHistory = [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...messages.map((msg) => ({
          role: msg.type === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
        { role: "user", parts: [{ text: userMessage.content }] },
      ];

      const payload = {
        contents: chatHistory,
        tools: [{ google_search: {} }], // Use Google Search grounding
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const botResponseContent =
        result?.candidates?.[0]?.content?.parts?.[0]?.text;

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content:
          botResponseContent ||
          "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content: "I'm sorry, an error occurred. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const MessageBubble = ({ message }) => {
    const isBot = message.type === "bot";
    const bubbleClass = isBot
      ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start rounded-b-xl rounded-tr-xl"
      : "bg-purple-600 text-white self-end rounded-t-xl rounded-bl-xl";

    return (
      <div
        className={`flex items-start max-w-xs md:max-w-md my-2 ${
          isBot ? "" : "justify-end"
        }`}
      >
        {isBot && (
          <Bot className="w-6 h-6 mr-2 flex-shrink-0 text-purple-600" />
        )}
        <div className={`p-4 shadow-md ${bubbleClass}`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          <div
            className={`text-xs mt-2 ${
              isBot ? "text-gray-500 dark:text-gray-400" : "text-purple-200"
            } text-right`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        {!isBot && (
          <User className="w-6 h-6 ml-2 flex-shrink-0 text-gray-600 dark:text-gray-400" />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-4">MindBot</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Your AI mental health companion, here to help.
      </p>

      {/* Main Chatbot Interface */}
      <Card className="flex-1 flex flex-col max-w-4xl w-full mx-auto shadow-lg">
        <CardContent className="p-0 flex flex-col flex-1">
          {/* Message History */}
          <ScrollArea className="flex-1 p-4 md:p-6 space-y-4">
            {messages.map((msg, index) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-start max-w-xs md:max-w-md my-2">
                <Bot className="w-6 h-6 mr-2 flex-shrink-0 text-purple-600 animate-pulse" />
                <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-b-xl rounded-tr-xl shadow-md">
                  <span className="text-gray-800 dark:text-gray-200">
                    MindBot is typing...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Conversation Starters & Input */}
          <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2 mb-4">
              {conversationStarters.map((starter, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer text-sm py-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSendMessage(starter)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {starter}
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSendMessage(inputMessage)
                }
                className="flex-1 rounded-full px-6 py-2 border-none focus-visible:ring-purple-500"
                disabled={isTyping}
              />
              <Button
                type="button"
                className="rounded-full w-12 h-12 p-0 bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={() => handleSendMessage(inputMessage)}
                disabled={isTyping || inputMessage.trim() === ""}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="flex justify-center items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        <Card className="bg-gray-100 dark:bg-gray-800 border-none w-full max-w-4xl">
          <CardContent className="p-4 text-center flex flex-col md:flex-row items-center justify-center">
            <Heart className="w-6 h-6 text-red-500 mr-2 flex-shrink-0 mb-2 md:mb-0" />
            <p>
              MindBot is a supportive tool, not a substitute for professional
              medical advice. Always consult a qualified professional for your
              health concerns.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotPage;
