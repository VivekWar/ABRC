import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendRideRequestEmail(
  recipientEmail: string,
  recipientName: string,
  requesterName: string,
  destination: string,
  departureTime: string
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: '🚗 New Ride Request - CNB Taxi Share',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚗 New Ride Request!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4a5568; margin-top: 0;">Hi ${recipientName}!</h2>
          
          <p style="color: #718096; font-size: 16px; line-height: 1.6;">
            <strong>${requesterName}</strong> wants to join your ride and share the taxi fare with you.
          </p>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #4a5568; margin-top: 0;">Trip Details:</h3>
            <p style="margin: 5px 0; color: #718096;"><strong>📍 Destination:</strong> ${destination}</p>
            <p style="margin: 5px 0; color: #718096;"><strong>🕒 Departure:</strong> ${new Date(departureTime).toLocaleString()}</p>
            <p style="margin: 5px 0; color: #718096;"><strong>👤 Requester:</strong> ${requesterName}</p>
          </div>
          
          <p style="color: #718096; font-size: 16px; line-height: 1.6;">
            Log in to your CNB Taxi Share account to accept or decline this request.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;">
              View Request
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #a0aec0; font-size: 14px; text-align: center;">
            This email was sent by CNB Taxi Share. If you didn't expect this email, please ignore it.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Ride request email sent successfully');
  } catch (error) {
    console.error('Error sending ride request email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '🎉 Welcome to CNB Taxi Share!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Welcome to CNB Taxi Share!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4a5568; margin-top: 0;">Hi ${userName}!</h2>
          
          <p style="color: #718096; font-size: 16px; line-height: 1.6;">
            Welcome to CNB Taxi Share! We're excited to have you join our community of smart travelers.
          </p>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a5568; margin-top: 0;">What you can do:</h3>
            <ul style="color: #718096; line-height: 1.8;">
              <li>🚗 Find travel partners and share taxi fares</li>
              <li>📍 Post your travel plans</li>
              <li>💰 Save money on transportation</li>
              <li>🤝 Connect with fellow students</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;">
              Start Sharing Rides
            </a>
          </div>
          
          <p style="color: #718096; font-size: 16px; line-height: 1.6;">
            Happy travels!<br>
            The CNB Taxi Share Team
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}
