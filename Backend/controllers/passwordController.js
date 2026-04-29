const crypto = require('crypto');
const { Resend } = require('resend');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Helper: build reset email HTML ────────────────────────────────────────────
const buildResetEmail = (resetUrl) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#14b8a6,#10b981);padding:36px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-1px;">NEST.</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Student Room Accommodation Platform</p>
    </div>
    <div style="padding:36px;">
      <h2 style="margin:0 0 12px;color:#1e293b;font-size:22px;font-weight:800;">Reset Your Password</h2>
      <p style="color:#64748b;line-height:1.6;margin:0 0 28px;">
        We received a request to reset your password. Click the button below to create a new one.
        This link expires in <strong>15 minutes</strong>.
      </p>
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${resetUrl}"
          style="display:inline-block;background:linear-gradient(135deg,#14b8a6,#10b981);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:14px;font-weight:800;font-size:16px;letter-spacing:0.3px;">
          Reset Password
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">
        If you didn't request this, you can safely ignore this email. Your password will not change.
      </p>
      <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0;">
      <p style="color:#cbd5e1;font-size:12px;text-align:center;margin:0;">
        Or paste this URL in your browser:<br>
        <span style="color:#14b8a6;word-break:break-all;">${resetUrl}</span>
      </p>
    </div>
  </div>
</body>
</html>
`;

// ── @route   POST /api/auth/forgot-password ────────────────────────────────────
// ── @access  Public
const forgotPassword = async (req, res, next) => {
  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always respond with success to prevent email enumeration attacks
    const genericResponse = {
      message: 'If an account with that email exists, a reset link has been sent.',
    };

    if (!user) return res.status(200).json(genericResponse);

    // Generate token + save to user
    const rawToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const resetUrl = `${process.env.APP_URL}/reset-password/${rawToken}`;

    // Send email via Resend
    await resend.emails.send({
      from:    'NEST <onboarding@resend.dev>',  // use your verified domain in production
      to:      user.email,
      subject: 'Reset your NEST password',
      html:    buildResetEmail(resetUrl),
    });

    res.status(200).json(genericResponse);
  } catch (error) {
    next(error);
  }
};

// ── @route   POST /api/auth/reset-password/:token ─────────────────────────────
// ── @access  Public
const resetPassword = async (req, res, next) => {
  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    // Hash the URL token to compare with the stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with valid (non-expired) token
    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      res.status(400);
      throw new Error('Reset link is invalid or has expired. Please request a new one.');
    }

    // Set new password (pre-save hook will hash it)
    user.password             = req.body.password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { forgotPassword, resetPassword };
