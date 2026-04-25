// ====================================
// SIMPLE NODE.JS SERVER FOR HYPERBABY
// Optional - only needed if you want server-side features
// ====================================

const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Gzip compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(__dirname, {
    maxAge: '1d', // Cache static files for 1 day
    etag: true
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/stories.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'stories.html'));
});

app.get('/stories/:storyName/start.html', (req, res) => {
    const storyPath = path.join(__dirname, 'stories', req.params.storyName, 'start.html');
    res.sendFile(storyPath);
});

// API endpoint for newsletter signup (example)
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    
    // TODO: Integrate with your newsletter service
    // (Mailchimp, ConvertKit, etc.)
    
    console.log('Newsletter signup:', email);
    res.json({ success: true, message: 'Thanks for signing up!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`🎮 Hyperbaby Games server running on http://localhost:${PORT}`);
    console.log(`📝 Press Ctrl+C to stop`);
});

module.exports = app;
