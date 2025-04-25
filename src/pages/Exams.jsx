import { useState } from "react";
import axios from "axios";

const Exams = () => {
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await axios.post("http://localhost:5000/generate-ai-questions", {
        studentId,
        subject,
        difficulty,
        count: parseInt(count),
      });

      setQuestions(response.data.questions);
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Generate AI-Based Questions</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Subject (e.g., Math, Science)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          type="number"
          placeholder="Number of Questions"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {questions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Generated Questions:</h3>
          <ul className="space-y-4">
            {questions.map((q, index) => (
              <li key={index} className="p-4 border rounded">
                <p className="font-medium">{q.question}</p>
                <ul className="mt-2">
                  {q.options.map((option, i) => (
                    <li key={i} className="ml-4">
                      {String.fromCharCode(65 + i)}. {option}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-bold text-green-600">
                  Correct Answer: {q.correctAnswer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Exams;
