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
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedMessages, setExpandedMessages] = useState({});

  
  useEffect(() => {
    textareaRef.current?.focus();

    const fetchAPIs = async () => {
      try {
        const { translatorAvailable, detectorAvailable } = await checkAPIs();
        setTranslatorAvailable(translatorAvailable);
        setDetectorAvailable(detectorAvailable);
      } catch {
        showError("Error checking API availability.");
      }
    };
    fetchAPIs();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showError = (message) => {
    setErrorMessage(message);
    clearTimeout(window.errorTimeout);
    window.errorTimeout = setTimeout(() => setErrorMessage(""), 3000);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: inputText, type: "input", language: detectedLanguage },
    ]);
    setInputText("");
    textareaRef.current?.style.setProperty("height", "auto");

    try {
      const detectedLang = await detectLanguage(inputText);
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
        setMessages((prev) => [...prev, { text: `Summary: ${summary}`, type: "summary" }]);
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
    try {
      const message = messages[index];
      const translatedText = await translateText(message.text, message.language, selectedLanguage);
      setMessages((prev) =>
        prev.map((msg, i) => (i === index ? { ...msg, translation: { text: translatedText } } : msg))
      );
    } catch {
      showError("Error translating text.");
    }
  };

  const detectLanguage = async (text) => {
    if (!detectorAvailable || !text) return;
    setIsDetecting(true);
    try {
      const detector = await self.ai.languageDetector.create();
      const results = await detector.detect(text);
      setDetectedLanguage(results.length > 0 ? results[0].detectedLanguage : null);
    } catch {
      showError("Error detecting language. Please try again.");
      setDetectedLanguage(null);
    } finally {
      setIsDetecting(false);
    }
  };

  const toggleExpanded = (index) => {
    setExpandedMessages((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleClear = () => {
    setMessages([]);
    setInputText("");
    setDetectedLanguage(null);
    setErrorMessage("");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 px-4">
      {/* Header */}
      <header className="flex items-center justify-between w-full max-w-2xl p-4 bg-blue-600 text-white rounded-t-md shadow-lg">
        <h1 className="text-xl font-semibold">Text Assistant</h1>
        <FaUserCircle
          className="text-3xl"
          aria-label="User profile"
          title="User profile"
        />
      </header>

      {/* Card Container */}
      <div className="w-full max-w-2xl bg-white p-5 rounded-b-md shadow-lg flex flex-col space-y-4">
        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-red-400 text-white p-2 rounded text-center"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* output Messages */}
        <div
          ref={messagesEndRef}
          className="h-64 overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-md border border-gray-200"
        >
          {messages.map((message, index) => {
            const wordCount = message.text.split(/\s+/).length;
            const shouldShowSummarize =
              message.type === "input" &&
              message.language === "en" &&
              wordCount > 150;
            const isLatestMessage = index === messages.length - 1;
            const isLongMessage = message.text.length > 200;
            const displayText =
              isLongMessage && !expandedMessages[index]
                ? message.text.slice(0, 200) + "..."
                : message.text;

            return (
              <div key={index} className="p-4 rounded-lg bg-gray-100 shadow-sm">
                <p className="text-base">{displayText}</p>
                {isLongMessage && (
                  <button
                    onClick={() => toggleExpanded(index)}
                    className="text-blue-500 font-medium hover:underline mt-1 focus:outline-none"
                  >
                    {expandedMessages[index] ? "Show less" : "Read more"}
                  </button>
                )}
                {message.language && (
                  <p className="text-sm text-gray-500">
                    Detected: {languages[message.language] || message.language}
                  </p>
                )}
                {message.translation && (
                  <p className="text-base text-green-500 mt-2">
                    {message.translation.text}
                  </p>
                )}

                {isLatestMessage && (
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
                      aria-label="Select language"
                    >
                      {Object.entries(languages).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleTranslate(index)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 active:scale-95"
                      >
                      Translate
                    </button>
                    {shouldShowSummarize && (
                      <button
                        onClick={() => handleSummarize(message.text)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-orange-600 active:scale-95"
                        
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
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex items-center bg-white p-3 gap-3 rounded-md border border-gray-200">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              detectLanguage(e.target.value);
            }}
            placeholder="Enter text here for summarization or translation..."
            className="flex-1 resize-none outline-none p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
            aria-label="Text input"
          />
          {isDetecting && (
            <div className="flex items-center">
              <p className="text-sm text-gray-500 ml-1">
                Detecting language...
              </p>
            </div>
          )}
          <FaImage
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            title="Attach an image"
            aria-label="Attach an image"
          />
          <FaMicrophone
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            title="Record audio"
            aria-label="Record audio"
          />
          {inputText && (
            <IoMdSend
              onClick={handleSendMessage}
              className="text-blue-600 cursor-pointer hover:text-blue-800"
              title="Send message"
              aria-label="Send message"
            />
          )}
        </div>

        {inputText.trim().split(/\s+/).filter(Boolean).length < 150 && (
          <p className="text-xs text-gray-500">
            Tip: The summarize option will be available once you enter more than
            150 words.
          </p>
        )}
        {messages.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleClear}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded shadow-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
