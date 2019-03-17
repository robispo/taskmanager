const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({
//   from: 'ovegeton@hotmail.com',
//   to: 'rabelobispo@hotmail.com',
//   subject: 'Testing sendgrid/mail',
//   text: 'Body'
//   //,html:''
// });

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    from: 'rabelobispo@hotmail.com',
    to: email,
    subject: 'Welcome to TaskManagerApp',
    text: `Welcome to our app, ${name}`
  });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
      from: 'rabelobispo@hotmail.com',
      to: email,
      subject: 'We are sorry because you are going away!',
      text: `Hope to see you soon again, ${name}`
    });
  };

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
