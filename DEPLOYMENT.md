# Deployment Guide for MerchMate AI

## 🚀 Vercel Deployment (Recommended)

### Step 1: Setup Vercel Environment Variables

In your Vercel dashboard, go to **Settings → Environment Variables** and add:

**Name:** `GEMINI_API_KEY`
**Value:** `AIzaSyA0AUDzLoJoa4uvBy3UzeA8RnHjj6NSQFk`
**Environments:** ✅ Production ✅ Preview ✅ Development

⚠️ **IMPORTANT:** Use the exact format above - no `=` sign in Vercel's UI!

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

### Step 3: Verify Deployment

After deployment, test:
- Health endpoint: `https://your-app.vercel.app/api/health`
- API endpoint: `https://your-app.vercel.app/api/generate`

## 🔧 Local Development Options

### Option 1: Full Backend Server (Express)
```bash
npm run dev:full
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Option 2: Vercel Serverless Functions Locally
```bash
# Install Vercel CLI
npm i -g vercel

# Run serverless functions locally
vercel dev

# Add to .env.local:
# VITE_USE_VERCEL_API=true
```

### Option 3: Frontend Only (Insecure - for testing only)
```bash
npm run dev
# Add to .env.local:
# VITE_GEMINI_API_KEY=your_api_key_here
# ⚠️ NOT SECURE - DO NOT USE IN PRODUCTION
```

## 📁 File Structure for Vercel

```
merchmate/
├── api/
│   ├── generate.js    # Main API endpoint
│   └── health.js      # Health check endpoint
├── dist/              # Built frontend (created by `npm run build`)
├── vercel.json        # Vercel configuration
├── package.json       # Dependencies
└── .env.local         # Environment variables (not committed)
```

## 🔐 Security Checklist

Before deploying to production:

- [ ] **Environment Variable Set**: `GEMINI_API_KEY` is in Vercel dashboard
- [ ] **No API Keys in Code**: No hardcoded API keys in source
- [ ] **Serverless Functions**: `api/generate.js` and `api/health.js` exist
- [ ] **Build Success**: `npm run build` completes without errors
- [ ] **Test Locally**: Run `vercel dev` to test locally first

## 🚨 Troubleshooting

### "API Key missing" error
- Verify `GEMINI_API_KEY` is set in Vercel dashboard
- Check that the environment is selected (Production/Preview/Development)
- Redeploy after adding environment variables

### "Function not found" error
- Make sure `api/` folder is at the root level
- Check that `vercel.json` exists and is properly formatted
- Verify files are committed to git (if using GitHub integration)

### Build errors
- Run `npm run build` locally to test
- Check that all dependencies are in `package.json`
- Verify `@google/genai` is in dependencies (not devDependencies)

### CORS issues
- Serverless functions include CORS headers
- Make sure frontend is calling the correct domain
- Check `API_BASE_URL` configuration in `geminiService.ts`

## 🌍 Environment Variables Reference

### For Vercel Production:
- `GEMINI_API_KEY` - Your Gemini API key (server-side only)

### For Local Development:
- `GEMINI_API_KEY` - Used by Express server
- `VITE_USE_VERCEL_API=true` - Use Vercel serverless functions locally
- `VITE_GEMINI_API_KEY` - Insecure frontend fallback (deprecated)

## 🔄 Deployment Workflow

### Automatic (GitHub Integration):
1. Push to GitHub branch
2. Vercel automatically builds and deploys
3. Environment variables are injected automatically
4. Live site updated

### Manual (CLI):
1. Run `npm run build` locally
2. Run `vercel --prod` to deploy
3. Set environment variables in Vercel dashboard
4. Redeploy if needed

## 📊 Monitoring

After deployment:
- Monitor Vercel function logs for errors
- Check API quota usage in Google AI Studio
- Set up alerts for high error rates
- Test health endpoint regularly

---

🎉 **Your app is now ready for secure deployment to Vercel!**