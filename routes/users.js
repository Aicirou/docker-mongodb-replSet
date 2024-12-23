import express from "express"
import { User } from "../models/model.js"

const userRoutes = express.Router()

// Create a new user
userRoutes.post("/users", async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    return res.status(201).json(user, null, 2)
  } catch (error) {
    return res.status(400).json(error)
  }
})

// Get all users
userRoutes.get("/users", async (_, res) => {
  try {
    const users = await User.find()
    return res.status(200).json(users, null, 2)
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Get a user by ID
userRoutes.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json("User not found")
    }
    return res.status(200).json(user, null, 2)
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Update a user by ID
userRoutes.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params)
    if (!user) {
      return res.status(404).json("User not found")
    }
    return res.status(200).json(user, null, 2)
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Delete a user by ID
userRoutes.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json("User not found")
    }
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Delete all users
userRoutes.delete("/users", async (_, res) => {
  try {
    await User.deleteMany()
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json(error)
  }
})

export default userRoutes
