import express, { type Express } from "express";
import fs from "fs";
import path from "path";

// Simple logger for backend
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// This is NO-OP in production (Vite dev server not used on Render)
export async function setupVite(_app: Express, _server: any) {
  log("Skipping Vite dev server setup (not needed in production)", "vite");
}

// Serve static files (optional: only if you ever build frontend into /public)
export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.warn(
      `Warning: No static frontend found at ${distPath}. Skipping static serving.`
    );
    return;
  }

  app.use(express.static(distPath));

  // Fallback to index.html for SPA routes
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
