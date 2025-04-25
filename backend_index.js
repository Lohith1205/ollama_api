const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express(); 
app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions)); 

app.post("/generate-ai-questions", async (req, res) => {
  try {
    const { studentId, difficulty, subject, count } = req.body;

    if (!studentId || !difficulty || !subject || !count || count <= 0) {
      return res.status(400).json({
        error: "Student ID, subject, difficulty level, and question count are required",
      });
    }

    const prompt = `
You are an AI that returns ONLY valid JSON output.
Generate ${count} multiple-choice questions on "${subject}" at "${difficulty}" difficulty.

RULES:
- Format as a valid JSON array.
- Each question must follow this structure:
  {
    "question": "....",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "B"
  }
- Do not include any explanations or extra text. Output ONLY the JSON array.
`;

    const aiResponse = await axios.post(
      "http://localhost:11434/api/generate",
      { model: "mistral", prompt },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "stream",
      }
    );

    res.setHeader("Content-Type", "application/json");

    let fullResponse = "";

    aiResponse.data.on("data", (chunk) => {
      try {
        const jsonChunk = JSON.parse(chunk.toString().trim());
        if (jsonChunk.response) {
          fullResponse += jsonChunk.response;
        }
      } catch (err) {
        console.error("Chunk parse error:", err.message);
      }
    });

    aiResponse.data.on("end", () => {
      try {
        console.log("🔍 Full AI response:", fullResponse);

        let cleanedResponse = fullResponse
          .replace(/\\n/g, "")
          .replace(/\\"/g, '"')
          .replace(/\r/g, "")
          .trim();

        const match = cleanedResponse.match(/\[.*\]/s);
        if (!match) throw new Error("No valid JSON array found in response.");

        const questions = JSON.parse(match[0]);
        res.json({ studentId, difficulty, subject, questions });
      } catch (error) {
        console.error("❌ Final JSON parse error:", error.message);
        res.status(500).json({ error: "Failed to parse AI-generated questions." });
      }
    });
  } catch (error) {
    console.error("🔥 AI API Error:", error.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
