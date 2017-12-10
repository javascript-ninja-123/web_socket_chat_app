const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');



const sendVertificationEmail = (email,code) => {
  const msg = {
    to:  email,
    from: 'bitcoinChat@chat.com',
    subject: 'Vertify your email address',
    text: 'Vertifiy your email address',
    html: `<storng>Code: ${code}</strong>`,
  };
  sgMail.send(msg);

}

module.exports = {
  sendVertificationEmail
}
