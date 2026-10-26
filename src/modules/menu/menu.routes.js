import express from "express";
import { protect } from "../../shared/middleware/authMiddleware.js";
import { addMenu, getMyMenu, getMenuByUserId ,updateMenu,getAllMenus, } from "./menu.controller.js";

const router = express.Router();

// JWT-protected routes for hotel owners
router.post("/createmenu", protect, addMenu);
router.get("/getmenu", protect, getMyMenu);
router.put("/updatemenu", protect, updateMenu);
router.get("/all", protect, getAllMenus);

// Public route to view a hotel’s menu
router.get("/hotel/:userId", getMenuByUserId);

export default router;
