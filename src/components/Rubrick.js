import { useState } from "react";
import axios from "axios";

export function Rubric() {
  // State Management
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [desiredGrading, setDesiredGrading] = useState([]);

  // API Key Fix
  const apiKey = process.env.REACT_APP_API_KEY; 

  // Prompt for AI
  const prompt = `You are a professor in higher education teaching a course on ${input} and you have a PhD. You are also an expert in evaluation. Using your background, please create a grading rubric for ${selectedValue} using ${desiredGrading}. The grading rubric should have only 1 complete statement with a grade scale from 0 to 5.`;

  // Handle input changes
  const handleInputChange = (e) => setInput(e.target.value);
  const handleSelectChange = (e) => setSelectedValue(e.target.value);

   // Handle Multi-Select Change
   const handleCriteriaChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setDesiredGrading(selectedOptions);
  };

  // API Call Function
  const sendMessage = async () => {
    if (!apiKey) {
      console.error("API Key is missing. Ensure REACT_APP_API_KEY is set in your .env file.");
      alert("Error: API key is missing.");
      return;
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [{ role: "user", content: prompt }],
          model: "gpt-4o-mini",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      setResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error sending message:", error.response || error.message);
      alert("Error fetching response. Check console for details.");
    }
  };

  // Clear Results
  const clearResults = () => {
    setInput("");
    setResponse("");
    setSelectedValue("");
    setDesiredGrading([]);
  };

  return (
    <div className="container">
      <label>Enter the Course Name or Subject:</label>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        className="textBox"
      />

      <label>Select Evaluation Type:</label>
      <select value={selectedValue} onChange={handleSelectChange}>
        <option value="Essay">Essay</option>
        <option value="Presentation">Presentation</option>
        <option value="Test">Test</option>
        <option value="Coding">Coding</option>
      </select>

      <label>Select Evaluation Criteria (Hold Ctrl to Select Multiple):</label>
      <select multiple value={desiredGrading} onChange={handleCriteriaChange}>
        <option value="Clarity">Clarity</option>
        <option value="Accuracy">Accuracy</option>
        <option value="Creativity">Creativity</option>
        <option value="Critical Thinking">Critical Thinking</option>
        <option value="Other">Other</option>
      </select>

      <button onClick={sendMessage}>Generate Rubric</button>
      <button onClick={clearResults}>Clear Results</button>

      {response && (
        <div>
          <h3>Generated Rubric:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
