const twilio = require('twilio');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Parse incoming form data
    const params = new URLSearchParams(event.body);
    const firstName = params.get('firstName') || '';
    const lastName = params.get('lastName') || '';
    const phone = params.get('phone') || '';
    const email = params.get('email') || '';
    const message = params.get('message') || '';

    // Environment variables set in Netlify dashboard
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    const client = twilio(accountSid, authToken);

    const smsContent = `New Service Request!\nName: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}\nMsg: ${message}`;

    try {
        await client.messages.create({
            body: smsContent,
            from: twilioPhoneNumber,
            to: '+13105038006' // Your mobile number
        });

        return {
            statusCode: 200,
            body: '<h2>Thank you! Your request has been received.</h2>'
        };
    } catch (error) {
        console.error('Twilio Error:', error);
        return {
            statusCode: 500,
            body: 'Error sending SMS notification.'
        };
    }
};
