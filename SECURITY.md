# Security Guide for MerchMate AI

## 🚨 Critical Security Notice

This application handles sensitive API keys. Follow these security practices to protect your credentials and prevent unauthorized usage.

## ✅ What We've Implemented

### 1. **Secure Backend Proxy**
- API keys are stored **server-side only**
- Frontend never sees the actual API key
- All Gemini API calls go through our secure backend

### 2. **No Key Exposure**
- Removed console logging of API keys
- No API keys in frontend bundle
- Environment variables properly separated

### 3. **Environment Separation**
- `GEMINI_API_KEY` - Server-side (secure)
- `VITE_GEMINI_API_KEY` - Frontend (deprecated, insecure)

## 🔒 Development Security

### Setting Up Secure Development

1. **Use the secure backend server:**
   ```bash
   npm run dev:full  # Runs both frontend and backend
   ```

2. **Or run manually:**
   ```bash
   # Terminal 1: Backend
   npm run dev:server

   # Terminal 2: Frontend
   npm run dev
   ```

3. **Environment Setup:**
   ```bash
   # Copy the secure template
   cp .env.example .env.local

   # Add your API key to .env.local
   GEMINI_API_KEY=your_actual_gemini_api_key
   ```

## 🚀 Production Deployment

### For Production (Safe ✅)

```bash
# Build the frontend
npm run build

# Deploy with the secure backend
npm start
```

- ✅ API keys are server-side only
- ✅ No keys exposed in browser
- ✅ Suitable for production deployment

### For Testing Only (Unsafe ❌)

```bash
# Direct frontend development (insecure)
npm run dev
```

- ❌ Exposes API keys in browser console
- ❌ Keys visible in source code
- ❌ NOT SUITABLE FOR PRODUCTION

## 🛡️ Security Checklist

Before deploying to production:

- [ ] API keys are in `.env.local` (NOT committed to git)
- [ ] Using `GEMINI_API_KEY` (server-side)
- [ ] NOT using `VITE_GEMINI_API_KEY` in production
- [ ] Backend server is running
- [ ] Frontend calls backend API (`/api/generate`)
- [ ] `.env.local` is in `.gitignore`
- [ ] No console logging of API keys

## 🔍 How It Works

### Secure Flow (Production)
1. User uploads image to frontend
2. Frontend sends image to backend API (`/api/generate`)
3. Backend adds API key and calls Gemini
4. Backend returns result to frontend
5. **API key never leaves the server**

### Insecure Flow (Old Development)
1. Frontend directly calls Gemini API
2. **API key exposed in browser** ❌

## 🚨 What NOT to Do

❌ **NEVER** commit `.env.local` to git
❌ **NEVER** use `VITE_GEMINI_API_KEY` in production
❌ **NEVER** log API keys to console
❌ **NEVER** expose API keys in frontend code

## 🔧 Troubleshooting

### "API endpoint not found"
- Make sure backend server is running on port 3001
- Check that `npm run dev:server` is running

### "API Key missing"
- Verify `GEMINI_API_KEY` is set in `.env.local`
- Make sure you're using the secure backend server

### Still seeing API key in browser?
- Clear browser cache
- Make sure you're not using the old `VITE_GEMINI_API_KEY`
- Restart both frontend and backend servers

## 📞 Support

If you have security questions or concerns:
1. Check this security guide first
2. Review the `.env.example` file
3. Ensure backend server is running properly