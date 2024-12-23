import express from "express"

import userRoutes from "./users.js"
import postRoutes from "./posts.js"
import likeRoutes from "./likes.js"

const routes = express.Router()

routes.use("/users", userRoutes)
routes.use("/posts", postRoutes)
routes.use("/likes", likeRoutes)
// // Handle unhandled routes
// routes.use((_, res) => {
//   return res.status(404).send("Route not found")
// })

export default routes
