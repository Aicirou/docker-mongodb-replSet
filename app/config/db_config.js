import mongoose from "mongoose"

class DatabaseConnection {
  constructor() {
    this.uri =
      "mongodb://mongo1:27017,mongo2:27018,mongo3:27019/demo?replicaSet=rs0"
    this.options = {
      readPreference: "secondaryPreferred",
      serverSelectionTimeoutMS: 5000,
    }
  }

  setupListeners() {
    // Log connection status
    mongoose.connection.on("connecting", () => {
      console.log("Mongoose connecting to the replica set...")
    })

    mongoose.connection.on("connected", async () => {
      console.log("Mongoose connected to the replica set!")
    })

    mongoose.connection.on("error", (err) => {
      console.error(`Mongoose connection error: ${err}`)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from the replica set")
    })

    process.on("SIGINT", async () => {
      await this.disconnect()
      process.exit(0)
    })
  }

  async connect() {
    try {
      // Set up listeners before establishing connection
      this.setupListeners()
      await mongoose.connect(this.uri, this.options)
    } catch (error) {
      console.error(`MongoDB connection error: ${error}`)
      process.exit(1)
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect()
      console.log("MongoDB disconnected")
    } catch (error) {
      console.error(`MongoDB disconnect error: ${error}`)
    }
  }
}

export { DatabaseConnection }
