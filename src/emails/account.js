const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'park866@gmail.com',
        subject: 'Thank you to joninig us',
        text: 'Welcome to the app, ' + name + '. Let me know how you get along with the app.',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    };
    
    sgMail.send(msg)
}

const sendCancelationEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'park866@gmail.com',
        subject: 'Thank you for use our services',
        text: 'Welcome to the app, ' + name + '. Let me know how you get along with the app.',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    };
    
    sgMail.send(msg)
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}