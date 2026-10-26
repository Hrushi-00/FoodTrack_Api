import { controllerHandler } from "../../shared/utils/controllerHandler.js";
import * as employeeService from "./employee.service.js";

export const addEmployee = controllerHandler(
  (req) => employeeService.addEmployee(req.user._id, req.body),
  "Error adding employee",
);
export const getEmployees = controllerHandler(
  (req) => employeeService.getEmployees(req.user._id),
  "Error fetching employees",
);
export const addLeave = controllerHandler(
  (req) => employeeService.addLeave(req.user._id, req.params.employeeId, req.body),
  "Error adding leave",
);
export const getEmployeeLeaves = controllerHandler(
  (req) => employeeService.getEmployeeLeaves(req.user._id, req.params.employeeId),
  "Error fetching employee leaves",
);
export const addPayment = controllerHandler(
  (req) => employeeService.addPayment(req.user._id, req.params.employeeId, req.body),
  "Error adding payment",
);
export const getEmployeePaymentDetails = controllerHandler(
  (req) => employeeService.getEmployeePaymentDetails(req.user._id, req.params.employeeId),
  "Error fetching employee payment details",
);
export const deleteEmployee = controllerHandler(
  (req) => employeeService.deleteEmployee(req.user._id, req.params.employeeId),
  "Error deleting employee",
);
export const updateEmployee = controllerHandler(
  (req) => employeeService.updateEmployee(req.user._id, req.params.employeeId, req.body),
  "Error updating employee",
);
