const mongoose = require('mongoose');

// Define the post schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    content: {
      type: String,
      required: true,
      minlength: 20, // Ensure content has a minimum length (for example)
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assumes you have a User model
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Index the userId field for faster lookups (optional but recommended if you query by user frequently)
postSchema.index({ userId: 1 });

module.exports = mongoose.model('Post', postSchema);
