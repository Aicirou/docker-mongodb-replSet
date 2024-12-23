import mongoose from "mongoose"

// Helper to create a standard response
const createResponse = (message, data = {}) => ({
  message,
  timestamp: new Date().toLocaleString(),
  ...data,
})

// Fetch collections and document counts
const getCollectionsInfo = async () => {
  const collections = await mongoose.connection.db.listCollections().toArray()
  return Promise.all(
    collections.map(async (collection) => {
      const count = await mongoose.connection.db
        .collection(collection.name)
        .countDocuments()
      return { name: collection.name, count }
    })
  )
}

// Simulate slow response
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Export function to display database information
export const dbinfo = async (_, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    const collectionsInfo = await getCollectionsInfo()
    const databaseInfo = {
      database: {
        name: mongoose.connection.name,
        collections: collectionsInfo,
      },
    }

    await sleep(100)
    return res
      .status(200)
      .json(
        createResponse(
          "Welcome to the Dockerized Node.js and 3-PSA-nodes MongoDB example",
          databaseInfo
        )
      )
  } catch (error) {
    return res
      .status(500)
      .json(createResponse(error.message, { status: "error" }))
  }
}
