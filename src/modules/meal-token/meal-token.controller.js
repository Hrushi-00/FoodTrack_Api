import { controllerHandler } from "../../shared/utils/controllerHandler.js";
import * as mealTokenService from "./meal-token.service.js";

export const generateToken = async (req, res) => {
  try {
    const { tokenNumber, pdf } = await mealTokenService.generateToken(req.user, req.body);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=token-${tokenNumber}.pdf`);
    return res.send(pdf);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Error generating token",
      ...(error.statusCode ? {} : { error: error.message }),
    });
  }
};

export const getTokensByDate = controllerHandler(
  (req) => mealTokenService.getTokensByDate(req.user._id, req.params),
  "Error fetching tokens",
);
export const getMyTokens = controllerHandler(
  (req) => mealTokenService.getMyTokens(req.user._id),
  "Error fetching user tokens",
);
