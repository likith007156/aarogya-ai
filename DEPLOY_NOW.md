# 🚀 Manual Vercel Deployment Guide

## Step-by-Step Instructions

### Step 1: Open Command Prompt in Project Folder

1. Open File Explorer
2. Navigate to: `C:\Users\kiran\Desktop\Demo Aragoya AI`
3. Click in the address bar
4. Type: `cmd`
5. Press Enter

### Step 2: Login to Vercel

```bash
vercel login
```

- Browser will open
- Click "Continue with GitHub"
- Authorize Vercel

### Step 3: Deploy

```bash
vercel --prod
```

**Answer the prompts:**

```
? Set up and deploy "C:\Users\kiran\Desktop\Demo Aragoya AI"? 
→ Y (press Enter)

? Which scope do you want to deploy to?
→ Select your account (use arrow keys, press Enter)

? Link to existing project?
→ N (press Enter)

? What's your project's name?
→ aarogya-ai-final (type this, press Enter)

? In which directory is your code located?
→ ./ (press Enter)

? Want to override the settings?
→ N (press Enter)
```

**Vercel will:**
- Upload your code
- Build the project
- Deploy it
- Give you a live URL!

### Step 4: Add Environment Variables

After deployment:

1. Go to: https://vercel.com/dashboard
2. Click on your project: `aarogya-ai-final`
3. Click "Settings"
4. Click "Environment Variables"
5. Add these 7 variables:

```
DATABASE_URL=file:./dev.db
GEMINI_API_KEY=your_gemini_key_here
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
SARVAM_API_KEY=your_sarvam_key_here
GROQ_API_KEY=gyour_sarvam_key_here
```

6. Click "Save"

### Step 5: Redeploy

After adding environment variables:

1. Go to "Deployments" tab
2. Click the three dots on latest deployment
3. Click "Redeploy"
4. Wait 2 minutes

**LIVE!** 🎉

---

## 🆘 If Vercel CLI Still Doesn't Work

### Alternative: Use Render (100% Web-based)

**No CLI needed!**

1. Go to: https://render.com/
2. Sign up with GitHub (free)
3. Click "New +" → "Web Service"
4. Connect GitHub repo: `likithkumar156-design/aarogya-ai`
5. Settings:
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Instance: FREE
6. Add 7 environment variables
7. Click "Create Web Service"

**Time:** 15 minutes
**Success Rate:** 95%

---

## ⏱️ Timeline

**Vercel CLI:**
- Install: Done ✅
- Login: 2 min
- Deploy: 3 min
- Add env vars: 3 min
- Redeploy: 2 min
**Total: 10 minutes**

**Render (if Vercel fails):**
- Sign up: 2 min
- Configure: 5 min
- Deploy: 8 min
**Total: 15 minutes**

---

## 🎯 What to Do NOW

**Try Vercel CLI:**

```bash
vercel login
vercel --prod
```

**If it fails, use Render:**
https://render.com/

---

**Run `vercel login` now in your command prompt!**
