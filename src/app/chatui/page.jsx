"use client";
import { useState, useEffect, useRef } from "react";
import { Clipboard, RefreshCw, Send } from "lucide-react";
import { Card, CardContent } from "@/component/Card";
import { checkAPIs, summarizeText, translateText } from "@/apiService";

const languages = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  ru: "Russian",
  tr: "Turkish",
  fr: "French",
};

export default function TranslateSummarize() {
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

  const [mode, setMode] = useState("translate");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState({
    translatorAvailable: false,
    detectorAvailable: false,
  });

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

  // const handleSendMessage = async () => {
  //   if (inputText.trim() === "") return;
  //   setMessages((prev) => [
  //     ...prev,
  //     { text: inputText, type: "input", language: detectedLanguage },
  //   ]);
  //   setSelectedLanguage("en");
  //   setShowGreeting(false);
  //   setSelectedLanguage("en")
  //   if (textareaRef.current) {
  //     textareaRef.current.style.height = "auto";
  //   }

  //   try {
  //     const detectedLang = await detectLanguage(text);
  //     setDetectedLanguage(detectedLang);
  //   } catch {
  //     showError("Error detecting language.");
  //   }
  // };

 
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
    const message = messages[index];

    try {
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

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;
    setMessages((prev) => [...prev, { text: inputText, type: "input", language: detectedLanguage }]);
    setShowGreeting(false);
    setInputText("");

    try {
      const detectedLang = await detectLanguage(inputText);
      setDetectedLanguage(detectedLang);
      setOutputText(inputText);
    } catch {
      showError("Error detecting language.");
    }
  };

  

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-2xl">
        

 <div className="flex justify-between items-center mb-4">
<h2 className="text-xl font-semibold">
  {mode === "translate" ? "Text Translation" : "Text Summarization"}
</h2>
<div className="flex items-center gap-2">
  <span className="text-sm">Summarize</span>
  <div
    className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
      mode === "translate" ? "bg-orange-500" : ""
    }`}
    onClick={() =>
      setMode(mode === "translate" ? "summarize" : "translate")
    }
  >
    <div
      className={`w-4 h-4 bg-white rounded-full transition-all ${
        mode === "translate" ? "translate-x-5" : "translate-x-0"
      }`}
    ></div>
  </div>
  <span className="text-sm">Translate</span>
</div>
</div>

{mode === "translate" && (
<div className="grid grid-cols-2 gap-4 mb-4">
  <select
    className="p-2 border rounded-lg bg-white"
    value={sourceLang}
    onChange={(e) => setSourceLang(e.target.value)}
  >
    <option value="auto">Auto</option>
    <option value="en">English</option>
    <option value="es">Spanish</option>
  </select>
  <select
    className="p-2 border rounded-lg bg-white"
    value={targetLang}
    onChange={(e) => setTargetLang(e.target.value)}
  >
    <option value="en">English</option>
    <option value="es">Spanish</option>
  </select>
</div>
)} 

        <textarea
          className="w-full p-3 border rounded-lg"
          rows={4}
          placeholder="Enter text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex justify-between mt-4">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={handleSendMessage}
          >
            <Send size={16} className="mr-2" /> Send
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg flex items-center"
            onClick={() => setInputText("")}
          >
            <RefreshCw size={16} className="mr-2" /> Reset
          </button>
        </div>
        {outputText && (
          <CardContent className="mt-4 p-3 bg-gray-50 rounded-lg relative">
            <p className="text-gray-700">{outputText}</p>
            
            <button
              className="absolute top-2 right-2 p-1 text-gray-600 hover:text-black"
              onClick={handleTranslate}
            >
              Translate
            </button>
            <button
              className="absolute top-2 right-10 p-1 text-gray-600 hover:text-black"
              onClick={() => navigator.clipboard.writeText(outputText)}
            >
              <Clipboard size={16} />
            </button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}




{/* <div className="flex justify-between items-center mb-4">
<h2 className="text-xl font-semibold">
  {mode === "translate" ? "Text Translation" : "Text Summarization"}
</h2>
<div className="flex items-center gap-2">
  <span className="text-sm">Summarize</span>
  <div
    className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
      mode === "translate" ? "bg-orange-500" : ""
    }`}
    onClick={() =>
      setMode(mode === "translate" ? "summarize" : "translate")
    }
  >
    <div
      className={`w-4 h-4 bg-white rounded-full transition-all ${
        mode === "translate" ? "translate-x-5" : "translate-x-0"
      }`}
    ></div>
  </div>
  <span className="text-sm">Translate</span>
</div>
</div>

{mode === "translate" && (
<div className="grid grid-cols-2 gap-4 mb-4">
  <select
    className="p-2 border rounded-lg bg-white"
    value={sourceLang}
    onChange={(e) => setSourceLang(e.target.value)}
  >
    <option value="auto">Auto</option>
    <option value="en">English</option>
    <option value="es">Spanish</option>
  </select>
  <select
    className="p-2 border rounded-lg bg-white"
    value={targetLang}
    onChange={(e) => setTargetLang(e.target.value)}
  >
    <option value="en">English</option>
    <option value="es">Spanish</option>
  </select>
</div>
)} */}