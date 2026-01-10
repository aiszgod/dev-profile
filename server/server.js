const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();
const { parseResume } = require('./utils/parser');

// Debug environment variables
console.log('🔍 Environment Check:');
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// ============================================
// MONGODB CONNECTION
// ============================================
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } else {
      console.warn('⚠️  MongoDB not configured. Verification features will be disabled.');
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

connectDB();

// ============================================
// SOCKET.IO SETUP
// ============================================
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://dev-prof-analyzer-arvind.vercel.app',
      process.env.CLIENT_URL
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Initialize socket handlers only if MongoDB is connected
if (mongoose.connection.readyState === 1) {
  try {
    require('./sockets/chatHandler')(io);
    console.log('✅ Socket.IO chat handler initialized');
  } catch (err) {
    console.warn('⚠️  Socket chat handler not found:', err.message);
  }
} else {
  mongoose.connection.on('connected', () => {
    try {
      require('./sockets/chatHandler')(io);
      console.log('✅ Socket.IO chat handler initialized');
    } catch (err) {
      console.warn('⚠️  Socket chat handler not found:', err.message);
    }
  });
}

app.set('io', io);

// Create uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads folder');
}

// ============================================
// GOOGLE OAUTH CONFIGURATION
// ============================================
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        console.log('✅ Google auth successful for:', profile.emails[0].value);
        const user = {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value,
          provider: 'google'
        };
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  
  console.log('🔐 Google OAuth configured');
} else {
  console.warn('⚠️  Google OAuth not configured');
}

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://dev-prof-analyzer-arvind.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' }
});
app.use('/api/', limiter);

// ============================================
// MULTER CONFIGURATION
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.originalname.match(/\.(pdf|docx)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Dev Profile Analyzer API ✅',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: {
      profileAnalysis: '✅',
      googleAuth: process.env.GOOGLE_CLIENT_ID ? '✅' : '❌',
      aiChat: process.env.GEMINI_API_KEY ? '✅' : '❌',
      backgroundVerification: mongoose.connection.readyState === 1 ? '✅' : '❌',
      realTimeChat: '✅',
      emailNotifications: process.env.EMAIL_USER ? '✅' : '❌'
    },
    endpoints: {
      auth: '/api/auth/*',
      verification: '/api/verification/*',
      profiles: '/api/github|leetcode|hackerrank/:username',
      upload: '/api/upload',
      analyze: '/api/analyze',
      chat: '/api/chat'
    }
  });
});

// ============================================
// AUTH ROUTES
// ============================================
app.get('/api/auth/google', (req, res, next) => {
  console.log('🔵 Initiating Google OAuth...');
  console.log('🔍 CLIENT_URL:', process.env.CLIENT_URL);
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

app.get('/api/auth/google/callback',
  (req, res, next) => {
    console.log('🔵 Google callback received');
    console.log('📍 Full callback URL:', req.originalUrl);
    console.log('📍 Query params:', req.query);
    
    passport.authenticate('google', { 
      failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}?error=google_auth_failed`,
      session: false 
    })(req, res, next);
  },
  (req, res) => {
    try {
      if (!req.user) {
        console.error('❌ No user data');
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?error=no_user_data`);
      }

      if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET not configured');
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?error=jwt_secret_missing`);
      }

      console.log('✅ Authentication successful');
      console.log('👤 User data:', {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture,
        provider: req.user.provider
      });

      const token = jwt.sign(
        { 
          id: req.user.id, 
          email: req.user.email,
          name: req.user.name,
          picture: req.user.picture
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('🔑 Token generated:', token.substring(0, 50) + '...');

      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}`;
      console.log('🔄 Redirecting to:', redirectUrl);
      
      res.redirect(redirectUrl);
      
    } catch (error) {
      console.error('❌ Auth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?error=token_generation_failed`);
    }
  }
);

app.get('/api/auth/me', authenticateToken, (req, res) => {
  console.log('👤 /auth/me called for user:', req.user.email);
  res.json({ success: true, user: req.user });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ============================================
// CHAT ROUTE (EXISTING AI CHAT)
// ============================================
app.post('/api/chat', async (req, res) => {
  console.log('🎯 Chat endpoint hit');
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Gemini API key not configured' 
      });
    }

    const { messages, profileData } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No messages provided' 
      });
    }

    let context = 'You are a helpful career advisor for software developers.\n\n';
    
    if (profileData) {
      if (profileData.resumeData) {
        context += `Resume: ${profileData.resumeData.name}, Skills: ${profileData.resumeData.skills}\n`;
      }
      if (profileData.githubData) {
        context += `GitHub: ${profileData.githubData.username}, ${profileData.githubData.publicRepos} repos\n`;
      }
      if (profileData.leetcodeData) {
        context += `LeetCode: ${profileData.leetcodeData.totalSolved} solved\n`;
      }
      if (profileData.aiAnalysis) {
        context += `AI Score: ${profileData.aiAnalysis.overallScore}/100\n`;
      }
    }

    const lastMessage = messages[messages.length - 1].content;
    const prompt = `${context}\nUser Question: ${lastMessage}\n\nProvide a helpful response:`;

    const modelConfigs = [
      { name: 'gemini-1.5-flash', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent' },
      { name: 'gemini-pro', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent' }
    ];

    for (const config of modelConfigs) {
      try {
        const geminiResponse = await fetch(
          `${config.url}?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
            })
          }
        );

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (reply) {
            return res.json({ 
              success: true, 
              message: reply.trim(),
              model: config.name
            });
          }
        }
      } catch (err) {
        continue;
      }
    }

    throw new Error('All models failed');

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process chat request'
    });
  }
});

// ============================================
// OTHER ROUTES
// ============================================
app.use('/api/github', require('./routes/github'));
app.use('/api/leetcode', require('./routes/leetcode'));
app.use('/api/hackerrank', require('./routes/hackerrank'));
app.use('/api/upload', upload.single('resume'), require('./routes/upload'));
app.use('/api/analyze', require('./routes/analyze'));

// ============================================
// VERIFICATION ROUTES (NEW - FIXED)
// ============================================
try {
  const verificationRouter = require('./routes/verification');
  app.use('/api/verification', verificationRouter);
  console.log('✅ Verification routes loaded');
} catch (err) {
  console.warn('⚠️  Verification routes not found:', err.message);
  // Fallback route
  app.all('/api/verification/*', (req, res) => {
    res.status(503).json({ 
      success: false, 
      error: 'Verification system unavailable. MongoDB or routes not configured.' 
    });
  });
}

// ============================================
// ERROR HANDLERS
// ============================================
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

app.use((error, req, res, next) => {
  console.error('🚨 ERROR:', error.message);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (5MB max)' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ 
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// ============================================
// START SERVER
// ============================================
httpServer.listen(PORT, () => {
  console.clear();
  console.log('='.repeat(60));
  console.log(`🚀 Server: ${process.env.NODE_ENV === 'production' ? 'https://thenewdevprof.onrender.com' : `http://localhost:${PORT}`}`);
  console.log(`📱 Client: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? '✅' : '❌'}`);
  console.log(`🗄️  MongoDB: ${mongoose.connection.readyState === 1 ? '✅' : '❌'}`);
  console.log(`⚡ Socket.IO: ✅`);
  console.log(`📧 Email: ${process.env.EMAIL_USER ? '✅' : '❌'}`);
  console.log('='.repeat(60));
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, httpServer, io };