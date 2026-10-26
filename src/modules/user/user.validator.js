const emailPattern = /^\S+@\S+\.\S+$/;

export const validateLogin = ({ email, password }) => {
  if (email && password) return null;
  return {
    email: email ? null : "Email is required",
    password: password ? null : "Password is required",
  };
};

export const validateSignup = (data) => {
  const requiredErrors = {
    email: data.email ? null : "Email is required",
    password: data.password ? null : "Password is required",
    fullName: data.fullName ? null : "Full name is required",
    phone: data.phone ? null : "Phone number is required",
    hotelName: data.hotelName ? null : "Hotel name is required",
    address: data.address ? null : "Address is required",
  };

  if (Object.values(requiredErrors).some(Boolean)) return requiredErrors;
  if (!emailPattern.test(data.email)) {
    return { email: "Please provide a valid email address" };
  }
  return null;
};

export const validateChangePassword = ({ currentPassword, newPassword, confirmPassword }) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      currentPassword: currentPassword ? null : "Current password is required",
      newPassword: newPassword ? null : "New password is required",
      confirmPassword: confirmPassword ? null : "Confirm password is required",
    };
  }
  if (newPassword !== confirmPassword) return { confirmPassword: "Passwords do not match" };
  return null;
};
