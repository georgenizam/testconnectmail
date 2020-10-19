const nodemailer = require('nodemailer');

const mailer = {
  user: '',
  pass: '',
  from: '',

  send: function(message, leadId) {  
    let transporter = this.transporter(this.user, this.pass);

    return new Promise((resolve, reject) => {
      transporter.sendMail(message, (err, info) => {
        // if (err) return console.log(err);
        // console.log('Email send: ', info);
        if (err) {
          console.log("error");
          reject({        
            "lead": leadId,            
            "status": 500
          });
        }
        else if (info) {
          console.log("success");
          resolve({        
            "lead": leadId,            
            "status": 200
          });
        }
        
      });
    });
  },

  transporter: function(user, pass){
      return nodemailer.createTransport({
      pool: true,
      maxConnections: 8,
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // if port 465  - true
      auth: {
          user: user,
          pass: pass
      }      
    });
  },

  saveNewCred: function({user, pass, from}) {
    this.user = user;
    this.pass = pass;
    this.from = `<${from}>`;
  }


};

module.exports = mailer;