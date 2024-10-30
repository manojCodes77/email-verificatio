import User from '../models/User.js';
import transporter from '../config/emailConfig.js';
import crypto from 'crypto';

// Generate OTP and send it to user's email
async function sendOTP(req, res) {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email });
        }

        // Set OTP and expiration time (5 minutes)
        user.otp = otp;
        user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
        await user.save();

        // Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 5 minutes.`
        });

        res.status(200).send('OTP sent to email.');
    } catch (error) {
        res.status(500).send(error);
    }
}

// Verify OTP
async function verifyOTP(req, res) {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found.');

        const isOtpValid = user.otp === otp && Date.now() < user.otpExpiresAt;
        if (!isOtpValid) return res.status(400).send('Invalid or expired OTP.');

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).send('Email verified successfully.');
    } catch (error) {
        res.status(500).send('Error verifying OTP.');
    }
}

export { sendOTP, verifyOTP };