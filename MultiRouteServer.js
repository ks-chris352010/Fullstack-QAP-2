const express = require("express");
const fs = require("fs");
const path = require("path");
const eventEmitter = require("events");
const { format } = require("date-fns");

const app = express();
const logsDirectory = path.join(__dirname, "logs");

class Emitters extends eventEmitter {}

// HTTP Emitters:
const HttpEmitter = new Emitters();
HttpEmitter.on("httpStatus", (statusCode) => {
  const message = `HTTP Status code: ${statusCode}`;
  console.log(message);
  writeToLogFile("httpStatus.log", message);
});

HttpEmitter.on("routeAccessed", (route) => {
  const message = `Route accessed: ${route}`;
  console.log(message);
  writeToLogFile("routeAccessed.log", message);
});

HttpEmitter.on("nonHomeRouteAccessed", (route) => {
  const message = `Non-home route accessed: ${route}`;
  console.log(message);
  writeToLogFile("nonHomeRouteAccessed.log", message);
});

// File Emitters:
const FileRead = new Emitters();
FileRead.on("fileRead", (fileName) => {
  const message = `File read: ${fileName}`;
  console.log(message);
  writeToLogFile("fileRead.log", message);
});

FileRead.on("fileNotAvailable", (fileName) => {
  const message = `Failed to read: ${fileName}`;
  console.log(message);
  writeToLogFile("fileNotAvailable.log", message);
});

// Logging files:
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}
const writeToLogFile = (filename, message) => {
  const logFilePath = path.join(logsDirectory, filename);
  const logMessage = `${format(new Date(), "yyyy-MM-dd HH:mm:ss")} - ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
};

// Uses express so that I could make the website look half decent.
app.use(express.static(path.join(__dirname, "CSS")));

const handleRoute = (res, filename) => {
  const viewsPath = path.join(__dirname, "Views");
  const filePath = path.join(viewsPath, filename);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      FileRead.emit("fileNotAvailable", filename);
      res.status(500).send("Internal Server Error");
    } else {
      FileRead.emit("fileRead", filename);
      res.status(200).send(data);
    }
  });
};

app.get("/", (req, res) => handleRoute(res, "home.html"));
app.get("/about", (req, res) => {
  HttpEmitter.emit("routeAccessed", "/about");
  handleRoute(res, "about.html");
});
app.get("/contact", (req, res) => {
  HttpEmitter.emit("routeAccessed", "/contact");
  handleRoute(res, "contact.html");
});
app.get("/products", (req, res) => {
  HttpEmitter.emit("routeAccessed", "/products");
  handleRoute(res, "products.html");
});
app.get("/subscribe", (req, res) => {
  HttpEmitter.emit("routeAccessed", "/subscribe");
  handleRoute(res, "subscribe.html");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
