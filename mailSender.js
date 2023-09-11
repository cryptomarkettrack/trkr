import * as nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import logger from './logger.js'
dotenv.config({ path: './.env' })

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

export const sendEmail = (content, attachments = []) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: 'crypto.market.track@gmail.com',
        subject: 'Trades report - ' + new Date().toLocaleString(),
        text: content,
        attachments
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            logger.error(error);
        } else {
            console.log('Email sent: ' + info.response)
            logger.info('Email sent: ' + info.response);
        }
    })
}
