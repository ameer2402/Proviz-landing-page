const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const USER = require("./models/applications");
const existingUser = require("./middleware/existed");
const session = require("express-session"); // Add session middleware

app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "Pappu786", // Secret key to sign the session cookie
    resave: false, // Don't force session to be saved back to the session store
    saveUninitialized: true, // Save uninitialized sessions
}));

mongoose.connect("mongodb://localhost:27017/Applications");

app.get("/", (req, res) => {
    const alertMessage = req.session.alert;
    req.session.alert = null; // Clear the alert after it's used
    res.render("index", { alert: alertMessage });
});

app.get("/application", (req, res) => {
    const alertMessage = req.session.alert;
    req.session.alert = null; // Clear the alert after it's used
    res.render("application", { alert: alertMessage });
});

app.use('/favicon.ico', (req, res) => res.status(204));


app.post("/application", existingUser, async (req, res) => {
    const { name, phone, email, message } = req.body;

    try {
        // Create a new user/application entry
        await USER.create({
            name,
            phone,
            email,
            message,
        });

        // Set success message in session and redirect to homepage
        req.session.alert = "Application submitted successfully!";
        res.redirect("/application");
    } catch (error) {
        // Handle any errors that occur during the database operation
        console.error(error);
        res.status(500).send("An error occurred while submitting your application.");
    }
});

app.listen(5000, () => console.log("server started"));
