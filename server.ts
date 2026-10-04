import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AI Detective Intelligence API',
      version: '1.0.0',
      geminiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  app.post('/api/photo-search', async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ source: 'keyword-fallback', matches: [] });
    }

    const query = typeof req.body?.query === 'string' ? req.body.query.slice(0, 250) : '';
    const photos = Array.isArray(req.body?.photos) ? req.body.photos.slice(0, 80) : [];
    if (!query.trim() || !photos.length) {
      return res.status(400).json({ error: 'A query and photo metadata are required.' });
    }

    const records = photos.map((photo: any) => ({
      id: String(photo.id || '').slice(0, 40),
      date: String(photo.date || '').slice(0, 32),
      place: String(photo.place || '').slice(0, 100),
      city: String(photo.city || '').slice(0, 100),
      people: Array.isArray(photo.people) ? photo.people.slice(0, 12) : [],
      kind: String(photo.kind || '').slice(0, 32),
      tags: Array.isArray(photo.tags) ? photo.tags.slice(0, 16) : [],
      note: String(photo.note || '').slice(0, 60)
    }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{
          text: `Find photos matching this vague query using their notes and metadata. Prefer matches supported by a saved note when relevant. Return only JSON shaped as {"matches":[{"id":"photo-id","noteMatch":true}]}, ranked best first. Include only relevant IDs and set noteMatch true only when the note itself supports the match.\nQuery: ${query}\nPhotos: ${JSON.stringify(records)}`
        }],
        config: { responseMimeType: 'application/json', temperature: 0.1 }
      });
      const parsed = JSON.parse(response.text || '{}');
      const allowed = new Set(records.map((photo: any) => photo.id));
      const matches = Array.isArray(parsed.matches) ? parsed.matches
        .filter((match: any) => allowed.has(String(match.id)))
        .slice(0, 30)
        .map((match: any) => ({ id: String(match.id), noteMatch: Boolean(match.noteMatch) })) : [];
      return res.json({ matches });
    } catch (error: any) {
      console.error('Photo search ranking error:', error?.message || error);
      return res.json({ source: 'keyword-fallback', matches: [] });
    }
  });

  // Optional AI Deep Analysis endpoint using Gemini if key is provided
  app.post('/api/investigate-deep', async (req, res) => {
    try {
      const { theme, sampleTexts, prompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({
          source: 'deterministic-engine',
          message: 'Running in deterministic Demo Mode (Gemini API key not configured).',
          insight: null
        });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const systemInstruction = `You are a Principal Product Manager & Behavioral Scientist for Myntra (a premier Indian fashion e-commerce marketplace).
Your objective is to diagnose purchase friction between wishlisting and checkout ("I want this" -> "I will buy this").
Always distinguish clearly between:
1. USER EVIDENCE (what customers literally say)
2. BEHAVIORAL INSIGHT (underlying cognitive bias or hesitation)
3. PRODUCT HYPOTHESIS & EXPERIMENT (testable UX changes with primary and guardrail metrics).
Be concise, data-driven, and highly actionable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            text: `${prompt || `Analyze the following customer quotes regarding purchase friction theme "${theme}":\n\n${sampleTexts?.join('\n---\n')}\n\nProvide: 1. Core Behavioral Driver, 2. Root Cause, 3. High-Impact A/B Experiment proposal for Myntra Growth Team.`}`
          }
        ],
        config: {
          systemInstruction,
          temperature: 0.3
        }
      });

      return res.json({
        source: 'gemini-2.5-flash',
        text: response.text
      });
    } catch (error: any) {
      console.error('Gemini investigation error:', error);
      return res.status(500).json({
        error: 'Failed to process AI deep investigation',
        details: error?.message
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Detective Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup error:', err);
});
