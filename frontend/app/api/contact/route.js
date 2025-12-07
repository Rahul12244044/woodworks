import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import ContactMessage from '../../../models/ContactMessage';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    console.log('📧 Contact form submission received');
    
    const body = await request.json();
    const { name, email, subject, message, woodType } = body;

    console.log('📦 Contact form data:', {
      name,
      email,
      subject,
      message: message.substring(0, 100) + '...',
      woodType
    });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name, email, subject, and message are required' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please provide a valid email address' 
        },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('✅ Database connected');

    // Get client info for logging
    const ipAddress = request.headers.get('x-forwarded-for') || 'Unknown';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Save to database
    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      woodType: woodType?.trim() || '',
      ipAddress,
      userAgent
    });

    await contactMessage.save();
    console.log('✅ Message saved to database:', contactMessage._id);

    // Send email notification using Resend
    try {
      await sendResendEmail(contactMessage);
      console.log('✅ Email notification sent via Resend');
    } catch (emailError) {
      console.error('❌ Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      messageId: contactMessage._id
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: errors.join(', ') 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send message. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Resend email function
async function sendResendEmail(contactMessage) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Premium Woods <onboarding@resend.dev>', // You can use your verified domain later
      to: ['gkjajoria76@gmail.com'],
      subject: `New Contact Form: ${contactMessage.subject}`,
      reply_to: contactMessage.email,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              margin: 0; 
              padding: 0; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #ffffff;
            }
            .header { 
              background: linear(135deg, #3b82f6, #1d4ed8); 
              color: white; 
              padding: 30px 20px; 
              text-align: center; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 24px; 
              font-weight: 700;
            }
            .header p { 
              margin: 8px 0 0 0; 
              opacity: 0.9; 
              font-size: 14px;
            }
            .content { 
              padding: 30px; 
              background: #f8fafc;
            }
            .card {
              background: white;
              border-radius: 8px;
              padding: 24px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              margin-bottom: 20px;
            }
            .field { 
              margin-bottom: 16px; 
              display: flex;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 12px;
            }
            .field:last-child {
              border-bottom: none;
              margin-bottom: 0;
            }
            .label { 
              font-weight: 600; 
              color: #475569; 
              width: 120px;
              flex-shrink: 0;
            }
            .value { 
              color: #0f172a; 
              flex: 1;
            }
            .message-box { 
              background: #f8fafc; 
              padding: 20px; 
              border-radius: 8px; 
              border-left: 4px solid #3b82f6;
              margin-top: 8px;
              white-space: pre-wrap;
              font-family: inherit;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #64748b;
              font-size: 12px;
              border-top: 1px solid #e2e8f0;
              margin-top: 24px;
            }
            .badge {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin-left: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📨 New Contact Message</h1>
              <p>Premium Woods Website Contact Form</p>
            </div>
            
            <div class="content">
              <div class="card">
                <div class="field">
                  <span class="label">👤 Name:</span>
                  <span class="value">${contactMessage.name}</span>
                </div>
                
                <div class="field">
                  <span class="label">📧 Email:</span>
                  <span class="value">
                    ${contactMessage.email}
                    <a href="mailto:${contactMessage.email}" style="color: #3b82f6; text-decoration: none; margin-left: 8px;">
                      ↗ Reply
                    </a>
                  </span>
                </div>
                
                <div class="field">
                  <span class="label">📋 Subject:</span>
                  <span class="value">${contactMessage.subject}</span>
                </div>
                
                ${contactMessage.woodType ? `
                <div class="field">
                  <span class="label">🌳 Wood Type:</span>
                  <span class="value">
                    ${contactMessage.woodType}
                    <span class="badge">Interest</span>
                  </span>
                </div>
                ` : ''}
                
                <div class="field" style="display: block;">
                  <span class="label">💬 Message:</span>
                  <div class="message-box">
                    ${contactMessage.message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                
                <div class="field">
                  <span class="label">🕒 Submitted:</span>
                  <span class="value">${new Date(contactMessage.createdAt).toLocaleString('en-US', { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                
                <div class="field">
                  <span class="label">🆔 Message ID:</span>
                  <span class="value" style="font-family: monospace; font-size: 12px;">${contactMessage._id}</span>
                </div>
              </div>
              
              <div class="footer">
                <p>This message was sent from your Premium Woods website contact form.</p>
                <p>IP: ${contactMessage.ipAddress} • ${new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Resend email sent successfully:', data?.id);
    return data;
    
  } catch (error) {
    console.error('❌ Resend email sending error:', error);
    throw error;
  }
}

// Optional: GET endpoint to retrieve messages
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const status = searchParams.get('status');

    const query = status ? { status } : {};
    
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-userAgent -ipAddress');

    const total = await ContactMessage.countDocuments(query);

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}