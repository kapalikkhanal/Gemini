const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Function to call Gemini API
async function callGeminiAPI(text) {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: text
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract the response text from Gemini's response structure
        const generatedText = response.data.candidates[0].content.parts[0].text;
        return generatedText;
    } catch (error) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        throw error;
    }
}

// API endpoint
app.post('/api/askgemini', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                error: 'Text is required in the request body'
            });
        }

        const response = await callGeminiAPI(text);

        res.json({
            success: true,
            response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
});

app.get('/api/health', async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Server working fine."
        });
    } catch (e) {
        res.json({
            success: false,
            message: e
        });
    }
})

// Start server
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});