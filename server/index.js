const express = require("express");
const path = require("path");

const app = express();

const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoutes = require("./routes/Contact");

const databse = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");

const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;

// Database connect
databse.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// Cloudinary connection
cloudinaryConnect();

// API routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/contactUs", contactUsRoutes);

// Serve static files from the React app
const clientPath = path.join(__dirname, "client", "build");
app.use(express.static(clientPath));

// Catch-all route to serve React's index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

// Root route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running...",
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});

