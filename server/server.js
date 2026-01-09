const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

dotenv.config();
const { parseResume } = require('./utils/parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads folder');
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://dev-prof-analyzer-arvind.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' }
});
app.use('/api/', limiter);

// Multer configuration
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

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Dev Profile Analyzer API ✅',
    endpoints: {
      github: '/api/github/:username',
      leetcode: '/api/leetcode/:username', 
      hackerrank: '/api/hackerrank/:username',
      upload: '/api/upload (POST multipart)',
      analyze: '/api/analyze (POST)',
      chat: '/api/chat (POST)'
    }
  });
});

// ============================================
// CHAT ROUTE - INLINE FOR DEBUGGING
// ============================================
app.post('/api/chat', async (req, res) => {
  console.log('🎯 Chat endpoint hit');
  console.log('📦 Request body keys:', Object.keys(req.body));
  
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment variables!');
      return res.status(500).json({ 
        success: false, 
        error: 'Gemini API key not configured. Please add GEMINI_API_KEY to environment variables.' 
      });
    }

    const { messages, profileData } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ Invalid messages format');
      return res.status(400).json({ 
        success: false, 
        error: 'No messages provided or invalid format' 
      });
    }

    console.log('✅ Messages received:', messages.length);
    console.log('✅ Profile data:', profileData ? 'Present' : 'Missing');

    // Build context
    let context = 'You are a helpful career advisor specializing in software development. ';
    context += 'Provide detailed, actionable advice based on the developer profile.\n\n';
    
    let hasData = false;
    
    if (profileData) {
      if (profileData.resumeData) {
        hasData = true;
        context += `=== RESUME ===\n`;
        context += `Name: ${profileData.resumeData.name || 'N/A'}\n`;
        context += `Skills: ${profileData.resumeData.skills || 'N/A'}\n`;
        context += `Experience: ${profileData.resumeData.experience || 'N/A'}\n`;
        context += `Education: ${profileData.resumeData.education || 'N/A'}\n\n`;
      }

      if (profileData.githubData) {
        hasData = true;
        context += `=== GITHUB ===\n`;
        context += `Username: ${profileData.githubData.username}\n`;
        context += `Repos: ${profileData.githubData.publicRepos}\n`;
        context += `Stars: ${profileData.githubData.totalStars}\n`;
        context += `Followers: ${profileData.githubData.followers}\n`;
        if (profileData.githubData.topLanguages) {
          context += `Languages: ${profileData.githubData.topLanguages}\n`;
        }
        context += '\n';
      }
      
      if (profileData.leetcodeData) {
        hasData = true;
        context += `=== LEETCODE ===\n`;
        context += `Username: ${profileData.leetcodeData.username}\n`;
        context += `Solved: ${profileData.leetcodeData.totalSolved}\n`;
        context += `Easy: ${profileData.leetcodeData.easySolved}, Medium: ${profileData.leetcodeData.mediumSolved}, Hard: ${profileData.leetcodeData.hardSolved}\n\n`;
      }
      
      if (profileData.hackerrankData) {
        hasData = true;
        context += `=== HACKERRANK ===\n`;
        context += `Username: ${profileData.hackerrankData.username}\n`;
        context += `Challenges: ${profileData.hackerrankData.challengesSolved}\n`;
        context += `Badges: ${profileData.hackerrankData.totalBadges}\n\n`;
      }
      
      if (profileData.aiAnalysis) {
        hasData = true;
        context += `=== AI ANALYSIS ===\n`;
        context += `Overall Score: ${profileData.aiAnalysis.overallScore}/100\n`;
        if (profileData.aiAnalysis.summary) {
          context += `Summary: ${profileData.aiAnalysis.summary}\n`;
        }
        context += '\n';
      }
    }

    if (!hasData) {
      context += 'NOTE: No profile data uploaded yet. Encourage user to upload resume and connect profiles.\n\n';
    }

    // Build conversation
    const conversation = messages
      .slice(-5)
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
    
    const prompt = `${context}CONVERSATION:\n${conversation}\n\nAssistant:`;

    console.log('🔄 Calling Gemini API...');

    // Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
          topP: 0.85,
          topK: 40
        }
      })
    });

    console.log('✅ Gemini API response status:', geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('❌ Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorData}`);
    }

    const data = await geminiResponse.json();
    
    if (data.error) {
      console.error('❌ Gemini error:', data.error);
      throw new Error(`Gemini API error: ${data.error.message}`);
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                  "I'm here to help! How can I assist you with your developer profile today?";

    console.log('✅ Response generated successfully');

    res.json({ 
      success: true, 
      message: reply.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('🚨 Chat Error:', err.message);
    console.error('🚨 Error stack:', err.stack);
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process chat request',
      details: err.message
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('🚨 ERROR:', error.message);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (5MB max)' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ error: error.message });
});

const server = app.listen(PORT, () => {
  console.clear();
  console.log('='.repeat(60));
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📱 Client: http://localhost:5173`);
  console.log(`📁 Uploads: ${uploadsDir}`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log('✅ All APIs ready');
  console.log('='.repeat(60));
});

module.exports = app;