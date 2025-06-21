const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, iat, exp }
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// @route   POST /api/posts
// @desc    Create a new blog post
// @access  Private
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newPost = new Post({
      title,
      content,
      userId: req.user.userId
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: savedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating post', error: error.message });
  }
});

// @route   GET /api/posts
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'email'); // optionally include 'name'
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching posts', error: error.message });
  }
});

module.exports = router;


// @route PUT /api/posts/:id
// @desc Update a post by ID
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Check if title and content are provided
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Find post by ID
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the post owner
    if (post.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only update your own posts" });
    }

    // Update the post
    post.title = title;
    post.content = content;

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
});


// @route DELETE /api/posts/:id
// @desc Delete a post by ID
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});