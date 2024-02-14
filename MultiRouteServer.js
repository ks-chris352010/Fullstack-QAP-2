const http = require("http");
const fs = require("fs");
const path = require("path");
const eventEmitter = require("events");
const { format } = require("date-fns");

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
const logsDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}
const writeToLogFile = (filename, message) => {
  const logFilePath = path.join(logsDirectory, filename);
  const logMessage = `${format(new Date(), "yyyy-MM-dd HH:mm:ss")} - ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
};

// Creates the server:
const server = http.createServer((request, response) => {
  const viewsPath = path.join(__dirname, "Views");

  // Displays the page to the user:
  const connectPage = (filename) => {
    const filePath = path.join(viewsPath, filename);
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        FileRead.emit("fileNotAvailable", filename);
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("Internal Server Error\n");
      } else {
        FileRead.emit("fileRead", filename);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);
        response.end();
      }
    });
  };

  // Switch statement to connect the user to the page:
  switch (request.url) {
    case "/":
      connectPage("home.html");
      break;

    case "/about":
      HttpEmitter.emit("routeAccessed", "/about");
      connectPage("about.html");
      break;

    case "/contact":
      HttpEmitter.emit("routeAccessed", "/contact");
      connectPage("contact.html");
      break;

    case "/products":
      HttpEmitter.emit("routeAccessed", "/products");
      connectPage("products.html");
      break;

    case "/subscribe":
      HttpEmitter.emit("routeAccessed", "/subscribe");
      connectPage("subscribe.html");
      break;

    default:
      HttpEmitter.emit("nonHomeRouteAccessed", request.url);
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("404 Not Found\n");
      break;
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
