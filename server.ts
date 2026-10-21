import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Initialize GoogleGenAI
const ai = new GoogleGenAI({});

// Server-side AI Academic Insight endpoint
app.post('/api/ai/academic-insight', async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Valid prompt string is required' });
      return;
    }

    const defaultSystemInstruction = 
      'You are the Chief Academic Officer & AI Timetable Intelligence System of LJ University (Ahmedabad). ' +
      'Provide concise, high-value, actionable academic insights, timetable optimization recommendations, ' +
      'faculty workload balancing, and student defaulter risk analysis. Structure responses with crisp bullet points and clear takeaways.';

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || defaultSystemInstruction,
      },
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI request timed out')), 8000)
    );

    const response: any = await Promise.race([generatePromise, timeoutPromise]);

    res.json({ 
      text: response?.text || 'Analysis completed.',
      model: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('[Gemini API Server Error]:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to generate AI insight',
      fallback: true
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[LJU ERP] Server ready on http://0.0.0.0:${port} with Gemini AI server proxy`);
  });
}

startServer();
