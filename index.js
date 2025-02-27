const express = require("express");
const multer = require("multer");
const cors = require('cors');
const app = express();
const port =process.env.PORT|| 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Multer setup for photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// In-memory array to store students
let students = [];
let idCounter = 0;

// Create student
app.post("/students", upload.single("photo"), (req, res) => {
  const { name, email, gender, dob, grade, marks, address } = req.body;
  const photo = req.file ? req.file.buffer.toString("base64") : null;
  const student = {
    id: idCounter++,
    name,
    email,
    gender,
    dob,
    grade,
    marks,
    address,
    photo,
  };
  students.push(student);
  res.status(201).json({ message: "Student added", student });
});

// Get all students
app.get("/students", (req, res) => {
  res.json(students);
});

// Get student by ID
app.get("/students/:id", (req, res) => {
  const student = students.find((s) => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

// Update student
app.put("/students/:id", upload.single("photo"), (req, res) => {
  const index = students.findIndex((s) => s.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Student not found" });
  
  const { name, email, gender, dob, grade, marks, address } = req.body;
  const photo = req.file ? req.file.buffer.toString("base64") : students[index].photo;
  
  students[index] = { ...students[index], name, email, gender, dob, grade, marks, address, photo };
  res.json({ message: "Student updated", student: students[index] });
});

// Delete student
app.delete("/students/:id", (req, res) => {
  students = students.filter((s) => s.id !== parseInt(req.params.id));
  res.json({ message: "Student deleted" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
