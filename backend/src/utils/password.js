/**
 * Password Hashing Helper
 * Using bcryptjs for secure password storage
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash password untuk disimpan di database
 */
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

/**
 * Compare password input dengan hashed password di database
 */
export const comparePassword = async (passwordInput, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(passwordInput, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error);
    throw error;
  }
};
