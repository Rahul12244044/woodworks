// scripts/seedBlogPosts.js
import { connectDB } from '../lib/db';
import BlogPost from '../models/BlogPost';
import User from '../models/User';

const seedBlogPosts = async () => {
  try {
    await connectDB();
    
    // Get admin user to use as author
    const adminUser = await User.findOne({ role: 'admin' });
    
    const blogPosts = [
      {
        title: "Choosing the Right Wood for Your First Project",
        excerpt: "A beginner's guide to selecting the perfect wood species...",
        content: "...full content here...",
        author: adminUser._id,
        category: "beginner",
        readTime: 8,
        tags: ["beginner", "wood selection", "projects"],
        featured: true
      },
      // ... more posts
    ];

    for (const postData of blogPosts) {
      const post = new BlogPost(postData);
      await post.save();
      console.log(`Created post: ${post.title}`);
    }

    console.log('Blog posts seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blog posts:', error);
    process.exit(1);
  }
};

seedBlogPosts();