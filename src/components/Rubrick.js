import { useState } from "react";
import axios from 'axios';

export function Rubric(){
    // State
    const[input, setInput] = useState('');
    const[response, setResponse] = useState('');
    const [selectedValue, setSelectedValue] = useState('Select Option');
    const [desiredGrading, setDesiredGrading] = useState(''); 

    const prompt = `You are a professor in higher education teaching a course on ${[input]} and you have a PHd. You are also an expert in evaluation. Using your background, please create a grading rubric for ${selectedValue} using ${desiredGrading} The grading rubric should have only 1 complete statement with 0 to 5 grade. `;
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        };
    
    // API Call
    const sendMessage = async () => {
        try {
            const apiUrl = 'https://api.openai.com/v1/chat/completions'; // Update with the correct API endpoint
            // const apiKey = process.env.REACT_API_KEY ; // Replace with your actual API key
            const apiKey = '';
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            };
      
            const requestBody = {
              messages: [{ role: 'user', content: prompt }],
              model: "gpt-4o-mini",
            };
      
            const { data } = await axios.post(apiUrl, requestBody, { headers });
      
            setResponse(data.choices[0].message.content);
          } catch (error) {
            console.error('Error sending message:', error);
          }
        };
        // const clearField 
        // Use State values = '' and response = '';
    return (
        <div>
            {/* onClick={generateRubric} */}
            {/* <button >Generate Rubric</button> */}
            
            <div className="container">
                <label>Enter the Course Name or Subject</label>
                <input className="textBox"
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                />
            </div>
            <select value={selectedValue} onChange={handleChange}>
                <option value="Essay">Essay</option>
                <option value="Presentation">Presentation</option>
                <option value="Test">Test</option>
                <option value="Coding">Coding</option>
            </select>
            {console.log(prompt)};
            <button onClick={sendMessage}>Send</button>

            <div>
                <p>{response}</p>
            </div>
            <button onClick={sendMessage}>Clear Results</button>
        </div>
    )
}