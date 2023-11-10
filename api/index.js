// /api/index.js (CommonJS module for Vercel)

module.exports = async (req, res) => {
    if (!global.__app) {
      const { default: app } = await import('../app.mjs');
      global.__app = app;
    }
    return global.__app(req, res);
  };
  
