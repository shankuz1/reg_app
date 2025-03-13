// index.js

const express = require('express');
const prisma = require('@prisma/client').PrismaClient;
const app = express();
const cors = require('cors');
const prismaClient = new prisma();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  
  // Listen for the response 'finish' event to log the status code when response is sent
  res.on('finish', () => {
    console.log(`Response Sent: ${req.method} ${req.url} - Status: ${res.statusCode}`);
  });
  
  next();
});

// Optionally handle preflight requests for all routes
// app.options('*', cors());

// health endpoint to see if the backend is up
app.get('/health', async(req,res) => {
  res.status(200).send("everthing looks up")
})

// POST route to register a student
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, dob } = req.body;

  try {
    const student = await prismaClient.student.create({
      data: {
        firstName,
        lastName,
        email,
        dob: new Date(dob),
      },
    });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: "Error creating student" });
  }
});

// DEL route to delete a certain user from db
// In api call provide firstname and emailID to delete users from DB

app.delete('/deleteUser', async (req, res) => {
  const { email, firstName } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({ error: "Email and firstName are required" });
  }

  try {
    const result = await prismaClient.student.deleteMany({
      where: {
        email: email,
        firstName: firstName,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "No user found with the provided email and firstName" });
    }

    res.json({ message: `${result.count} user(s) deleted successfully` });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "An error occurred while deleting the user" });
  }
});

// GET route to retrieve all students
app.get('/students', async (req, res) => {
  try {
    const students = await prismaClient.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});



// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
