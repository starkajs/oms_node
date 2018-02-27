const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const keys = require('../config/keys');

const transport = nodemailer.createTransport({
    host: keys.MAIL_HOST,
    port: keys.MAIL_PORT,
    auth: {
        user: keys.MAIL_USER,
        pass: keys.MAIL_PASSWORD
    }
});

const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    return inlined;
}

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: `Optimum PPS <info@optimumpps.co.uk>`,
        to: options.user.email,
        subject: options.subject,
        html: html,
        text
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
}