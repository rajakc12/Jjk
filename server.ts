import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for News Proxy
  app.get("/api/news", async (req, res) => {
    console.log(`[News API] Fetching news for category: ${req.query.category || 'general'}`);
    
    // Use environment variable or the key provided by the user
    const apiKey = process.env.GNEWS_API_KEY || '7c4027b1f8b90a8d4b1ecbcc624c6975';
    
    if (!apiKey) {
      console.error("[News API] GNews API Key not configured");
      return res.status(500).json({ error: "GNews API Key not configured" });
    }

    try {
      const category = req.query.category || 'general';
      const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&max=10&apikey=${apiKey}`;
      
      const response = await axios.get(url, { timeout: 10000 });
      console.log(`[News API] Successfully fetched ${response.data.articles?.length || 0} articles`);
      
      res.json(response.data);
    } catch (error: any) {
      console.error("News Fetch Error:", error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ 
        error: "Failed to fetch news", 
        details: error.response?.data?.errors || error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
