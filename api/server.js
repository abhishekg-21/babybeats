const express = require("express")
const path = require("path")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// PGHOST='ep-icy-unit-aduz8lvr-pooler.c-2.us-east-1.aws.neon.tech'
// PGDATABASE='calendar'
// PGUSER='neondb_owner'
// PGPASSWORD='npg_4USZlaqDBm0K'
// PGSSLMODE='require'
// PGCHANNELBINDING='require'
const pool = new Pool({
  user: process.env.DB_USER || "neondb_owner",
  host: process.env.DB_HOST || "ep-icy-unit-aduz8lvr-pooler.c-2.us-east-1.aws.neon.tech",
  database: process.env.DB_NAME || "calendar",
  password: process.env.DB_PASSWORD || "npg_4USZlaqDBm0K",
  port: process.env.DB_PORT || 5432,
  
   ssl: {
    rejectUnauthorized: false,  // required for Neon
  },
  
})

class AppointmentDB {
  async saveAppointment(appointmentData) {
    const { date, title, time } = appointmentData
    const result = await pool.query("INSERT INTO appointments (date, title, time) VALUES ($1, $2, $3) RETURNING *", [
      date,
      title || "Appointment",
      time || "12:00 PM",
    ])
    return result.rows[0]
  }
}

const db = new AppointmentDB()

app.post("/api/appointments", async (req, res) => {
  try {
    const { date, title, time } = req.body

    if (!date) {
      return res.status(400).json({ error: "Date is required" })
    }

    const newAppointment = await db.saveAppointment({ date, title, time })
    res.status(201).json({ message: "Appointment saved successfully", id: newAppointment.id })
  } catch (error) {
    console.error("Database error:", error)
    res.status(500).json({ error: "Failed to save appointment" })
  }
})

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1")
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

module.exports = Pool;


