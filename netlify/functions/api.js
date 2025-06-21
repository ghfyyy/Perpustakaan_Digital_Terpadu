
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = 3000; 

app.use(cors()); 
app.use(express.json()); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash", 
    systemInstruction: "Kamu adalah Claudia, seorang asisten AI pustakawan yang ramah dan membantu di website Perpustaka Digital. Jawablah pertanyaan pengguna seputar buku, literatur, dan pengetahuan umum dengan gaya yang sopan dan cerdas. Selalu sapa pengguna dengan ramah.",
});

// Endpoint untuk chat
app.post('/chat', async (req, res) => {
    try {
        const userInput = req.body.message;

        if (!userInput) {
            return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong' });
        }

        const result = await model.generateContent(userInput);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error('Error saat menghubungi Gemini API:', error);
        res.status(500).json({ error: 'Maaf, terjadi kesalahan pada server AI.' });
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server AI berjalan di http://localhost:${port}`);
});