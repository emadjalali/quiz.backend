const fs = require('fs');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

const sendMailMessage = (templatePath, replacements, to, subject) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SENDMAIL_HOST,
    port: process.env.SENDMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.SENDMAIL_USER,
      pass: process.env.SENDMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  readHTMLFile(templatePath, function (err, html) {
    var template = handlebars.compile(html);
    var htmlToSend = template(replacements);
    var mailOptions = {
      from: process.env.SENDMAIL_USER,
      to: to,
      subject: subject,
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions);
  });
};

const sendEmail = async (to, subject, text, html) => {
  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'windows',
    logger: false,
  });

  let message = {
    from: process.env.SENDMAIL_USER,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  return transporter.sendMail(message);
};

module.exports = { sendMailMessage, sendEmail };
