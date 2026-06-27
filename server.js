const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 4000;

// Collect default system metrics
client.collectDefaultMetrics();

// HTTP Request Counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

// Response Time Histogram
const httpResponseTime = new client.Histogram({
  name: "http_response_time_ms",
  help: "Response time in milliseconds",
  buckets: [50, 100, 200, 500, 1000],
});

// Middleware
app.use((req, res, next) => {
  httpRequestCounter.inc();

  const end = httpResponseTime.startTimer();

  res.on("finish", () => {
    end();
  });

  next();
});

// Home Route
app.get("/", (req, res) => {
  setTimeout(() => {
    res.send("AI Monitoring Dashboard Running 🚀");
  }, Math.random() * 300);
});

// Users Route
app.get("/users", (req, res) => {
  setTimeout(() => {
    res.json([
      { id: 1, name: "Preetam" },
      { id: 2, name: "User2" },
    ]);
  }, Math.random() * 500);
});

// Status Route
app.get("/status", (req, res) => {
  setTimeout(() => {
    res.json({
      status: "OK",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: Date.now(),
    });
  }, Math.random() * 700);
});

// Metrics Route
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});