const nodemailer = require('nodemailer');

console.log('Testing nodemailer...');
console.log('nodemailer:', nodemailer);
console.log('createTransporter:', typeof nodemailer.createTransporter);

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'test@gmail.com',
    pass: 'testpass'
  }
});

console.log('✅ Transporter created successfully!');