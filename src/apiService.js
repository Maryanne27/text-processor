export const checkAPIs = async () => {
try {
  if ("ai" in self) {
    const translatorAvailable = "translator" in self.ai;
    const summarizerAvailable = "summarizer" in self.ai;
    let detectorAvailable = false;

    if ("languageDetector" in self.ai) {
      const capabilities = await self.ai.languageDetector.capabilities();
      detectorAvailable =
        capabilities.available === "readily" ||
        capabilities.available === "after-download";
    }

    return { translatorAvailable, detectorAvailable, summarizerAvailable };
  }
} catch (err) {
  throw new Error("Error checking API availability.");
}
};

export const detectLanguage = async (text) => {
try {
  if (!text) return null;
  if (!("languageDetector" in self.ai)) {
    throw new Error("Language Detector API is not available.");
  }

  const detector = await self.ai.languageDetector.create();
  const results = await detector.detect(text);
  return results.length > 0 ? results[0].detectedLanguage : null;
} catch (error) {
  throw new Error("Error detecting language.");
}
};

export const summarizeText = async (text) => {
try {
  if (!text) return null;
  if (!("summarizer" in self.ai)) {
    throw new Error("Summarizer API is not available.");
  }

  const summarizationAPI = await self.ai.summarizer.create();
  const summary = await summarizationAPI.summarize(text);
  return summary.trim() !== "" ? summary : null;
} catch (error) {
  throw new Error("Error summarizing text.");
}
};

export const translateText = async (text, sourceLanguage, targetLanguage) => {
try {
  if (!text || !targetLanguage) return null;
  if (!("translator" in self.ai)) {
    throw new Error("Translator API is not available.");
  }

  const translator = await self.ai.translator.create({
    sourceLanguage: sourceLanguage || "en",
    targetLanguage,
  });

  return await translator.translate(text);
} catch (error) {
  throw new Error("Error translating text.");
}
};
