const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "3010a9a85fe09f",
        pass: "519f306f342cbc"
    }
})

module.exports = {transporter}