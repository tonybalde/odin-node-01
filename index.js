const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = './';

    // Map URL paths to HTML files
    if (req.url === '/' || req.url === '/index.html') {
        filePath += 'index.html';
    } else if (req.url === '/about') {
        filePath += 'about.html';
    } else if (req.url === '/contact-me') {
        filePath += 'contact-me.html';
    } else {
        // For any other URL, serve the 404.html file
        filePath += '404.html';
    }

    // Get the file's extension
    const extname = String(path.extname(filePath)).toLowerCase();

    // Map the content type based on the file extension
    const contentType = {
        '.html': 'text/html',
    }[extname] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Handle 404 (File Not Found)
                fs.readFile('404.html', (err, notFoundContent) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(notFoundContent, 'utf-8');
                });
            } else {
                // Handle other errors
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
