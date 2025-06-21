const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const mongoose = require('mongoose');

// Create a new post
router.post('/', async (req, res) => {
  const { title, content, userId } = req.body;

  try {
    const newPost = new Post({
      title,
      content,
      userId,
    });

    await newPost.save();
    res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating post',
      error: error.message,
    });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching posts',
      error: error.message,
    });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid post ID',
    });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching post',
      error: error.message,
    });
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid post ID',
    });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating post',
      error: error.message,
    });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: 'Invalid post ID',
    });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    res.status(200).json({
      message: 'Post deleted successfully',
      post: deletedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting post',
      error: error.message,
    });
  }
});

module.exports = router;
