import Menu from "./menu.model.js";
import AppError from "../../shared/utils/appError.js";

export const addMenu = async (userId, items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError(400, "Please provide menu items");
  }

  const seenCodes = new Set();
  for (const item of items) {
    if (!item?.menuItemId || !item.name) {
      throw new AppError(400, "Each menu item must have 'menuItemId' and 'name' fields");
    }
    const code = item.menuItemId.toString().trim().toLowerCase();
    if (seenCodes.has(code)) {
      throw new AppError(400, `Duplicate menuItemId detected in request: ${item.menuItemId}`);
    }
    seenCodes.add(code);
  }

  const menu = await Menu.findOne({ userId });
  if (!menu) {
    const created = await Menu.create({ userId, items });
    return { statusCode: 201, body: { message: "Menu added successfully", menu: created } };
  }

  const existingCodes = new Set(menu.items.map((item) => item.menuItemId.toLowerCase()));
  const newItems = items.filter((item) => !existingCodes.has(item.menuItemId.toLowerCase()));
  if (!newItems.length) {
    return {
      message: "No new items added — all provided menuItemIds already exist",
      addedCount: 0,
      menu,
    };
  }

  menu.items.push(...newItems);
  await menu.save();
  return {
    message: `Menu updated successfully — added ${newItems.length} new item(s)`,
    addedCount: newItems.length,
    menu,
  };
};

export const getMenuByUserId = async (userId, notFoundMessage) => {
  const menu = await Menu.findOne({ userId });
  if (!menu) throw new AppError(404, notFoundMessage);
  return menu;
};

export const updateMenu = async (userId, items) => {
  const menu = await Menu.findOneAndUpdate({ userId }, { items }, { new: true });
  if (!menu) throw new AppError(404, "Menu not found for this user");
  return { message: "Menu updated successfully", updatedMenu: menu };
};

export const getAllMenus = () => Menu.find().populate("userId", "fullName email");
