"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaImage, FaMicrophone, FaUserCircle, FaTrash } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { motion } from "framer-motion";
import { checkAPIs, summarizeText, translateText } from "@/apiService";

const languages = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  ru: "Russian",
  tr: "Turkish",
  fr: "French",
};

function Page({}) {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatorAvailable, setTranslatorAvailable] = useState(false);
  const [detectorAvailable, setDetectorAvailable] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const { translatorAvailable, detectorAvailable } = await checkAPIs();
        setTranslatorAvailable(translatorAvailable);
        setDetectorAvailable(detectorAvailable);
      } catch (error) {
        showError("Error checking API availability.");
      }
    };
    fetchAPIs();
  }, []);

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;
    setMessages((prev) => [
      ...prev,
      { text: inputText, type: "input", language: detectedLanguage },
    ]);
    setSelectedLanguage("en");
    setShowGreeting(false);
    setSelectedLanguage("en");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const detectedLang = await detectLanguage(text);
      setDetectedLanguage(detectedLang);
    } catch {
      showError("Error detecting language.");
    }
  };

  const handleSummarize = async (text) => {
    setIsSummarizing(true);
    try {
      const summary = await summarizeText(text);
      if (summary) {
        setMessages((prev) => [
          ...prev,
          { text: `Summary: ${summary}`, type: "summary" },
        ]);
      } else {
        showError("Summarization returned an empty response.");
      }
    } catch {
      showError("Error summarizing text.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleTranslate = async (index) => {
    if (!translatorAvailable) return;
    const message = messages[index];

    try {
      const translatedText = await translateText(
        message.text,
        message.language,
        selectedLanguage
      );
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === index ? { ...msg, translation: { text: translatedText } } : msg
        )
      );
    } catch {
      showError("Error translating text.");
    }
  };

  const detectLanguage = async (text) => {
    if (!detectorAvailable || !text) return;
    setIsDetecting(true);
    setError(null);
    try {
      const detector = await self.ai.languageDetector.create();
      const results = await detector.detect(text);
      setDetectedLanguage(
        results.length > 0 ? results[0].detectedLanguage : null
      );
    } catch (error) {
      showError("Error detecting language. Please try again.");
      setDetectedLanguage(null);
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    setSelectedLanguage("en");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col">
      <div className="flex-1 relative">
        {/* Header */}
        <div className="flex items-center justify-between text-xl md-px-16 py-5 px-6 text-slate-700 shadow-sm bg-[#d6e8ff]">
          <p className="text-2xl font-bold text-stone-900">
            HelpMeet Processor
          </p>
          <FaUserCircle className="text-4xl" />
        </div>

        {/* Error Message Box */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-5 py-3 rounded-lg shadow-lg text-center text-sm font-medium max-w-[400px] animate-fadeOut"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Greeting */}
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col justify-center items-center text-center"
          >
            <p className="text-[46px] text-slate-500 font-semibold">
              <span className="bg-gradient-to-r from-[#368ddd] to-[#ff5546] bg-clip-text text-transparent">
                Hello, Mary.
              </span>
            </p>
            <p className="text-slate-400">How can I help you today?</p>
          </motion.div>
        )}

        {/* Messages Container */}
        <div
          ref={messagesEndRef}
          className="mt-7 space-y-2 mx-auto h-[calc(100vh-250px)] overflow-y-auto px-4 scrollbar-hide max-w-[600px] w-full"
        >
          {messages.map((message, index) => {
            const wordCount = message.text.split(/\s+/).length;
            const shouldShowSummarize =
              message.type === "input" &&
              message.language === "en" &&
              wordCount > 150;
            const isLatestMessage = index === messages.length - 1;

            return (
              <div key={index} className="p-4 rounded-lg bg-gray-100 shadow-sm">
                <p>{message.text}</p>
                {message.language && (
                  <p className="text-sm text-gray-500">
                    Detected: {languages[message.language] || message.language}
                  </p>
                )}
                {message.translation && (
                  <p className="text-sm text-blue-500 mt-2">
                    {message.translation.text}
                  </p>
                )}

                {isLatestMessage && (
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="p-1 border rounded shadow-sm"
                    >
                      {Object.entries(languages).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleTranslate(index)}
                      className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-sm"
                    >
                      Translate
                    </button>
                    {shouldShowSummarize && (
                      <button
                        onClick={() => handleSummarize(message.text)}
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded shadow-sm"
                        disabled={isSummarizing}
                      >
                        {isSummarizing ? "Summarizing..." : "Summarize"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Invisible div for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[600px] flex items-center shadow-lg bg-white p-3 gap-3 rounded-lg border border-gray-200">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              detectLanguage(e.target.value);
            }}
            placeholder="Enter your text here..."
            className="w-full min-h-[40px] max-h-[120px] bg-transparent text-black text-lg resize-none outline-none p-2"
          />
          {isDetecting && (
            <p className="text-sm text-gray-500">Detecting language...</p>
          )}
          <div className="flex gap-4 items-center">
            <FaImage className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
            <FaMicrophone className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700" />
            {inputText && (
              <IoMdSend
                onClick={handleSendMessage}
                className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
