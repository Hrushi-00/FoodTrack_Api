import { controllerHandler } from "../../shared/utils/controllerHandler.js";
import * as dashboardService from "./dashboard.service.js";

export const getDashboardStats = controllerHandler(
  (req) => dashboardService.getDashboardStats(req.user._id),
  "Error fetching dashboard stats",
);
export const getPopularItems = controllerHandler(
  (req) => dashboardService.getPopularItems(req.user._id),
  "Error fetching popular items",
);
export const getRecentActivity = controllerHandler(
  (req) => dashboardService.getRecentActivity(req.user._id),
  "Error fetching recent activity",
);
