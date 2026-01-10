// server/utils/emailService.js - ANTI-SPAM VERSION
const sgMail = require('@sendgrid/mail');

const initializeSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const emailUser = process.env.EMAIL_USER;
  
  console.log('📧 SendGrid Initialization Check:');
  console.log('   API Key exists:', !!apiKey);
  console.log('   API Key format:', apiKey?.startsWith('SG.') ? '✅' : '❌');
  console.log('   EMAIL_USER:', emailUser || 'NOT SET');
  
  if (!apiKey || !apiKey.startsWith('SG.')) {
    console.error('❌ Invalid SENDGRID_API_KEY');
    return false;
  }

  if (!emailUser) {
    console.error('❌ EMAIL_USER missing');
    return false;
  }

  try {
    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized');
    return true;
  } catch (error) {
    console.error('❌ SendGrid init failed:', error.message);
    return false;
  }
};

const isInitialized = initializeSendGrid();

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ============================================
// ANTI-SPAM EMAIL TEMPLATES
// ============================================

const sendVerificationEmail = async (employerEmail, candidateName, chatLink) => {
  console.log('\n📧 ========== SENDING VERIFICATION EMAIL ==========');
  console.log('To:', employerEmail);
  console.log('Candidate:', candidateName);
  
  if (!isInitialized) {
    console.error('❌ SendGrid not initialized');
    return { success: false, error: 'SendGrid not configured' };
  }

  if (!isValidEmail(employerEmail)) {
    console.error('❌ Invalid employer email:', employerEmail);
    return { success: false, error: 'Invalid email address' };
  }

  const fromEmail = process.env.EMAIL_USER;
  
  if (!fromEmail || !isValidEmail(fromEmail)) {
    console.error('❌ Invalid sender email');
    return { success: false, error: 'Invalid sender email' };
  }

  try {
    const msg = {
      to: employerEmail,
      from: {
        email: fromEmail,
        name: 'Dev Profile Analyzer'
      },
      // ANTI-SPAM: Simple, clear subject without emojis in production
      subject: `Background Verification Request for ${candidateName}`,
      
      // ANTI-SPAM: Plain text version is CRITICAL
      text: `Hello,

You have been listed as a reference by ${candidateName} for background verification.

Please join the verification chat room to provide feedback:
${chatLink}

If you have any questions, please contact us.

Best regards,
Dev Profile Analyzer Team

---
This is an automated message. Please do not reply to this email.`,

      // ANTI-SPAM: Clean, professional HTML
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Background Verification Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background-color: #4F46E5; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; text-align: center;">
                Background Verification Request
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                You have been listed as a reference by <strong>${candidateName}</strong> for background verification.
              </p>
              
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Please click the button below to join the verification chat room and provide your feedback:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${chatLink}" 
                       style="display: inline-block; 
                              padding: 14px 32px; 
                              background-color: #4F46E5; 
                              color: #ffffff; 
                              text-decoration: none; 
                              border-radius: 6px; 
                              font-weight: 600;
                              font-size: 16px;">
                      Join Verification Chat
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td style="padding: 20px; background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                      <strong>Or copy this link:</strong>
                    </p>
                    <p style="margin: 0; word-break: break-all;">
                      <a href="${chatLink}" style="color: #4F46E5; text-decoration: underline; font-size: 14px;">
                        ${chatLink}
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td style="padding: 20px; background-color: #eff6ff; border-radius: 6px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                      <strong>What to expect:</strong><br>
                      You'll be able to chat with the recruiter and candidate in a secure, private room.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.6;">
                This is an automated email from Dev Profile Analyzer.<br>
                Please do not reply to this message.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
      `,
      
      // ANTI-SPAM: Critical settings
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      },
      
      // ANTI-SPAM: Categories help with reputation
      categories: ['background-verification', 'reference-request']
    };

    console.log('📤 Sending via SendGrid...');
    const result = await sgMail.send(msg);
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('   Status:', result[0]?.statusCode);
    console.log('   Message ID:', result[0]?.headers?.['x-message-id']);
    console.log('='.repeat(50) + '\n');
    
    return { 
      success: true, 
      messageId: result[0]?.headers?.['x-message-id'],
      statusCode: result[0]?.statusCode
    };
    
  } catch (error) {
    console.error('❌ EMAIL SEND FAILED');
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response?.statusCode);
      console.error('Details:', JSON.stringify(error.response?.body, null, 2));
    }
    
    return { 
      success: false, 
      error: error.message,
      statusCode: error.response?.statusCode,
      details: error.response?.body
    };
  }
};

const sendCandidateNotification = async (candidateEmail, candidateName, chatLink) => {
  console.log('\n📧 ========== SENDING CANDIDATE EMAIL ==========');
  console.log('To:', candidateEmail);
  
  if (!isInitialized || !isValidEmail(candidateEmail)) {
    return { success: false, error: 'Invalid configuration' };
  }

  const fromEmail = process.env.EMAIL_USER;
  
  try {
    const msg = {
      to: candidateEmail,
      from: {
        email: fromEmail,
        name: 'Dev Profile Analyzer'
      },
      subject: 'Your Background Verification is Being Processed',
      
      text: `Hi ${candidateName},

Your background verification process has been successfully initiated. We've contacted your previous employer/faculty.

You can track the verification progress here:
${chatLink}

Best regards,
Dev Profile Analyzer Team

---
This is an automated message. Please do not reply to this email.`,

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Initiated</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="padding: 40px 40px 30px 40px; background-color: #059669; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; text-align: center;">
                Verification Initiated
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Hi <strong>${candidateName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Your background verification process has been successfully initiated. We've contacted your previous employer/faculty.
              </p>
              
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                You can track the verification progress here:
              </p>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${chatLink}" 
                       style="display: inline-block; 
                              padding: 14px 32px; 
                              background-color: #059669; 
                              color: #ffffff; 
                              text-decoration: none; 
                              border-radius: 6px; 
                              font-weight: 600;
                              font-size: 16px;">
                      View Verification Chat
                    </a>
                  </td>
                </tr>
              </table>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td style="padding: 20px; background-color: #ecfdf5; border-radius: 6px; border-left: 4px solid #059669;">
                    <p style="margin: 0 0 10px 0; color: #047857; font-size: 14px;">
                      <strong>What happens next?</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 14px; line-height: 1.8;">
                      <li>Your reference will receive an email</li>
                      <li>They'll join the verification chat room</li>
                      <li>The recruiter will review the feedback</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.6;">
                This is an automated email from Dev Profile Analyzer.<br>
                Please do not reply to this message.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
      `,
      
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      },
      
      categories: ['background-verification', 'candidate-notification']
    };

    const result = await sgMail.send(msg);
    
    console.log('✅ Candidate email sent!');
    console.log('   Message ID:', result[0]?.headers?.['x-message-id']);
    console.log('='.repeat(50) + '\n');
    
    return { 
      success: true, 
      messageId: result[0]?.headers?.['x-message-id'],
      statusCode: result[0]?.statusCode
    };
    
  } catch (error) {
    console.error('❌ Candidate email failed:', error.message);
    
    return { 
      success: false, 
      error: error.message,
      details: error.response?.body
    };
  }
};

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
      subject: 'SendGrid Test - Dev Profile Analyzer',
      text: 'Test email successful! If you receive this, your SendGrid configuration is correct.',
      html: '<h2>✅ SendGrid is working!</h2><p>Your configuration is correct.</p>',
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      }
    };

    console.log('📤 Sending test email to:', testEmail);
    const result = await sgMail.send(msg);
    
    console.log('✅ Test email sent!');
    console.log('   Status:', result[0]?.statusCode);
    console.log('   Message ID:', result[0]?.headers?.['x-message-id']);
    console.log('='.repeat(50) + '\n');
    
    return { 
      success: true, 
      statusCode: result[0]?.statusCode,
      messageId: result[0]?.headers?.['x-message-id']
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
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