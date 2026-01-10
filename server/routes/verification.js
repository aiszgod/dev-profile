// const express = require('express');
// const { v4: uuidv4 } = require('uuid');
// const Candidate = require('../models/Candidate');
// const ChatRoom = require('../models/ChatRoom');
// const { sendVerificationEmail, sendCandidateNotification } = require('../utils/emailService');

// const router = express.Router();

// // Submit candidate form
// router.post('/submit', async (req, res) => {
//   try {
//     const { name, email, skills, experience, employerEmail, recruiterEmail } = req.body;

//     // Validate required fields
//     if (!name || !email || !skills || !experience || !employerEmail || !recruiterEmail) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'All fields are required' 
//       });
//     }

//     // Generate unique room ID
//     const roomId = uuidv4();

//     // Create candidate entry
//     const candidate = new Candidate({
//       name,
//       email,
//       skills,
//       experience,
//       employerEmail,
//       roomId,
//       createdBy: recruiterEmail,
//       status: 'pending'
//     });

//     await candidate.save();
//     console.log('✅ Candidate saved:', candidate._id);

//     // Create chat room
//     const chatRoom = new ChatRoom({
//       roomId,
//       candidateId: candidate._id,
//       participants: {
//         recruiter: {
//           email: recruiterEmail,
//           name: 'Recruiter',
//           joinedAt: new Date()
//         },
//         candidate: {
//           email,
//           name,
//           joinedAt: null
//         },
//         employer: {
//           email: employerEmail,
//           name: 'Employer',
//           joinedAt: null
//         }
//       },
//       messages: [],
//       status: 'active'
//     });

//     await chatRoom.save();
//     console.log('✅ Chat room created:', roomId);

//     // Generate chat link
//     const chatLink = `${process.env.CLIENT_URL}/chat/${roomId}`;

//     // Send emails
//     const emailResults = await Promise.allSettled([
//       sendVerificationEmail(employerEmail, name, chatLink),
//       sendCandidateNotification(email, name, chatLink)
//     ]);

//     console.log('📧 Email results:', emailResults);

//     res.json({
//       success: true,
//       message: 'Verification initiated successfully',
//       data: {
//         candidateId: candidate._id,
//         roomId,
//         chatLink,
//         emailStatus: {
//           employer: emailResults[0].status === 'fulfilled' ? 'sent' : 'failed',
//           candidate: emailResults[1].status === 'fulfilled' ? 'sent' : 'failed'
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Submit error:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to submit verification request',
//       details: error.message 
//     });
//   }
// });

// // Get chat room details
// router.get('/room/:roomId', async (req, res) => {
//   try {
//     const { roomId } = req.params;

//     const chatRoom = await ChatRoom.findOne({ roomId })
//       .populate('candidateId')
//       .lean();

//     if (!chatRoom) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Chat room not found' 
//       });
//     }

//     res.json({
//       success: true,
//       data: chatRoom
//     });

//   } catch (error) {
//     console.error('❌ Get room error:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch chat room',
//       details: error.message 
//     });
//   }
// });

// // Get all verifications (for recruiter dashboard)
// router.get('/list', async (req, res) => {
//   try {
//     const { recruiterEmail } = req.query;

//     const candidates = await Candidate.find({ 
//       createdBy: recruiterEmail 
//     })
//     .sort({ createdAt: -1 })
//     .lean();

//     res.json({
//       success: true,
//       data: candidates
//     });

//   } catch (error) {
//     console.error('❌ List error:', error);
//     res.status(500).json({ 
//       success: false,       error: 'Failed to fetch verifications',
//       details: error.message 
//     });
//   }
// });

// module.exports = router;

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Candidate = require('../models/Candidate');
const ChatRoom = require('../models/ChatRoom');
const { sendVerificationEmail, sendCandidateNotification } = require('../utils/emailService');

const router = express.Router();

// Middleware to check MongoDB connection
const checkMongoConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: 'Database unavailable',
      details: 'MongoDB is not connected. Please contact support.'
    });
  }
  next();
};

// Apply to all routes
router.use(checkMongoConnection);

// Submit candidate form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, skills, experience, employerEmail, recruiterEmail } = req.body;

    console.log('📝 Verification request:', { name, email, recruiterEmail });

    // Validate required fields
    if (!name || !email || !skills || !experience || !employerEmail || !recruiterEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Generate unique room ID
    const roomId = uuidv4();
    console.log('🆔 Generated room ID:', roomId);

    // Create candidate entry with timeout
    console.log('💾 Creating candidate document...');
    const candidate = new Candidate({
      name,
      email,
      skills,
      experience,
      employerEmail,
      roomId,
      createdBy: recruiterEmail,
      status: 'pending'
    });

    // Save with timeout protection
    const savePromise = candidate.save();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database save timeout')), 8000)
    );

    await Promise.race([savePromise, timeoutPromise]);
    console.log('✅ Candidate saved:', candidate._id);

    // Create chat room
    console.log('💬 Creating chat room...');
    const chatRoom = new ChatRoom({
      roomId,
      candidateId: candidate._id,
      participants: {
        recruiter: {
          email: recruiterEmail,
          name: 'Recruiter',
          joinedAt: new Date()
        },
        candidate: {
          email,
          name,
          joinedAt: null
        },
        employer: {
          email: employerEmail,
          name: 'Employer',
          joinedAt: null
        }
      },
      messages: [],
      status: 'active'
    });

    const chatSavePromise = chatRoom.save();
    await Promise.race([chatSavePromise, timeoutPromise]);
    console.log('✅ Chat room created:', roomId);

    // Generate chat link
    const chatLink = `${process.env.CLIENT_URL}/chat/${roomId}`;
    console.log('🔗 Chat link:', chatLink);

    // Send response IMMEDIATELY (don't wait for emails)
    res.json({
      success: true,
      message: 'Verification initiated successfully',
      data: {
        candidateId: candidate._id,
        roomId,
        chatLink,
        emailStatus: {
          employer: 'sending',
          candidate: 'sending'
        }
      }
    });

    // Send emails AFTER response (fire and forget)
    console.log('📧 Sending emails in background...');
    Promise.allSettled([
      sendVerificationEmail(employerEmail, name, chatLink),
      sendCandidateNotification(email, name, chatLink)
    ]).then(emailResults => {
      console.log('📬 Email results:', emailResults.map(r => r.status));
    }).catch(err => {
      console.error('📧 Email error:', err.message);
    });

  } catch (error) {
    console.error('❌ Submit error:', error);
    
    // More detailed error response
    let errorMessage = 'Failed to submit verification request';
    let statusCode = 500;
    
    if (error.message.includes('timeout')) {
      errorMessage = 'Database operation timed out. Please try again.';
      statusCode = 504;
    } else if (error.name === 'ValidationError') {
      errorMessage = 'Invalid data provided';
      statusCode = 400;
    }
    
    res.status(statusCode).json({ 
      success: false, 
      error: errorMessage,
      details: error.message 
    });
  }
});

// Get chat room details
router.get('/room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log('🔍 Fetching room:', roomId);

    const chatRoom = await ChatRoom.findOne({ roomId })
      .populate('candidateId')
      .maxTimeMS(5000) // 5 second timeout
      .lean();

    if (!chatRoom) {
      return res.status(404).json({ 
        success: false, 
        error: 'Chat room not found' 
      });
    }

    console.log('✅ Room found:', roomId);
    res.json({
      success: true,
      data: chatRoom
    });

  } catch (error) {
    console.error('❌ Get room error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch chat room',
      details: error.message 
    });
  }
});

// Get all verifications (for recruiter dashboard)
router.get('/list', async (req, res) => {
  try {
    const { recruiterEmail } = req.query;

    if (!recruiterEmail) {
      return res.status(400).json({
        success: false,
        error: 'Recruiter email is required'
      });
    }

    console.log('📋 Fetching verifications for:', recruiterEmail);

    const candidates = await Candidate.find({ 
      createdBy: recruiterEmail 
    })
    .sort({ createdAt: -1 })
    .maxTimeMS(5000)
    .lean();

    console.log('✅ Found', candidates.length, 'verifications');

    res.json({
      success: true,
      data: candidates
    });

  } catch (error) {
    console.error('❌ List error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch verifications',
      details: error.message 
    });
  }
});

module.exports = router;