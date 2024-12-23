import express from "express"
import { Post } from "../models/model.js"

const postRoutes = express.Router()

// Create a new post
postRoutes.post("/posts", async (req, res) => {
  try {
    const post = new Post(req.body)
    await post.save()
    return res.status(201).json(post, null, 2)
  } catch (error) {
    return res.status(400).json(error)
  }
})

// Get all posts
postRoutes.get("/posts", async (_, res) => {
  try {
    const posts = await Post.find()
    return res.status(200).json(posts, null, 2)
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Get a post by ID
postRoutes.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json("Post not found")
    }
    return res.status(200).json(post, null, 2)
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Update a post by ID
postRoutes.put("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params)
    if (!post) {
      return res.status(404).json("Post not found")
    }
    return res.status(200).json(post, null, 2)
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Delete a post by ID
postRoutes.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) {
      return res.status(404).json("Post not found")
    }
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json(error)
  }
})

// Delete all posts
postRoutes.delete("/", async (_, res) => {
  try {
    await Post.deleteMany()
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json(error)
  }
})

export default postRoutes
