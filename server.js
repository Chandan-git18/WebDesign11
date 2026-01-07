const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Make uploads folder public
app.use("/uploads", express.static("uploads"));

/* ---------- MULTER SETUP ---------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

/* -------- LOGIN -------- */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (result.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

/* -------- VIEW PROJECTS -------- */
app.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, result) => {
    res.json(result);
  });
});

/* -------- ADD PROJECT + FILE -------- */
app.post("/projects", upload.single("file"), (req, res) => {
  const { name, title, technology } = req.body;
  const file = req.file ? req.file.filename : null;

  db.query(
    "INSERT INTO projects (name, title, technology, file) VALUES (?, ?, ?, ?)",
    [name, title, technology, file],
    () => res.json({ message: "Project added" })
  );
});

/* -------- DELETE PROJECT -------- */
app.delete("/projects/:id", (req, res) => {
  db.query(
    "DELETE FROM projects WHERE id=?",
    [req.params.id],
    () => res.json({ message: "Deleted" })
  );
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
