import speakeasy from 'speakeasy';
import User from '../models/User.js';

export const generateTFA = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const secret = speakeasy.generateSecret({
    name: `Fix & Flip Portal (${user.name})`,
    issuer: 'Fix & Flip Loan Broker'
  });

  user.tfaSecret = secret.base32;
  user.tfaEnabled = false;
  await user.save();

  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url,
    url: secret.otpauth_url
  };
};

export const verifyTFA = async (email, token) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  if (!user.tfaSecret) throw new Error('TFA not set up');

  const verified = speakeasy.totp.verify({
    secret: user.tfaSecret,
    encoding: 'base32',
    token: token,
    window: 1
  });

  return { verified };
};

export const enableTFA = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  user.tfaEnabled = true;
  await user.save();
  
  return { enabled: true };
};
