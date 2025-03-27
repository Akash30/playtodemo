import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_TOKEN;

// Configure Vite middleware for React client in development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(vite.middlewares);
}

// API route for token generation
app.get("/token", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "verse",
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist/client')));
}

// Render the React client
app.use("*", async (req, res, next) => {
  const url = req.originalUrl;
  console.log("Handling URL:", url);

  try {
    if (process.env.NODE_ENV === 'production') {
      // In production, serve the pre-rendered HTML
      const template = fs.readFileSync(path.join(__dirname, 'dist/client/index.html'), 'utf-8');
      const { render } = await import('./dist/server/entry-server.js');
      const appHtml = await render(url);
      const html = template.replace(`<!--ssr-outlet-->`, appHtml?.html);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } else {
      // In development, use Vite's SSR
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom",
      });
      const template = await vite.transformIndexHtml(
        url,
        fs.readFileSync(path.join(__dirname, "./client/index.html"), "utf-8"),
      );
      const { render } = await vite.ssrLoadModule("./client/entry-server.jsx");
      const appHtml = await render(url);
      const html = template.replace(`<!--ssr-outlet-->`, appHtml?.html);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    }
  } catch (e) {
    console.error("SSR Error:", e);
    if (process.env.NODE_ENV !== 'production') {
      vite.ssrFixStacktrace(e);
    }
    next(e);
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Express server running on *:${port}`);
  });
}

// For Vercel
export default app;