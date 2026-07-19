const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const generalRoutes = require("./routes/general");
const userRoutes = require("./routes/users");
const authenticatedRoutes = require("./routes/authenticated");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: "bookshop-secret",
        resave: false,
        saveUninitialized: true,
    })
);

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Book Review API",
    });
});

// Routes
app.use("/", generalRoutes);
app.use("/", userRoutes);
app.use("/auth", authenticatedRoutes);

// 404 handler (must be last)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

module.exports = app;