const express = require("express");
require("dotenv").config();
const path = require("path");
const connectDB = require("./db/db");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const storeRoutes = require("./routes/store.routes");
const publicStoreRoutes = require("./routes/publicStore.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://jhankoo.onrender.com"

];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman ya server-to-server requests ke liye jinka origin nahi hota
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation: This origin is not allowed."), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is alive and kicking!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/shop", publicStoreRoutes);

// app.use(express.static(path.join(__dirname, "../public")));

app.use(express.static(path.join(__dirname, "../public"), { index: false }));


// Render Cloud aur Local dono par frontend/dist folder ka sahi absolute path nikalna
const FRONTEND_DIST = path.resolve(__dirname, "../../frontend/dist");

app.get("/", (req, res) => {
  const htmlPath = path.join(FRONTEND_DIST, "index.html");

  res.set("Cache-Control", "no-store");
  res.sendFile(htmlPath, (err) => {
    if (err) {
      console.error("INDEX SERVING ERROR:", err);
      if (!res.headersSent) {
        res.status(err.statusCode || 500).send("Unable to serve frontend");
      }
    }
  });
});
// console.log("FRONTEND DIST PATH:", FRONTEND_DIST);
// console.log(
//   "FRONTEND INDEX EXISTS:",
//   require("fs").existsSync(path.join(FRONTEND_DIST, "index.html"))
// );

// console.log(
//   "DEPLOYED HTML ASSETS:",
//   require("fs").readFileSync(
//     path.join(FRONTEND_DIST, "index.html"),
//     "utf8"
//   ).match(/assets\/index-[^"]+\.(?:js|css)/g)
// );

// 1. Static built files ko serve karna (CSS, JS, WebP Images)
app.use("/assets", express.static(path.join(FRONTEND_DIST, "assets")));
app.use(express.static(FRONTEND_DIST));

// 2. FALLBACK ROUTE: React Router ke URLs ko seedhe React index.html pakdana
app.use((req, res, next) => {
  // Agar tootey hue api ya assets requests hain, toh unhe html mat do, seedhe aage bhejo
  if (req.url.startsWith("/api") || req.url.startsWith("/assets")) {
    return next();
  }
  // Baki sabhi routing path ke liye direct React application load hogi
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

// Generic 404 for broken endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Requested Route or Asset not found" });
});

module.exports = app;
