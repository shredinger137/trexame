var nodemailer = require("nodemailer");
var config = require("./config.js");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: config.emailUsername,
      pass: config.emailPass
  }
});



module.exports = {
  sendEmailToUser: function (emailAddress, subject, content) {
    const mailOptions = {
      from: config.emailFrom,
      to: emailAddress,
      subject: subject,
      html: content
  };

  transporter.sendMail(mailOptions, function (err, info) {
      if (err)
          console.log(err)
      else
          console.log(info);
  });
    }
  };