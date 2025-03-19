
//Import the tracing initialization so that OpenTelemetry is configured before any other code runs.
require('./tracing');
require('./metrics');

//test

const { trace } = require('@opentelemetry/api');
// const tracer = trace.getTracer('test');
// const testSpan = tracer.startSpan('test-span');
// testSpan.addEvent('This is a test event');
// testSpan.end();

//test-end

// Import required modules.
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

//Import the OpenTelemetry API to perform manual instrumentation.
// const { trace } = require('@opentelemetry/api');


const app = express();
const prismaClient = new PrismaClient();

//Obtain a tracer instance for manual instrumentation, naming this tracer "backend-service".
const tracer = trace.getTracer('backend-service');

//Logging middleware to log incoming requests and outgoing responses.
// app.use((req, res, next) => {
//   console.log(`Incoming Request: ${req.method} ${req.url}`);
//   res.on('finish', () => {
//     console.log(`Response Sent: ${req.method} ${req.url} - Status: ${res.statusCode}`);
//   });
//   next();
// });

//Middleware to parse JSON and enable CORS.

app.use(express.json());
app.use(cors());


//POST /register endpoint - Registers a new student.
app.post('/register', async (req, res) => {
  const span = tracer.startSpan('POST /register');
  try {
    span.addEvent('Received request to register a student');
    const { firstName, lastName, email, dob } = req.body;

    const student = await prismaClient.student.create({
      data: {
        firstName,
        lastName,
        email,
        dob: new Date(dob),
      },
    });

    span.addEvent('Student registered successfully');
    res.json(student);
  } catch (error) {

    span.recordException(error);
    res.status(400).json({ error: "Error creating student" });
  } finally {
    span.end();
  }
});


//GET /students endpoint - Retrieves all student records.
app.get('/students', async (req, res) => {
  const span = tracer.startSpan('GET /students');
  try {
    span.addEvent('Fetching all students');
    const students = await prismaClient.student.findMany();
    span.addEvent('Fetched students successfully');
    res.json(students);
  } catch (error) {
    span.recordException(error);
    res.status(500).json({ error: "Error fetching students" });
  } finally {
    span.end();
  }
});


//DELETE /deleteUser endpoint - Deletes a student by email and firstName.
app.delete('/deleteUser', async (req, res) => {
  // [19] Start a new span for the DELETE /deleteUser endpoint.
  const span = tracer.startSpan('DELETE /deleteUser');
  try {
    span.addEvent('Received request to delete user');
    const { email, firstName } = req.body;
    if (!email || !firstName) {
      span.addEvent('Missing email or firstName in request');
      return res.status(400).json({ error: "Email and firstName are required" });
    }

    const result = await prismaClient.student.deleteMany({
      where: { email, firstName },
    });

    if (result.count === 0) {
      span.addEvent('No user found matching the criteria');
      return res.status(404).json({ error: "No user found with the provided email and firstName" });
    }

    span.addEvent('User(s) deleted successfully');
    res.json({ message: `${result.count} user(s) deleted successfully` });
  } catch (error) {
    span.recordException(error);
    res.status(500).json({ error: "An error occurred while deleting the user" });
  } finally {
    span.end();
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
