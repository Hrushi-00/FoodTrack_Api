import { controllerHandler } from "../../shared/utils/controllerHandler.js";
import * as menuService from "./menu.service.js";

export const addMenu = controllerHandler(
  (req) => menuService.addMenu(req.user._id, req.body.items),
  "Error saving menu",
);
export const getMyMenu = controllerHandler(
  (req) => menuService.getMenuByUserId(req.user._id, "No menu found for this user"),
  "Error fetching menu",
);
export const getMenuByUserId = controllerHandler(
  (req) => menuService.getMenuByUserId(req.params.userId, "No menu found for this hotel"),
  "Error fetching menu",
);
export const updateMenu = controllerHandler(
  (req) => menuService.updateMenu(req.user._id, req.body.items),
  "Error updating menu",
);
export const getAllMenus = controllerHandler(() => menuService.getAllMenus(), "Error fetching menus");
