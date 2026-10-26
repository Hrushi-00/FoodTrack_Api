import express from "express";
import { protect } from "../../shared/middleware/authMiddleware.js";
import {
  addEmployee,
  getEmployees,
  addLeave,
  addPayment,
  getEmployeePaymentDetails,
  deleteEmployee,
  updateEmployee,
  getEmployeeLeaves
} from "./employee.controller.js";

const router = express.Router();

router.post("/add", protect, addEmployee);
router.get("/", protect, getEmployees);
router.post("/:employeeId/leave", protect, addLeave);
router.get("/:employeeId/report/leaves", protect, getEmployeeLeaves);
router.post("/:employeeId/payment", protect, addPayment);
router.get("/:employeeId/report/payments", protect, getEmployeePaymentDetails);
router.delete("/:employeeId", protect, deleteEmployee);
router.put("/:employeeId", protect, updateEmployee);

export default router;
