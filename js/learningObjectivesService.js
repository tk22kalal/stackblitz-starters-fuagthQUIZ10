import { getAPIUrls } from './config.js';
import { formatLearningContent } from './utils/contentFormatter.js';

export async function generateLearningObjectives(question, answer, explanation) {
    const API_URLS = getAPIUrls();
    const prompt = `
    Based on this medical question:
    Question: "${question}"
    Correct Answer: "${answer}"
    Explanation: "${explanation}"

    Generate any ONE most appropriate learning material from the following types based on the concept:
    1. Key Points (for lists and hierarchical information)
    2. Table (for comparisons and classifications)
    3. Formula (for mathematical or chemical relationships)
    4. Mnemonic (for memory aids)
    5. Flowchart/Cycle (for processes or relationships)
    6. Flashcard (for key facts)

    Choose the MOST SUITABLE format for this specific concept and provide it in this exact JSON format:
    {
        "type": "one of: keyPoints, table, formula, mnemonic, flowchart, flashcard",
        "title": "Brief title of the learning material",
        "content": {
            // For keyPoints:
            "points": ["Point 1", "Point 2", "Point 3"]
            
            // For table:
            "headers": ["Column1", "Column2"],
            "rows": [["Row1Col1", "Row1Col2"], ["Row2Col1", "Row2Col2"]]
            
            // For formula:
            "expression": "The formula",
            "variables": {"variable": "explanation"},
            "description": "How to use the formula"
            
            // For mnemonic:
            "word": "The mnemonic word",
            "explanation": ["E: Explanation", "X: Explanation"]
            
            // For flowchart:
            "steps": ["Step 1", "Step 2", "Step 3"],
            "connections": ["Step 1 → Step 2", "Step 2 → Step 3"]
            
            // For flashcard:
            "front": "Question/concept",
            "back": "Answer/explanation"
        }
    }`;

    try {
        const response = await fetch(API_URLS.text, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const content = JSON.parse(data.candidates[0]?.content?.parts?.[0]?.text || '{}');

        return formatLearningContent(content);
    } catch (error) {
        console.error('Learning Objectives Generation Error:', error);
        return null;
    }
}