const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://geocode.maps.co', // Replace with the actual API endpoint
            changeOrigin: true,
            pathRewrite: {
                '^/api': '', // Remove /api prefix when forwarding the request
            },
        })
    );
};