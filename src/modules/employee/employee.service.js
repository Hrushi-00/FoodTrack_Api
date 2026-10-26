import Employee from "./employee.model.js";
import AppError from "../../shared/utils/appError.js";

const findEmployee = async (adminId, employeeId) => {
  const employee = await Employee.findOne({ _id: employeeId, adminId });
  if (!employee) throw new AppError(404, "Employee not found");
  return employee;
};

export const addEmployee = async (adminId, data) => {
  const employee = await Employee.create({
    adminId,
    name: data.name,
    position: data.position,
    contact: data.contact,
    salary: data.salary,
  });
  return { statusCode: 201, body: { message: "Employee added successfully", employee } };
};

export const getEmployees = (adminId) => Employee.find({ adminId });

export const addLeave = async (adminId, employeeId, data) => {
  const employee = await findEmployee(adminId, employeeId);
  employee.leaves.push({ startDate: data.startDate, endDate: data.endDate, reason: data.reason });
  await employee.save();
  return { statusCode: 201, body: { message: "Leave added successfully", employee } };
};

export const getEmployeeLeaves = async (adminId, employeeId) => {
  const employee = await findEmployee(adminId, employeeId);
  return { leaves: employee.leaves };
};

export const addPayment = async (adminId, employeeId, data) => {
  const employee = await findEmployee(adminId, employeeId);
  employee.payments.push({ amount: data.amount, method: data.method });
  await employee.save();
  return { statusCode: 201, body: { message: "Payment recorded successfully", employee } };
};

export const getEmployeePaymentDetails = async (adminId, employeeId) => {
  const employee = await findEmployee(adminId, employeeId);
  const totalPaid = employee.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return {
    employee: {
      name: employee.name,
      position: employee.position,
      contact: employee.contact,
      salary: employee.salary,
    },
    totalPaid,
    remaining: Math.max(0, employee.salary - totalPaid),
    paymentHistory: employee.payments,
  };
};

export const deleteEmployee = async (adminId, employeeId) => {
  const employee = await Employee.findOneAndDelete({ _id: employeeId, adminId });
  if (!employee) throw new AppError(404, "Employee not found");
  return { message: "Employee deleted successfully", employee };
};

export const updateEmployee = async (adminId, employeeId, data) => {
  const employee = await findEmployee(adminId, employeeId);
  for (const field of ["name", "position", "contact", "salary"]) {
    if (data[field] !== undefined) employee[field] = data[field];
  }
  await employee.save();
  return { message: "Employee updated successfully", employee };
};
