// app/api/subscribe/route.js - CORRECTED VERSION
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Subscriber from '../../../models/Subscriber';
import { Resend } from 'resend';

// Create Resend instance with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    await connectDB();
    
    const { email } = await request.json();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      );
    }

    // Create new subscriber
    const newSubscriber = new Subscriber({
      email,
      subscribedAt: new Date()
    });

    await newSubscriber.save();

    // Send welcome email
    await sendWelcomeEmail(email);

    return NextResponse.json(
      { message: 'Successfully subscribed to our newsletter!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

// Fixed email function - use the resend instance
async function sendWelcomeEmail(email) {
  try {
    // Use the resend instance (lowercase) you created above
    const { data, error } = await resend.emails.send({
      from: 'WoodWorks <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to WoodWorks Newsletter! 🪵',
html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    /* Header Animation */
    .header { 
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      color: white; 
      padding: 30px 20px; 
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '🪵';
      font-size: 80px;
      position: absolute;
      top: 10px;
      right: 20px;
      opacity: 0.1;
      animation: float 3s ease-in-out infinite;
    }
    .header h1 {
      margin: 0;
      font-size: 2.5em;
      animation: slideInDown 0.8s ease-out;
    }
    
    /* Content Animations */
    .content { 
      background: #f9fafb; 
      padding: 40px 30px;
    }
    .content p {
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }
    .content h3 {
      color: #1f2937;
      border-left: 4px solid #f59e0b;
      padding-left: 15px;
      animation: slideInLeft 0.6s ease-out 0.4s both;
    }
    
    /* List Animations */
    .benefits-list {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }
    .benefits-list li {
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
      animation: fadeInUp 0.6s ease-out both;
    }
    .benefits-list li:nth-child(1) { animation-delay: 0.6s; }
    .benefits-list li:nth-child(2) { animation-delay: 0.7s; }
    .benefits-list li:nth-child(3) { animation-delay: 0.8s; }
    .benefits-list li:nth-child(4) { animation-delay: 0.9s; }
    .benefits-list li:nth-child(5) { animation-delay: 1.0s; }
    
    /* Tip Section Animation */
    .tip-section {
      background: linear-gradient(135deg, #fef3c7 0%, #fef7cd 100%);
      border-left: 4px solid #f59e0b;
      padding: 20px;
      margin: 30px 0;
      border-radius: 0 8px 8px 0;
      animation: pulse 2s ease-in-out 1.2s both;
    }
    
    /* Footer */
    .footer { 
      text-align: center; 
      padding: 30px 20px; 
      color: #6b7280; 
      font-size: 14px;
      background: #1f2937;
      color: white;
    }
    .footer-links {
      margin: 15px 0;
    }
    .footer-links a {
      color: #fbbf24;
      text-decoration: none;
      margin: 0 10px;
      transition: color 0.3s ease;
    }
    .footer-links a:hover {
      color: #f59e0b;
    }
    
    /* Keyframe Animations */
    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
      100% {
        transform: scale(1);
      }
    }
    
    /* Hover Effects */
    .benefits-list li:hover {
      background: rgba(245, 158, 11, 0.1);
      transform: translateX(10px);
      transition: all 0.3s ease;
    }
    
    /* Responsive */
    @media (max-width: 600px) {
      .container {
        margin: 10px;
      }
      .header h1 {
        font-size: 2em;
      }
      .content {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header with animated wood emoji -->
    <div class="header">
      <h1>Welcome to WoodWorks! 🪵</h1>
    </div>
    
    <!-- Content with staggered animations -->
    <div class="content">
      <p>Hello there,</p>
      <p>Thank you for subscribing to the WoodWorks newsletter! We're excited to have you in our community of woodworking enthusiasts.</p>
      
      <h3>What you'll receive:</h3>
      <ul class="benefits-list">
        <li>📚 <strong>Weekly woodworking tips & techniques</strong> - Master new skills every week</li>
        <li>🛠️ <strong>New project ideas and detailed plans</strong> - From simple to complex builds</li>
        <li>🔧 <strong>Tool reviews and recommendations</strong> - Make informed purchasing decisions</li>
        <li>🎁 <strong>Exclusive offers and discounts</strong> - Special deals just for subscribers</li>
        <li>🌲 <strong>Wood species guides and material insights</strong> - Choose the perfect wood for every project</li>
      </ul>
      
      <p>We're passionate about helping woodworkers of all skill levels create beautiful projects and develop their skills.</p>
      
      <!-- Animated tip section -->
      <div class="tip-section">
        <p><strong>🎯 Your first woodworking tip:</strong> Always measure twice, cut once! This timeless advice saves materials, time, and frustration on every project.</p>
      </div>
      
      <p>Get ready to transform your workshop and take your skills to the next level!</p>
      
      <p>Happy woodworking!</p>
      <p><strong>The WoodWorks Team</strong></p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p><strong>WoodWorks</strong> • 123 Craftsmanship Lane • Workshop, WW 12345</p>
      <div class="footer-links">
        <a href="#" style="color: #fbbf24;">Unsubscribe</a> | 
        <a href="#" style="color: #fbbf24;">Preferences</a> | 
        <a href="#" style="color: #fbbf24;">Contact Us</a>
      </div>
      <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
        Building better woodworkers, one project at a time 🔨
      </p>
    </div>
  </div>
</body>
</html>
`
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    console.log('✅ Welcome email sent successfully:', data);
    return true;

  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}