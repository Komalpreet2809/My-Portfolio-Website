const http = require("http");
const fs = require("fs");
const path = require("path");
const trafficHandler = require("./api/traffic");
const githubHandler = require("./api/github");
const repoHandler = require("./api/repo");

// Load .env
try {
  const envFile = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
  envFile.split("\n").forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      process.env[match[1]] = match[2] || "";
    }
  });
} catch (e) {
  console.log("No .env file found or error parsing.");
}

const host = "127.0.0.1";
const port = 8080;
const root = __dirname;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function sendFile(filePath, req, res) {
  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.writeHead(416, {
          "Content-Range": `bytes */${fileSize}`
        });
        res.end();
        return;
      }

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, {start, end});
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": contentType,
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": contentType,
        "Accept-Ranges": "bytes"
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

  if (urlPath === "/api/traffic") {
    trafficHandler(req, res).catch((err) => {
      console.error("Traffic API error:", err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "Traffic API failed" }));
      }
    });
    return;
  }

  if (urlPath === "/api/github") {
    githubHandler(req, res).catch((err) => {
      console.error("GitHub API error:", err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "GitHub API failed" }));
      }
    });
    return;
  }

  if (urlPath.startsWith("/api/repo")) {
    repoHandler(req, res).catch((err) => {
      console.error("GitHub Repo API error:", err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "GitHub Repo API failed" }));
      }
    });
    return;
  }

  const relativePath = urlPath === "/" ? "/index.html" : urlPath;
  const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  sendFile(filePath, req, res);
});

server.listen(port, host, () => {
  console.log(`Portfolio server running at http://${host}:${port}/`);
});
