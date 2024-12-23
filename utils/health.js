import mongoose from "mongoose"

// Health check
export const healthCheck = async (_, res) => {
  res.setHeader("Content-Type", "application/json")

  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection is not ready")
    }

    // Ping database
    const pingResult = await mongoose.connection.db.admin().ping()
    if (!pingResult?.ok) {
      throw new Error("Database ping failed")
    }

    // Get replica set status
    const admin = mongoose.connection.db.admin()
    const result = await admin.replSetGetStatus()
    const healthyNodes = result.members.filter((member) => member.health === 1)

    if (healthyNodes.length === 0) {
      throw new Error("No healthy nodes in the replica set")
    }

    const response = {
      status: "success",
      message: "Health check passed",
      timestamp: new Date().toLocaleString(),
      database: {
        replicaSet: result.set,
        nodesHealth: `${healthyNodes.length}/${result.members.length}`,
        nodes: result.members.map((member) => ({
          name: member.name,
          state: member.stateStr,
          health: member.health === 1 ? "healthy" : "unhealthy",
          uptime: `${member.uptime}s`,
        })),
      },
    }

    return res.status(200).send(JSON.stringify(response, null, 2))
  } catch (error) {
    return res.status(500).send(
      JSON.stringify(
        {
          status: "error",
          message: error.message,
          timestamp: new Date().toLocaleString(),
        },
        null,
        2
      )
    )
  }
}
