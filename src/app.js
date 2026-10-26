import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./modules/user/user.routes.js";
import menuRoutes from "./modules/menu/menu.routes.js";
import mealTokenRoutes from "./modules/meal-token/meal-token.routes.js";
import employeeRoutes from "./modules/employee/employee.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tokens", mealTokenRoutes);
app.use("/tokens", express.static(path.join(process.cwd(), "tokens")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
