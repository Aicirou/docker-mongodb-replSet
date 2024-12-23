import express from "express"
import { DatabaseConnection } from "./config/db_config.js"
import { healthCheck } from "./utils/health.js"
import { dbinfo } from "./utils/db_info.js"
// import apiRoutes from "./routes/index.js"

const app = express()
const port = 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB connection
const db = new DatabaseConnection()

// Route handlers (order matters)

// Health check
app.get("/health", async (req, res) => {
  await healthCheck(req, res)
})

// Root route - Display database information
app.get("/", async (req, res) => {
  await dbinfo(req, res)
})

// API routes
// app.use("/api", apiRoutes)

// 404 handler
// app.use((req, res) => {
//   res.status(404).json({ error: "Not Found" })
// })

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal Server Error" })
})

// Start server
const startServer = async () => {
  try {
    await db.connect()
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
