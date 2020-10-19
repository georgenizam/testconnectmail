// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mailer = require('./nodemailer');

const { request, response } = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (request, response) => {
    response.send('ok');    
});

app.post('/sendmail', (request, response) => {    
  console.log('request = ', request.body);
  let emails = request.body.emails;  
  mailer.saveNewCred( {
      user: request.body.cred.name,
      pass: request.body.cred.pass,
      from: request.body.cred.from
    });  
  
  let arrayPromise = [];
  for (let i=0; i<emails.length; i++) {    
    const message = {
      from: `Mailer test: <${mailer.from}>`,
      to: `${emails[i].email}`,
      subject: `${emails[i].subject}`,
      text: `${emails[i].body}`
    }
    // mailer(message)    
    arrayPromise.push(mailer.send(message, emails[i].leadId));
  }  
  Promise.all(arrayPromise)
        .then((results) => {          
          let res = JSON.stringify({results});   
          console.log('res = ', res);
          return response.send(res);
        })
        .catch((err) => {
          console.log("error ", err);
        })        
});

// app.set("port", port);
app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
});

