import express from "express"
import { Like } from "../models/model.js"

const likeRoutes = express.Router()

// Create a new like
likeRoutes.post("/likes", async (req, res) => {
  try {
    const like = new Like(req.body)
    await like.save()
    return res.status(201).json(like, null, 2)
  } catch (error) {
    return res.status(400).json(error)
  }
})

// Get all likes
likeRoutes.get("/likes", async (_, res) => {
  try {
    const likes = await Like.find()
    return res.status(200).json(likes, null, 2)
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Get a like by ID
likeRoutes.get("/likes/:id", async (req, res) => {
  try {
    const like = await Like.findById(req.params.id)
    if (!like) {
      return res.status(404).json("Like not found")
    }
    return res.status(200).json(like, null, 2)
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Update a like by ID
likeRoutes.put("/likes/:id", async (req, res) => {
  try {
    const like = await Like.findByIdAndUpdate(req.params)
    if (!like) {
      return res.status(404).json("Like not found")
    }
    return res.status(200).json(like, null, 2)
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Delete a like by ID
likeRoutes.delete("/likes/:id", async (req, res) => {
  try {
    const like = await Like.findByIdAndDelete(req.params.id)
    if (!like) {
      return res.status(404).json("Like not found")
    }
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Delete all likes
likeRoutes.delete("/likes", async (_, res) => {
  try {
    await Like.deleteMany()
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json(error)
  }
})

export default likeRoutes
