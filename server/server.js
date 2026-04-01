require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const app = express();


connectDB();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/leads", require("./routes/leadRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));
app.use(errorHandler);

app.use(cors({
  origin: "*"
}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));