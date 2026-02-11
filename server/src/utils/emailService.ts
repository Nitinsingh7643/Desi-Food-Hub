import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'host' and 'port' for other providers
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOrderConfirmationEmail = async (order: any, userEmail: string) => {
    try {
        const mailOptions = {
            from: `"Desi Food Hub" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Order Confirmation #${order._id.toString().slice(-6).toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #E23744;">Order Confirmed! 🍛</h1>
                    <p>Hi there,</p>
                    <p>Thank you for ordering from Desi Food Hub. Your order has been received and is being prepared.</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <h3>Order Summary</h3>
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Total Amount:</strong> ₹${order.totalPrice}</p>
                        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #ddd;" />
                        
                        <h4>Items:</h4>
                        <ul style="padding-left: 20px;">
                            ${order.items.map((item: any) => `
                                <li style="margin-bottom: 5px;">
                                    ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <p>You can track your order status on our website.</p>
                    <p>Bon Appétit!<br/>The Desi Food Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
