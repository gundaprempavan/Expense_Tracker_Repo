const twilio = require('twilio');

const twilioClient = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'); // Use your Twilio credentials

const sendOTP = async (mobileNumber, otp) => {
  try {
    const message = await twilioClient.messages.create({
      body: `Your OTP for password recovery is: ${otp}`,
      from: 'YOUR_TWILIO_PHONE_NUMBER', // Your Twilio number
      to: mobileNumber,
    });
    return message.sid;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Could not send OTP');
  }
};

module.exports = { sendOTP };
