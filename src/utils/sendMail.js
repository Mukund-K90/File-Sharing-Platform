var nodemailer = require("nodemailer");
const { CONFIG } = require("../config/config");

var mailService = async (to, sub, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: CONFIG.email,
                pass: CONFIG.password,
            },
            tls: {
                rejectUnauthorized: true,
            },
        });

        let mailOption = {
            from: CONFIG.email,
            to: to,
            subject: sub,
            html: body,
        };
        transporter.sendMail(mailOption, async (err, info) => {
            if (err) {
                return console.log(err);
            }
            console.log("Message sent:%s", info.accepted);
        });
    } catch (error) {
        console.error(error);
    }
};

module.exports.mailService = mailService;