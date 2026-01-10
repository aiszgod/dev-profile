// // // server/utils/emailService.js
// // const nodemailer = require('nodemailer');

// // // Create transporter (NO 'ER' at the end!)
// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS
// //   }
// // });

// // // Send verification email to employer
// // const sendVerificationEmail = async (employerEmail, candidateName, chatLink) => {
// //   try {
// //     const mailOptions = {
// //       from: process.env.EMAIL_USER,
// //       to: employerEmail,
// //       subject: `Background Verification Request for ${candidateName}`,
// //       html: `
// //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
// //           <h2 style="color: #4F46E5;">Background Verification Request</h2>
// //           <p>Hello,</p>
// //           <p>You have been listed as a reference by <strong>${candidateName}</strong> for background verification.</p>
// //           <p>Please join the verification chat room to provide feedback:</p>
// //           <div style="margin: 30px 0;">
// //             <a href="${chatLink}" 
// //                style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
// //               Join Verification Chat
// //             </a>
// //           </div>
// //           <p style="color: #666; font-size: 14px;">
// //             This is an automated email. Please do not reply to this message.
// //           </p>
// //           <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
// //           <p style="color: #999; font-size: 12px;">
// //             Developer Profile Analyzer - Background Verification System
// //           </p>
// //         </div>
// //       `
// //     };

// //     const info = await transporter.sendMail(mailOptions);
// //     console.log('✅ Email sent:', info.messageId);
// //     return { success: true, messageId: info.messageId };
    
// //   } catch (error) {
// //     console.error('❌ Email error:', error);
// //     return { success: false, error: error.message };
// //   }
// // };

// // // Send notification to candidate
// // const sendCandidateNotification = async (candidateEmail, candidateName, chatLink) => {
// //   try {
// //     const mailOptions = {
// //       from: process.env.EMAIL_USER,
// //       to: candidateEmail,
// //       subject: 'Your Background Verification is Being Processed',
// //       html: `
// //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
// //           <h2 style="color: #059669;">Verification Initiated</h2>
// //           <p>Hi ${candidateName},</p>
// //           <p>Your background verification process has been initiated. We've contacted your previous employer/faculty.</p>
// //           <p>You can track the verification progress here:</p>
// //           <div style="margin: 30px 0;">
// //             <a href="${chatLink}" 
// //                style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
// //               View Verification Chat
// //             </a>
// //           </div>
// //           <p style="color: #666; font-size: 14px;">
// //             This is an automated email. Please do not reply to this message.
// //           </p>
// //         </div>
// //       `
// //     };

// //     const info = await transporter.sendMail(mailOptions);
// //     console.log('✅ Candidate email sent:', info.messageId);
// //     return { success: true, messageId: info.messageId };
    
// //   } catch (error) {
// //     console.error('❌ Email error:', error);
// //     return { success: false, error: error.message };
// //   }
// // };

// // module.exports = {
// //   sendVerificationEmail,
// //   sendCandidateNotification
// // };
// // server/utils/emailService.js - FIXED VERSION
// const sgMail = require('@sendgrid/mail');

// // Validate and initialize SendGrid
// const initializeSendGrid = () => {
//   const apiKey = process.env.SENDGRID_API_KEY;
  
//   if (!apiKey) {
//     console.error('❌ SENDGRID_API_KEY is missing in .env file!');
//     console.error('   Get your API key from: https://app.sendgrid.com/settings/api_keys');
//     return false;
//   }

//   if (apiKey.length < 50) {
//     console.error('❌ SENDGRID_API_KEY appears to be invalid (too short)');
//     return false;
//   }

//   try {
//     sgMail.setApiKey(apiKey);
//     console.log('✅ SendGrid initialized successfully');
//     console.log('📧 From email:', process.env.EMAIL_USER || 'NOT SET');
//     return true;
//   } catch (error) {
//     console.error('❌ SendGrid initialization failed:', error.message);
//     return false;
//   }
// };

// const isInitialized = initializeSendGrid();

// // Helper to validate email format
// const isValidEmail = (email) => {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return regex.test(email);
// };

// // Send verification email to employer
// const sendVerificationEmail = async (employerEmail, candidateName, chatLink) => {
//   if (!isInitialized) {
//     console.error('❌ SendGrid not initialized. Email not sent.');
//     return { success: false, error: 'Email service not configured' };
//   }

//   if (!isValidEmail(employerEmail)) {
//     console.error('❌ Invalid employer email:', employerEmail);
//     return { success: false, error: 'Invalid email address' };
//   }

//   const fromEmail = process.env.EMAIL_USER;
  
//   if (!fromEmail) {
//     console.error('❌ EMAIL_USER not set in .env');
//     return { success: false, error: 'Sender email not configured' };
//   }

//   try {
//     console.log('📧 Preparing email to employer:', employerEmail);
//     console.log('📤 From:', fromEmail);
//     console.log('🔗 Chat link:', chatLink);

//     const msg = {
//       to: employerEmail,
//       from: {
//         email: fromEmail,
//         name: 'Dev Profile Analyzer - Background Verification'
//       },
//       subject: `🔍 Background Verification Request for ${candidateName}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         </head>
//         <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
//           <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
//             <!-- Header -->
//             <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
//               <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
//                 🔍 Background Verification Request
//               </h1>
//             </div>
            
//             <!-- Content -->
//             <div style="padding: 40px 30px;">
//               <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
//                 Hello,
//               </p>
              
//               <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
//                 You have been listed as a reference by <strong style="color: #667eea;">${candidateName}</strong> 
//                 for background verification.
//               </p>
              
//               <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 30px 0;">
//                 Please click the button below to join the verification chat room and provide your feedback:
//               </p>
              
//               <!-- Button -->
//               <div style="text-align: center; margin: 40px 0;">
//                 <a href="${chatLink}" 
//                    style="display: inline-block;
//                           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//                           color: #ffffff;
//                           text-decoration: none;
//                           padding: 16px 40px;
//                           border-radius: 8px;
//                           font-weight: bold;
//                           font-size: 16px;
//                           box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
//                   🚀 Join Verification Chat
//                 </a>
//               </div>
              
//               <!-- Alternative Link -->
//               <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
//                 <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
//                   <strong>Or copy this link:</strong>
//                 </p>
//                 <p style="margin: 0; word-break: break-all;">
//                   <a href="${chatLink}" 
//                      style="color: #667eea; text-decoration: underline; font-size: 14px;">
//                     ${chatLink}
//                   </a>
//                 </p>
//               </div>
              
//               <!-- Info Box -->
//               <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 30px 0;">
//                 <p style="margin: 0; color: #1e40af; font-size: 14px;">
//                   💡 <strong>What to expect:</strong><br>
//                   You'll be able to chat with the recruiter and candidate in a secure, private room.
//                 </p>
//               </div>
              
//               <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
//               <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
//                 This is an automated email. Please do not reply.<br>
//                 Dev Profile Analyzer - Background Verification System
//               </p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `,
//       // Plain text fallback
//       text: `
// Background Verification Request

// You have been listed as a reference by ${candidateName} for background verification.

// Please join the verification chat room: ${chatLink}

// This is an automated email. Please do not reply.
// Dev Profile Analyzer - Background Verification System
//       `
//     };

//     console.log('📤 Sending email via SendGrid...');
//     const result = await sgMail.send(msg);
    
//     console.log('✅ Employer email sent successfully!');
//     console.log('   Status:', result[0].statusCode);
//     console.log('   Message ID:', result[0].headers['x-message-id']);
    
//     return { 
//       success: true, 
//       messageId: result[0].headers['x-message-id'],
//       statusCode: result[0].statusCode
//     };
    
//   } catch (error) {
//     console.error('❌ SendGrid Error:', error.message);
    
//     if (error.response) {
//       console.error('   Status:', error.response.statusCode);
//       console.error('   Body:', JSON.stringify(error.response.body, null, 2));
      
//       // Common SendGrid errors
//       if (error.response.body?.errors) {
//         error.response.body.errors.forEach(err => {
//           console.error(`   • ${err.message}`);
//         });
//       }
//     }
    
//     return { 
//       success: false, 
//       error: error.message,
//       details: error.response?.body
//     };
//   }
// };

// // Send notification to candidate
// const sendCandidateNotification = async (candidateEmail, candidateName, chatLink) => {
//   if (!isInitialized) {
//     console.error('❌ SendGrid not initialized. Email not sent.');
//     return { success: false, error: 'Email service not configured' };
//   }

//   if (!isValidEmail(candidateEmail)) {
//     console.error('❌ Invalid candidate email:', candidateEmail);
//     return { success: false, error: 'Invalid email address' };
//   }

//   const fromEmail = process.env.EMAIL_USER;
  
//   if (!fromEmail) {
//     console.error('❌ EMAIL_USER not set in .env');
//     return { success: false, error: 'Sender email not configured' };
//   }

//   try {
//     console.log('📧 Preparing email to candidate:', candidateEmail);

//     const msg = {
//       to: candidateEmail,
//       from: {
//         email: fromEmail,
//         name: 'Dev Profile Analyzer - Background Verification'
//       },
//       subject: '✅ Your Background Verification is Being Processed',
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         </head>
//         <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
//           <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
//             <!-- Header -->
//             <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
//               <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
//                 ✅ Verification Initiated
//               </h1>
//             </div>
            
//             <!-- Content -->
//             <div style="padding: 40px 30px;">
//               <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
//                 Hi <strong style="color: #10b981;">${candidateName}</strong>,
//               </p>
              
//               <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
//                 Your background verification process has been successfully initiated. 
//                 We've contacted your previous employer/faculty.
//               </p>
              
//               <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 30px 0;">
//                 You can track the verification progress here:
//               </p>
              
//               <!-- Button -->
//               <div style="text-align: center; margin: 40px 0;">
//                 <a href="${chatLink}" 
//                    style="display: inline-block;
//                           background: linear-gradient(135deg, #10b981 0%, #059669 100%);
//                           color: #ffffff;
//                           text-decoration: none;
//                           padding: 16px 40px;
//                           border-radius: 8px;
//                           font-weight: bold;
//                           font-size: 16px;
//                           box-shadow: 0 4px 6px rgba(16, 185, 129, 0.4);">
//                   📊 View Verification Chat
//                 </a>
//               </div>
              
//               <!-- Info Box -->
//               <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0;">
//                 <p style="margin: 0 0 10px 0; color: #047857; font-size: 14px;">
//                   <strong>💡 What happens next?</strong>
//                 </p>
//                 <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 14px;">
//                   <li>Your reference will receive an email</li>
//                   <li>They'll join the verification chat room</li>
//                   <li>You can participate in the conversation</li>
//                   <li>The recruiter will review the feedback</li>
//                 </ul>
//               </div>
              
//               <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
//               <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
//                 This is an automated email. Please do not reply.<br>
//                 Dev Profile Analyzer - Background Verification System
//               </p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `,
//       text: `
// Your Background Verification is Being Processed

// Hi ${candidateName},

// Your background verification process has been successfully initiated.
// Track the progress here: ${chatLink}

// This is an automated email. Please do not reply.
// Dev Profile Analyzer - Background Verification System
//       `
//     };

//     console.log('📤 Sending email via SendGrid...');
//     const result = await sgMail.send(msg);
    
//     console.log('✅ Candidate email sent successfully!');
//     console.log('   Status:', result[0].statusCode);
    
//     return { 
//       success: true, 
//       messageId: result[0].headers['x-message-id'],
//       statusCode: result[0].statusCode
//     };
    
//   } catch (error) {
//     console.error('❌ SendGrid Error:', error.message);
    
//     if (error.response) {
//       console.error('   Status:', error.response.statusCode);
//       console.error('   Body:', JSON.stringify(error.response.body, null, 2));
//     }
    
//     return { 
//       success: false, 
//       error: error.message,
//       details: error.response?.body
//     };
//   }
// };

// // Test function to verify SendGrid setup
// const testEmailConfiguration = async () => {
//   if (!isInitialized) {
//     return { success: false, error: 'SendGrid not initialized' };
//   }

//   const testEmail = process.env.EMAIL_USER;
  
//   try {
//     const msg = {
//       to: testEmail,
//       from: testEmail,
//       subject: 'SendGrid Test - Dev Profile Analyzer',
//       text: 'This is a test email from Dev Profile Analyzer. If you receive this, SendGrid is configured correctly!',
//       html: '<p>This is a test email from <strong>Dev Profile Analyzer</strong>. If you receive this, SendGrid is configured correctly!</p>'
//     };

//     const result = await sgMail.send(msg);
//     console.log('✅ Test email sent successfully!');
//     return { success: true, statusCode: result[0].statusCode };
    
//   } catch (error) {
//     console.error('❌ Test email failed:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// module.exports = {
//   sendVerificationEmail,
//   sendCandidateNotification,
//   testEmailConfiguration
// };
// ==================================================
// SENDGRID TROUBLESHOOTING & FIX
// ==================================================
// Replace your emailService.js with this enhanced version

const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with better error handling
const initializeSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const emailUser = process.env.EMAIL_USER;
  
  console.log('🔍 SendGrid Initialization Check:');
  console.log('   API Key exists:', !!apiKey);
  console.log('   API Key length:', apiKey?.length || 0);
  console.log('   API Key format:', apiKey?.startsWith('SG.') ? '✅' : '❌');
  console.log('   EMAIL_USER exists:', !!emailUser);
  console.log('   EMAIL_USER value:', emailUser || 'NOT SET');
  
  if (!apiKey) {
    console.error('❌ SENDGRID_API_KEY missing!');
    return false;
  }

  if (!apiKey.startsWith('SG.')) {
    console.error('❌ SENDGRID_API_KEY has invalid format!');
    return false;
  }

  if (!emailUser) {
    console.error('❌ EMAIL_USER missing!');
    return false;
  }

  try {
    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ SendGrid initialization failed:', error.message);
    return false;
  }
};

const isInitialized = initializeSendGrid();

// Email validation
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Enhanced verification email with extensive logging
const sendVerificationEmail = async (employerEmail, candidateName, chatLink) => {
  console.log('\n📧 ========== SENDING VERIFICATION EMAIL ==========');
  console.log('Timestamp:', new Date().toISOString());
  console.log('To:', employerEmail);
  console.log('Candidate:', candidateName);
  console.log('Chat Link:', chatLink);
  
  if (!isInitialized) {
    console.error('❌ SendGrid not initialized');
    return { success: false, error: 'SendGrid not configured' };
  }

  if (!isValidEmail(employerEmail)) {
    console.error('❌ Invalid employer email:', employerEmail);
    return { success: false, error: 'Invalid email address' };
  }

  const fromEmail = process.env.EMAIL_USER;
  
  if (!fromEmail) {
    console.error('❌ EMAIL_USER not set');
    return { success: false, error: 'Sender email not configured' };
  }

  if (!isValidEmail(fromEmail)) {
    console.error('❌ Invalid sender email:', fromEmail);
    return { success: false, error: 'Invalid sender email' };
  }

  try {
    console.log('📝 Building email message...');
    
    const msg = {
      to: employerEmail,
      from: {
        email: fromEmail,
        name: 'Dev Profile Analyzer'
      },
      subject: `🔍 Background Verification Request for ${candidateName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                🔍 Background Verification Request
              </h1>
            </div>
            <div style="padding: 40px 30px;">
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                Hello,
              </p>
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                You have been listed as a reference by <strong style="color: #667eea;">${candidateName}</strong> 
                for background verification.
              </p>
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 30px 0;">
                Please click the button below to join the verification chat room:
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${chatLink}" 
                   style="display: inline-block;
                          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                          color: #ffffff;
                          text-decoration: none;
                          padding: 16px 40px;
                          border-radius: 8px;
                          font-weight: bold;
                          font-size: 16px;">
                  Join Verification Chat
                </a>
              </div>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                  <strong>Or copy this link:</strong>
                </p>
                <p style="margin: 0; word-break: break-all;">
                  <a href="${chatLink}" style="color: #667eea; text-decoration: underline; font-size: 14px;">
                    ${chatLink}
                  </a>
                </p>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                Dev Profile Analyzer - Background Verification System
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Background Verification Request

You have been listed as a reference by ${candidateName}.
Join the verification chat: ${chatLink}

Dev Profile Analyzer
      `
    };

    console.log('📤 Email Details:');
    console.log('   To:', msg.to);
    console.log('   From:', msg.from.email);
    console.log('   Subject:', msg.subject);
    console.log('   Has HTML:', !!msg.html);
    console.log('   Has Text:', !!msg.text);
    
    console.log('🚀 Sending via SendGrid...');
    const startTime = Date.now();
    
    const result = await sgMail.send(msg);
    
    const duration = Date.now() - startTime;
    console.log(`✅ EMAIL SENT SUCCESSFULLY in ${duration}ms!`);
    console.log('   Status Code:', result[0]?.statusCode);
    console.log('   Message ID:', result[0]?.headers?.['x-message-id']);
    console.log('   Response Headers:', JSON.stringify(result[0]?.headers, null, 2));
    console.log('================================================\n');
    
    return { 
      success: true, 
      messageId: result[0]?.headers?.['x-message-id'],
      statusCode: result[0]?.statusCode,
      duration: `${duration}ms`
    };
    
  } catch (error) {
    console.error('❌ ========== EMAIL SEND FAILED ==========');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    
    if (error.response) {
      console.error('HTTP Status:', error.response?.statusCode);
      console.error('Response Body:', JSON.stringify(error.response?.body, null, 2));
      
      // Parse SendGrid specific errors
      if (error.response?.body?.errors) {
        console.error('\nSendGrid Errors:');
        error.response.body.errors.forEach((err, idx) => {
          console.error(`  ${idx + 1}. ${err.message}`);
          if (err.field) console.error(`     Field: ${err.field}`);
          if (err.help) console.error(`     Help: ${err.help}`);
        });
      }
    }
    
    console.error('Full Error Object:', error);
    console.error('==========================================\n');
    
    return { 
      success: false, 
      error: error.message,
      statusCode: error.response?.statusCode,
      details: error.response?.body
    };
  }
};

// Enhanced candidate notification
const sendCandidateNotification = async (candidateEmail, candidateName, chatLink) => {
  console.log('\n📧 ========== SENDING CANDIDATE EMAIL ==========');
  console.log('To:', candidateEmail);
  console.log('Name:', candidateName);
  
  if (!isInitialized) {
    console.error('❌ SendGrid not initialized');
    return { success: false, error: 'SendGrid not configured' };
  }

  if (!isValidEmail(candidateEmail)) {
    console.error('❌ Invalid candidate email:', candidateEmail);
    return { success: false, error: 'Invalid email address' };
  }

  const fromEmail = process.env.EMAIL_USER;
  
  try {
    const msg = {
      to: candidateEmail,
      from: {
        email: fromEmail,
        name: 'Dev Profile Analyzer'
      },
      subject: '✅ Your Background Verification is Being Processed',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                ✅ Verification Initiated
              </h1>
            </div>
            <div style="padding: 40px 30px;">
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                Hi <strong>${candidateName}</strong>,
              </p>
              <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                Your background verification process has been initiated.
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${chatLink}" 
                   style="display: inline-block;
                          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                          color: #ffffff;
                          text-decoration: none;
                          padding: 16px 40px;
                          border-radius: 8px;
                          font-weight: bold;
                          font-size: 16px;">
                  View Verification Chat
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hi ${candidateName}, Your verification has been initiated. Track it here: ${chatLink}`
    };

    console.log('🚀 Sending candidate email...');
    const result = await sgMail.send(msg);
    
    console.log('✅ Candidate email sent!');
    console.log('   Message ID:', result[0]?.headers?.['x-message-id']);
    console.log('===============================================\n');
    
    return { 
      success: true, 
      messageId: result[0]?.headers?.['x-message-id'],
      statusCode: result[0]?.statusCode
    };
    
  } catch (error) {
    console.error('❌ Candidate email failed:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response?.body, null, 2));
    }
    
    return { 
      success: false, 
      error: error.message,
      details: error.response?.body
    };
  }
};

// Test email configuration
const testEmailConfiguration = async () => {
  console.log('\n🧪 ========== TESTING EMAIL CONFIGURATION ==========');
  
  if (!isInitialized) {
    return { success: false, error: 'SendGrid not initialized' };
  }

  const testEmail = process.env.EMAIL_USER;
  
  try {
    const msg = {
      to: testEmail,
      from: testEmail,
      subject: '🧪 SendGrid Test - Dev Profile Analyzer',
      text: 'Test email successful!',
      html: '<h2>✅ SendGrid is working!</h2><p>If you see this, your configuration is correct.</p>'
    };

    console.log('📤 Sending test email to:', testEmail);
    const result = await sgMail.send(msg);
    
    console.log('✅ Test email sent successfully!');
    console.log('   Status:', result[0]?.statusCode);
    console.log('   Message ID:', result[0]?.headers?.['x-message-id']);
    console.log('===================================================\n');
    
    return { 
      success: true, 
      statusCode: result[0]?.statusCode,
      messageId: result[0]?.headers?.['x-message-id']
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Details:', JSON.stringify(error.response?.body, null, 2));
    }
    
    return { 
      success: false, 
      error: error.message,
      details: error.response?.body
    };
  }
};

module.exports = {
  sendVerificationEmail,
  sendCandidateNotification,
  testEmailConfiguration
};

// ==================================================
// INSTRUCTIONS FOR DEBUGGING:
// ==================================================
/*

1. REPLACE YOUR CURRENT emailService.js WITH THIS FILE

2. ADD THIS TEST ROUTE TO server.js (temporarily):

   app.get('/api/test-sendgrid', async (req, res) => {
     const { testEmailConfiguration } = require('./utils/emailService');
     const result = await testEmailConfiguration();
     res.json(result);
   });

3. RESTART YOUR RENDER SERVER

4. TEST THE EMAIL:
   Visit: https://thenewdevprof.onrender.com/api/test-sendgrid
   
   This will:
   - Send a test email to EMAIL_USER
   - Show detailed logs in Render console
   - Return success/failure status

5. CHECK RENDER LOGS:
   Go to your Render dashboard → Logs
   Look for the detailed output starting with:
   "🧪 ========== TESTING EMAIL CONFIGURATION =========="

6. COMMON ISSUES TO CHECK IN LOGS:

   ❌ "Sender address not verified"
   → Go to SendGrid dashboard and verify EMAIL_USER
   → https://app.sendgrid.com/settings/sender_auth

   ❌ "API key invalid" or "403 Forbidden"
   → Generate new API key in SendGrid
   → Update SENDGRID_API_KEY in Render env vars

   ❌ "Daily send limit exceeded"
   → Wait 24 hours or upgrade SendGrid plan

   ❌ "The from address does not match a verified Sender Identity"
   → Your EMAIL_USER must be verified in SendGrid first

7. VERIFY IN SENDGRID DASHBOARD:
   https://app.sendgrid.com/email_activity
   
   You'll see:
   - All sent emails
   - Delivery status
   - Bounce/failure reasons
   - Detailed error messages

8. ONCE WORKING:
   - Keep this enhanced emailService.js
   - Remove the test route from server.js
   - Emails will now have detailed logging

*/