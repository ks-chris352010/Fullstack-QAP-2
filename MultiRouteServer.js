const http = require('http');

// Creates the server:
const server = http.createServer((request, response) => {
  // Switch statement to connect the user to the page:
  switch (request.url) {
    // Home page:
    case '/':
      console.log('Home Page Requested');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('Home Page\n');
      break;

    // About page:
    case '/about':
      console.log('About Page Requested');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('About Page\n');
      break;

    // Contact page:
    case '/contact':
      console.log('Contact Page Requested');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('Contact Page\n');
      break;

    // Products page:
    case '/products':
      console.log('Products Page Requested');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('Products Page\n');
      break;
    // Subscribe page:
    case '/subscribe':
      console.log('Subscribe Page Requested');
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('Subscribe Page\n');
      break;

    // Page not found:
    default:
      console.log('404 Not Found');
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('404 Not Found\n');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
