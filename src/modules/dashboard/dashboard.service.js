import Token from "../meal-token/meal-token.model.js";
import Menu from "../menu/menu.model.js";
import User from "../user/user.model.js";
import AppError from "../../shared/utils/appError.js";

const getToday = () => new Date().toISOString().split("T")[0];
const getRevenue = (tokens) => tokens.reduce(
  (total, token) => total + (token.totalAmount || token.items.reduce((sum, item) => sum + item.price * item.qty, 0)),
  0,
);

export const getDashboardStats = async (userId) => {
  const today = getToday();
  const todayTokens = await Token.find({ adminId: userId, date: today });
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  const [activeTokens, menu, totalEmployees] = await Promise.all([
    Token.countDocuments({ adminId: userId, status: { $ne: "completed" } }),
    Menu.findOne({ userId }),
    User.countDocuments({ hotelName: user.hotelName, _id: { $ne: userId } }),
  ]);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const monthlyTokens = await Token.find({
    adminId: userId,
    date: { $gte: startOfMonth.toISOString().split("T")[0] },
  });

  return {
    success: true,
    data: {
      activeTokens,
      todayRevenue: getRevenue(todayTokens),
      totalMenuItems: menu?.items.length ?? 0,
      customersServedToday: new Set(todayTokens.map((token) => token.tableNumber)).size,
      totalEmployees,
      todayOrders: todayTokens.length,
      monthlyRevenue: getRevenue(monthlyTokens),
    },
  };
};

export const getPopularItems = async (userId) => {
  const tokens = await Token.find({ adminId: userId, date: getToday() });
  const itemStats = new Map();
  for (const token of tokens) {
    for (const item of token.items) {
      const name = item.name || item.menuItemId;
      const stats = itemStats.get(name) || { name, orders: 0, totalQty: 0, revenue: 0 };
      stats.orders += 1;
      stats.totalQty += item.qty;
      stats.revenue += (item.price || 0) * item.qty;
      itemStats.set(name, stats);
    }
  }

  const data = [...itemStats.values()]
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 4)
    .map(({ name, orders, revenue }) => ({ name, orders, revenue: `₹${revenue.toLocaleString()}` }));
  return { success: true, data };
};

const getTimeAgo = (date) => {
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

export const getRecentActivity = async (userId) => {
  const tokens = await Token.find({ adminId: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("tableNumber items createdAt status");
  const data = tokens.map((token) => {
    const state = {
      completed: ["Order completed", "complete"],
      cancelled: ["Order cancelled", "cancelled"],
    }[token.status] || ["New order received", "order"];
    return {
      action: state[0],
      table: `Table ${token.tableNumber}`,
      time: getTimeAgo(token.createdAt),
      type: state[1],
    };
  });
  return { success: true, data };
};
