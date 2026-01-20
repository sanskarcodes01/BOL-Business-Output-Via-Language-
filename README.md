
# B.O.L (Business Output via Language)
### Unified Command Center for Indian MSMEs

B.O.L is a voice-first, bilingual (English/Hindi) ERP designed specifically for non-technical small business owners in India. It aims to replace messy notebooks and fragmented WhatsApp chains with a streamlined, AI-driven interface.

## 🚀 Project Vision
MSME owners often struggle with digitizing accounts because of typing friction and language barriers. B.O.L solves this by:
1.  **Eliminating Typing:** Adding stock or recording sales via natural voice commands.
2.  **Automating Vision:** Using Gemini Vision to "read" paper bills and populate digital ledgers.
3.  **Real-time Insights:** Instant dashboards and "B.O.L Credit Score" for financial inclusion.

## 🛠️ Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS.
- **AI Backend:** Google Gemini API (Flash 2.5/3) for NLP and OCR.
- **State Management:** LocalStorage (Offline-first simulation).
- **Icons:** Lucide-React.

## 📈 Monetization Strategy
- **Freemium Model:** Basic tracking is free.
- **Premium Subscription:** Automated WhatsApp receipts, custom GST reports, and advanced analytics.
- **Fintech Integration:** Partner with lenders to offer instant credit based on the verified sales data logged in the app.

## 🗺️ Roadmap
- [x] **Phase 1:** Core UI, Bilingual Support, Voice-to-Intent Parsing.
- [x] **Phase 2:** Vision Bill Scanning, Dashboard Analytics, Settings.
- [ ] **Phase 3:** Live WhatsApp API Integration, Multi-user Staff Access.
- [ ] **Phase 4:** Micro-lending Marketplace & Credit Scoring.

## 🛠️ Setup Guide
1. Obtain a **Google Gemini API Key**.
2. Set the environment variable `API_KEY` in your hosting context.
3. Run `npm install` and `npm start`.
