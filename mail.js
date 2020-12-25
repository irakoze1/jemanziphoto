const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

const auth = {
    auth:{
        api_key: '77aaa712ee1948a087ab2aee07bf13a5-95f6ca46-197b7b09',
        domain: 'sandboxc3bd0909fcde483ca0a0dfe788ba5530.mailgun.org'
    }
};

const transport = nodemailer.createTransport(mailgun(auth));

const sendEmail = function(email, subject, message){
    const mailOptins = {
        from: email,
        to : 'frankgangihakil17@gmail.com',
        subject: subject,
        text: message
    };
    
    transport.sendMail(mailOptins, (err, data) =>{
        if(err){
            console.log('error Occurs');
        }else{
            console.log('messange sent....');
        }
    })
}

module.exports = sendEmail;