const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const params = new URLSearchParams(event.body);
    const firstName = params.get('firstName') || '';
    const lastName = params.get('lastName') || '';
    const phone = params.get('phone') || '';
    const email = params.get('email') || '';
    const message = params.get('message') || '';

    const recipientSmsEmail = process.env.SMS_RECIPIENT_EMAIL || '3105038006@tmomail.net';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASS
        }
    });

    const smsText = `New Service Request!\nName: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\nMsg: ${message}`;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: recipientSmsEmail,
            subject: 'New Web Intake Request',
            text: smsText
        });

        return {
            statusCode: 200,
            body: '<h2>Thank you! Your request has been received successfully.</h2>'
        };
    } catch (error) {
        console.error('Email-to-SMS Error:', error);
        return {
            statusCode: 500,
            body: 'Error processing your request.'
        };
    }
};
