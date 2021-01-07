const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

const auth = {
    auth:{
        api_key: '7ef457377564c6fca26cbb3e0bba6e52-95f6ca46-cb976616',
        domain: 'sandboxeefbe64c44084ac0befdd1f170b6ef82.mailgun.org'
    }
};

const transport = nodemailer.createTransport(mailgun(auth));

const sendEmail = function(email, subject, message){
    const mailOptins = {
        from: email,
        to : 'irth@biu.bi',
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