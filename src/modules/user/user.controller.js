import * as userService from "./user.service.js";

const handle = (action, successStatus = 200) => async (req, res) => {
  try {
    const result = await action(req);
    return res.status(successStatus).json(result);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json(error.response);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).reduce((result, item) => {
        result[item.path] = item.message;
        return result;
      }, {});
      return res.status(400).json({ success: false, message: "Validation error", errors });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      ...(process.env.NODE_ENV === "development" ? { error: error.message } : {}),
    });
  }
};

export const login = handle((req) => userService.login(req.body));
export const signup = handle((req) => userService.signup(req.body), 201);
export const changePassword = handle((req) => userService.changePassword(req.user._id, req.body));
export const forgotPassword = handle((req) => userService.forgotPassword(req.body.email));
export const resetPassword = handle((req) => userService.resetPassword(req.body));
export const getProfile = handle((req) => userService.getProfile(req.user._id));
export const editProfile = handle((req) => userService.editProfile(req.user._id, req.body));
