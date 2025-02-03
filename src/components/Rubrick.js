import { useState } from "react";
import axios from "axios";
import "../styles.css";

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
  console.log(prompt);

  // Handle input changes
  const handleInputChange = (e) => setInput(e.target.value);
  const handleSelectChange = (e) => setSelectedValue(e.target.value);

  // Handle Checkbox Selection
  const handleCriteriaChange = (e) => {
    const value = e.target.value;
    setDesiredGrading((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value) // Remove if already selected
        : [...prev, value] // Add if not selected
    );
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
    setResponse(null);
    setSelectedValue("");
    setDesiredGrading([]);
  };

  return (
    <div className="rubric-container">
      <h2>Rubric Generator</h2>
      <div className="form-group">
        <label>Enter the Course Name or Subject:</label>
        <input type="text" value={input} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Select Evaluation Type:</label>
        <select value={selectedValue} onChange={handleSelectChange}>
          <option value="Test">Test</option>
          <option value="Coding">Coding</option>
          <option value="Presentation">Presentation</option>
          <option value="Essay">Essay</option>
        </select>
      </div>

      <div className="form-group">
        <label>Select Evaluation Criteria:</label>
        <div className="checkbox-group">
          {["Clarity", "Accuracy", "Creativity", "Critical Thinking"].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                value={item}
                checked={desiredGrading.includes(item)}
                onChange={handleCriteriaChange}
              />
              {item}
            </label>
          ))}
          <label>
            <input
              type="checkbox"
              value="Other"
              checked={desiredGrading.includes("Other")}
              onChange={handleCriteriaChange}
            />
            Other
          </label>
        </div>
      </div>
      <div className="button-group">
        <button onClick={sendMessage}>Generate Rubric</button>
        <button onClick={clearResults}>Clear Results</button>
      </div>
      

      {response && (
        <div className="rubric-output">
          <h3>Generated Rubric:</h3>
          {response.split("-> ").map((line, index) =>
            line.trim() ? <p key={index}>- {line.trim()}</p> : null
          )}
        </div>
      )}
    </div>
  );
}
