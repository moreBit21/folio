# Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Add environment variable: FMP_KEY = your FMP API key
4. Deploy — done!

The /api/fmp.js serverless function proxies all FMP calls server-side,
keeping your API key secret and bypassing CORS restrictions.
