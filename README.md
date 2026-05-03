# Aarogya AI - Healthcare for Every Indian

Aarogya AI is a multilingual rural health companion demo built for the Cognizant Technoverse 2026 Hackathon. It provides voice-first, AI-powered symptom triaging and healthcare access tailored for rural India.

## Features

- **Multilingual Voice Interface**: Supports Hindi, English, and Tamil. Voice inputs using Web Speech API, Voice output using SpeechSynthesis.
- **Symptom Triaging**: Powered by Google Gemini AI, acts as a compassionate health assistant.
- **Disease Risk Calculator**: Rule-based scoring engine for Tuberculosis, Diabetes, Anemia, and Hypertension.
- **PHC Locator**: Integrated map with mock Primary Health Centres across Karnataka.
- **ASHA Worker Dashboard**: Overview of patients, high-risk cases, and quick referral tracking.
- **IVRS Simulation**: Demonstrates accessibility for feature-phone users without internet.
- **ABDM Integration**: Mock ABHA ID generator and QR codes.

## Tech Stack

- **Frontend**: Next.js 14 App Router, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend/AI**: Next.js API Routes, Google Gemini API (@google/generative-ai)
- **Database**: SQLite, Prisma ORM
- **Maps**: react-leaflet

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables
Copy the example environment variables file and add your Gemini API Key.
\`\`\`bash
cp .env.example .env
\`\`\`
Edit `.env` and fill in your `GEMINI_API_KEY`.

### 3. Database Setup
Push the schema to SQLite and seed the database with sample mock data (Patients and PHCs).
\`\`\`bash
npx prisma db push
npm run seed
\`\`\`

### 4. Run the Application
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Twilio WhatsApp Setup

To test the live WhatsApp integration using the Twilio Sandbox:

1. Sign up at twilio.com (free, no credit card for sandbox)
2. Go to Console → Messaging → Try WhatsApp
3. You'll get a sandbox number like: `+1 415 523 8886`
4. Send `join <your-code>` from your phone to that number
5. Get your credentials and add them to `.env`:
   - `TWILIO_ACCOUNT_SID=ACxxxxxxxxxx`
   - `TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx`
   - `TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886`
6. Install ngrok to expose localhost:
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```
7. Copy the ngrok URL (e.g. `https://abc123.ngrok.io`)
8. In Twilio sandbox settings, set the webhook URL to:
   `https://abc123.ngrok.io/api/whatsapp/webhook`
9. Now message the Twilio number from any WhatsApp → your bot will respond! 🎉

---

## Demo Script for Judges (60 Sec Auto-Play Flow)

**Preparation**: Click the floating "🎬 Demo Mode" button on any page to auto-play this sequence:

1. **Landing Page**: The app cycles through all 6 supported languages dynamically to show true multilingual support.
2. **WhatsApp Bot**: Clicks "WhatsApp Demo" and auto-types a symptom in Kannada ("ನನಗೆ 2 ವಾರಗಳಿಂದ ಕೆಮ್ಮು ಮತ್ತು ಜ್ವರ ಇದೆ" - I have cough and fever for 2 weeks).
3. **AI Follow-up**: The bot detects the language, replies in Kannada, and asks follow-up questions to calculate risk.
4. **Triaging & Results**: Shows High Risk for TB (78%).
5. **ABHA Generation**: Generates a mock ABHA ID instantly with a QR code animation.
6. **PHC Booking**: Automatically locates the nearest Primary Health Center in Karnataka and books an appointment.
7. **ASHA Dashboard**: Switches to the ASHA worker view to prove that the flagged TB case immediately appeared for local health workers.
8. **Conclusion**: Displays "Lives saved in 52 seconds" to emphasize the speed and impact of the platform.
