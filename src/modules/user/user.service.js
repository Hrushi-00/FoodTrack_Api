import jwt from "jsonwebtoken";
import * as userRepository from "./user.repository.js";
import { sendResetPasswordEmail } from "../../shared/utils/email.js";
import { validateChangePassword, validateLogin, validateSignup } from "./user.validator.js";

const fail = (statusCode, message, errors) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.response = { success: false, message, ...(errors ? { errors } : {}) };
  return error;
};

const publicUser = (user) => {
  const data = user.toObject();
  delete data.password;
  delete data.resetPasswordToken;
  delete data.resetPasswordExpire;
  return data;
};

export const login = async ({ email, password }) => {
  const errors = validateLogin({ email, password });
  if (errors) throw fail(400, "Please provide email and password", errors);

  const user = await userRepository.findByEmail(email, { includePassword: true });
  if (!user) throw fail(400, "Email not found", { email: "Email not found" });
  if (!(await user.matchPassword(password))) {
    throw fail(400, "Incorrect password", { password: "Incorrect password" });
  }

  return {
    success: true,
    message: "Login successful",
    token: user.getSignedJwtToken(),
    user: { id: user._id, email: user.email, role: user.role },
  };
};

export const signup = async (data) => {
  const errors = validateSignup(data);
  if (errors) throw fail(400, "Please provide valid signup details", errors);
  if (await userRepository.findByEmail(data.email)) {
    throw fail(400, "Email already registered", { email: "Email already registered" });
  }

  const user = await userRepository.createUser({
    email: data.email,
    password: data.password,
    fullName: data.fullName,
    phone: data.phone,
    hotelName: data.hotelName,
    address: data.address,
  });

  return { success: true, token: user.getSignedJwtToken(), data: publicUser(user) };
};

export const changePassword = async (userId, data) => {
  const errors = validateChangePassword(data);
  if (errors) throw fail(400, "Please provide valid password fields", errors);

  const user = await userRepository.findById(userId, { includePassword: true });
  if (!user) throw fail(404, "User not found");
  if (!(await user.matchPassword(data.currentPassword))) throw fail(401, "Current password is incorrect");

  user.password = data.newPassword;
  await userRepository.saveUser(user);
  return {
    success: true,
    message: "Password changed successfully",
    token: user.getSignedJwtToken(),
    user: publicUser(user),
  };
};

export const forgotPassword = async (email) => {
  if (!email) throw fail(400, "Please provide email", { email: "Email is required" });
  const user = await userRepository.findByEmail(email);
  if (!user) throw fail(404, "No account found with this email");

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 3600000;
  await userRepository.saveUser(user);

  try {
    await sendResetPasswordEmail(email, resetToken);
  } catch (error) {
    throw fail(500, "Failed to send reset email", {
      email: process.env.NODE_ENV === "development" ? error.message : "Email service error",
    });
  }
  return { success: true, message: "Reset password email sent" };
};

export const resetPassword = async ({ token, password }) => {
  if (!token || !password) throw fail(400, "Token and password are required");
  const user = await userRepository.findPasswordResetUser(token);
  if (!user) throw fail(400, "Invalid or expired token");

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await userRepository.saveUser(user);
  return { success: true, message: "Password reset successful! You can now log in." };
};

export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw fail(404, "User not found");
  return {
    fullName: user.fullName,
    email: user.email,
    hotelName: user.hotelName,
    phone: user.phone,
    address: user.address,
    role: user.role,
  };
};

export const editProfile = async (userId, data) => {
  const user = await userRepository.findById(userId);
  if (!user) throw fail(404, "User not found");

  for (const field of ["fullName", "hotelName", "phone", "address"]) {
    if (data[field] !== undefined) user[field] = data[field];
  }
  await userRepository.saveUser(user);
  return {
    success: true,
    message: "Profile updated successfully",
    user: {
      fullName: user.fullName,
      email: user.email,
      hotelName: user.hotelName || "No Hotel Name",
      phone: user.phone,
      address: user.address,
    },
  };
};

