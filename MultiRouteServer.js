const http = require("http");
const fs = require("fs");
const path = require("path");

// Creates the server:
const server = http.createServer((request, response) => {
  const viewsPath = path.join(__dirname, "Views");
  
  // Displays the page to the user:
  const connectPage = (filename) => {
    const filePath = path.join(viewsPath, filename);
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        // If the page is not found displays an error in both the console and to the user.
        console.error(`Error reading ${filename}: ${err.message}`);
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.end("Internal Server Error\n");
      } else {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(data);
        response.end();
      }
    })
  }
  // Switch statement to connect the user to the page:
  switch (request.url) {
    case '/':
      connectPage('home.html');
      break;

    case '/about':
      connectPage('about.html');
      break;

    case '/contact':
      connectPage('contact.html');
      break;

    case '/products':
      connectPage('products.html');
      break;

    case '/subscribe':
      connectPage('subscribe.html');
      break;

    default:
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('404 Not Found\n');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
