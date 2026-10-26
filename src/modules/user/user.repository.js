import User from "./user.model.js";

export const findByEmail = (email, { includePassword = false } = {}) => {
  const query = User.findOne({ email });
  return includePassword ? query.select("+password") : query;
};

export const findById = (userId, { includePassword = false } = {}) => {
  const query = User.findById(userId);
  return includePassword ? query.select("+password") : query;
};

export const findPasswordResetUser = (token) => User.findOne({
  resetPasswordToken: token,
  resetPasswordExpire: { $gt: Date.now() },
});

export const createUser = (userData) => User.create(userData);

export const saveUser = (user) => user.save();
