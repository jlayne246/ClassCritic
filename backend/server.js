const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//purpose of mongoose is to create a schema
const mongoose = require("mongoose");

//get all the created routes from this file
const reviewDetails = require("./routes/reviewDetails");
const registerRoutes = require("./routes/registerRoutes");
const loginRoutes = require("./routes/loginRoutes");
const statsRoutes = require("./routes/stats");
const emailRoutes = require("./routes/emailRoutes");

//passes data attached in body to the req object
app.use(express.json());
//middleware being used to log the path and type of request
app.use((req, res, next) => {
  console.log(req.path, req.method, req.originalUrl);
  next();
});

app.use(cookieParser());

// Enable CORS with credentials for communication with React frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend URL
    credentials: true, // Allow cookies to be sent along with requests
  })
);

//middleware used to manage sessions
app.use(
  session({
    secret: "98c07843ba7fed542f74c22d41351407da168b495ac4a8fa681119e07beba748", // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
    },
  })
);

//localhost:4000/api/review/
app.use("/api/review", reviewDetails);

app.use("/api/stats", statsRoutes);

//localhost:4000/api/register/
app.use("/api/register", registerRoutes);

// app.post('/api/login', (req, res) => {
//   console.log(req.body.email, req.body.password, req.body.remember);
//   // res.send('GET request to the homepage')
// })

app.use("/api/login", loginRoutes);

// Logout route
app.post("/api/logout", (req, res) => {
  req.session.destroy(); // Destroy the session
  res.clearCookie("token"); // Clear the JWT token cookie
  res.json({ success: true, message: "Logged out" });
});

// app.get('/protected', (req, res) => { //For testing
//   const token = req.session.token;

//   if (token) {
//       try {
//           const decoded = jwt.verify(token, '151a60307f621da4e322f2e3ff9493c50f62a0b8ad919eeac7b009f60bcd37ca');
//           res.json({ message: `Hello ${decoded.role}, your ID is ${decoded.userId}` });
//       } catch (err) {
//           res.status(401).json({ message: 'Invalid or expired token' });
//       }
//   } else {
//       res.status(401).json({ message: 'No token found, please log in' });
//   }
// });

app.use('/api/user-email', emailRoutes);

//connecting to the LOCAL mongodb
//https://youtu.be/s0anSjEeua8?si=0a8KFFrCu0mIbT1G&t=435
//Watch link when connecting to ATLAS instead of local db
mongoose
  .connect("mongodb://127.0.0.1:27017/classcritic") // localhost = 127.0.0.1
  .then(() => {
    //only listen for requests once conneted to the db
    app.listen(4000, () => {
      console.log("connected to local mongoDB & listening on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
