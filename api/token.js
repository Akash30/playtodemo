export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Return the token from environment variable
  res.status(200).json({
    client_secret: {
      value: process.env.OPENAI_API_KEY
    }
  });
} 