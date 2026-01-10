// // server/utils/emailService.js
// const nodemailer = require('nodemailer');

// // Create transporter (NO 'ER' at the end!)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Send verification email to employer
// const sendVerificationEmail = async (employerEmail, candidateName, chatLink) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: employerEmail,
//       subject: `Background Verification Request for ${candidateName}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #4F46E5;">Background Verification Request</h2>
//           <p>Hello,</p>
//           <p>You have been listed as a reference by <strong>${candidateName}</strong> for background verification.</p>
//           <p>Please join the verification chat room to provide feedback:</p>
//           <div style="margin: 30px 0;">
//             <a href="${chatLink}" 
//                style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
//               Join Verification Chat
//             </a>
//           </div>
//           <p style="color: #666; font-size: 14px;">
//             This is an automated email. Please do not reply to this message.
//           </p>
//           <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
//           <p style="color: #999; font-size: 12px;">
//             Developer Profile Analyzer - Background Verification System
//           </p>
//         </div>
//       `
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('✅ Email sent:', info.messageId);
//     return { success: true, messageId: info.messageId };
    
//   } catch (error) {
//     console.error('❌ Email error:', error);
//     return { success: false, error: error.message };
//   }
// };

// // Send notification to candidate
// const sendCandidateNotification = async (candidateEmail, candidateName, chatLink) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: candidateEmail,
//       subject: 'Your Background Verification is Being Processed',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #059669;">Verification Initiated</h2>
//           <p>Hi ${candidateName},</p>
//           <p>Your background verification process has been initiated. We've contacted your previous employer/faculty.</p>
//           <p>You can track the verification progress here:</p>
//           <div style="margin: 30px 0;">
//             <a href="${chatLink}" 
//                style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
//               View Verification Chat
//             </a>
//           </div>
//           <p style="color: #666; font-size: 14px;">
//             This is an automated email. Please do not reply to this message.
//           </p>
//         </div>
//       `
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('✅ Candidate email sent:', info.messageId);
//     return { success: true, messageId: info.messageId };
    
//   } catch (error) {
//     console.error('❌ Email error:', error);
//     return { success: false, error: error.message };
//   }
// };

// module.exports = {
//   sendVerificationEmail,
//   sendCandidateNotification
// };
// server/utils/emailService.js
const nodemailer = require('nodemailer');

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️  EMAIL_USER or EMAIL_PASS not configured');
}

// Create transporter with better config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Timeout settings
  connectionTimeout: 10000,  // 10 seconds
  greetingTimeout: 5000,     // 5 seconds  
  socketTimeout: 10000,      // 10 seconds
  // Debug
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development'
});

// Verify transporter on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
    console.error('   Check EMAIL_USER and EMAIL_PASS in environment variables');
  } else {
    console.log('✅ Email server ready:', process.env.EMAIL_USER);
  }
});

// Send verification email to employer
const sendVerificationEmail = async (employerEmail, candidateName, chatLink) => {
  try {
    console.log('📧 Attempting to send email to employer:', employerEmail);
    
    if (!employerEmail || !employerEmail.includes('@')) {
      throw new Error('Invalid employer email address');
    }

    const mailOptions = {
      from: `"Dev Profile Analyzer" <${process.env.EMAIL_USER}>`,
      to: employerEmail,
      subject: `Background Verification Request for ${candidateName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Background Verification</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Hello,
            </p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              You have been listed as a reference by <strong style="color: #667eea;">${candidateName}</strong> 
              for background verification.
            </p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Please join the verification chat room to provide feedback:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${chatLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;
                        box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                🚀 Join Verification Chat
              </a>
            </div>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <strong>Direct Link:</strong><br>
                <a href="${chatLink}" style="color: #667eea; word-break: break-all;">${chatLink}</a>
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email from Dev Profile Analyzer<br>
              Background Verification System
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Employer email sent successfully:', info.messageId);
    console.log('   To:', employerEmail);
    console.log('   Response:', info.response);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send employer email:', error.message);
    console.error('   To:', employerEmail);
    console.error('   Error details:', error);
    return { success: false, error: error.message };
  }
};

// Send notification to candidate
const sendCandidateNotification = async (candidateEmail, candidateName, chatLink) => {
  try {
    console.log('📧 Attempting to send email to candidate:', candidateEmail);
    
    if (!candidateEmail || !candidateEmail.includes('@')) {
      throw new Error('Invalid candidate email address');
    }

    const mailOptions = {
      from: `"Dev Profile Analyzer" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: 'Your Background Verification is Being Processed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Verification Initiated</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Hi <strong style="color: #10b981;">${candidateName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Your background verification process has been <strong>successfully initiated</strong>. 
              We've contacted your previous employer/faculty.
            </p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              You can track the verification progress here:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${chatLink}" 
                 style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block;
                        font-weight: bold;
                        font-size: 16px;
                        box-shadow: 0 4px 6px rgba(16, 185, 129, 0.4);">
                📊 View Verification Chat
              </a>
            </div>
            
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #047857; font-size: 14px;">
                <strong>💡 What happens next?</strong><br>
                Your reference will receive an email to join the verification chat. 
                You'll be notified of any updates.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email from Dev Profile Analyzer<br>
              Background Verification System
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Candidate email sent successfully:', info.messageId);
    console.log('   To:', candidateEmail);
    console.log('   Response:', info.response);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send candidate email:', error.message);
    console.error('   To:', candidateEmail);
    console.error('   Error details:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendCandidateNotification
};