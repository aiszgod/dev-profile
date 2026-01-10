# 🚀 Developer Profile Analyzer

AI-powered platform for analyzing developer profiles and conducting real-time background verifications.

## ✨ Features

- 📊 **Profile Analytics** - GitHub, LeetCode, HackerRank integration
- 🤖 **AI Analysis** - Gemini-powered profile scoring and recommendations
- 📄 **Resume Parser** - PDF/DOCX resume analysis
- 💬 **Real-time Chat** - Socket.IO-based verification system
- ✉️ **Email Notifications** - SendGrid integration
- 🔐 **Google OAuth** - Secure authentication

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- TailwindCSS
- Socket.IO Client
- React Router

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- SendGrid
- Google OAuth 2.0
- Gemini AI

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud OAuth credentials
- SendGrid API key
- Gemini API key

### Setup

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/dev-profile-analyzer.git
cd dev-profile-analyzer
```

**2. Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

**3. Environment Variables**

Create `.env` in `server/`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_uri

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT
JWT_SECRET=your_jwt_secret

# Email
SENDGRID_API_KEY=SG.your_sendgrid_key
EMAIL_USER=verified@yourdomain.com

# AI
GEMINI_API_KEY=your_gemini_key

# Client
CLIENT_URL=http://localhost:5173
```

Create `.env` in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

**4. Run the application**
```bash
# Backend (port 5000)
cd server
npm run dev

# Frontend (port 5173)
cd client
npm run dev
```

## 🚀 Deployment

**Frontend (Vercel):**
```bash
cd client
vercel --prod
```

**Backend (Render):**
- Connect GitHub repo
- Add environment variables
- Deploy

## 📧 Email Configuration

1. **Verify sender in SendGrid:**
   - Go to SendGrid → Settings → Sender Authentication
   - Verify your `EMAIL_USER` address

2. **Test email:**
   ```
   GET https://your-api.com/api/test-sendgrid
   ```

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google` | GET | Initiate Google login |
| `/api/github/:username` | GET | Fetch GitHub stats |
| `/api/leetcode/:username` | GET | Fetch LeetCode stats |
| `/api/upload` | POST | Upload resume |
| `/api/analyze` | POST | AI profile analysis |
| `/api/verification/submit` | POST | Start verification |
| `/chat/:roomId` | WS | Real-time chat |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Author
ARVIND SINGH

## 🙏 Acknowledgments

- Google Gemini AI
- SendGrid
- MongoDB Atlas
- Vercel & Render

---

⭐ Star this repo if you find it helpful!
