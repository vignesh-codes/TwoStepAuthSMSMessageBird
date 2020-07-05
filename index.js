var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
require('dotenv').config();
var messagebird = require('messagebird');
var messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY);
var app = express();




app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended : true }));
app.get('/', (req,res) =>{
    res.render('step1')

})

app.post('/step2', function(req, res) {
    var number = req.body.number;
    messagebird.verify.create(number, {
        originator : 'Code',
        template : 'Your verification code is %token.'
    }, function (err, response) {
        if (err) {
            console.log(err);
            res.render('step1', {
                error : err.errors[0].description
            });
        } else {
            console.log(response);
            res.render('step2', {
                id : response.id
            });
        }
    })
 });

 app.post('/step3', function(req, res) {
    var id = req.body.id;
    var token = req.body.token;
    messagebird.verify.verify(id, token, function(err, response) {
      if (err) {
        console.log(err);
        res.render('step2', {
          error: err.errors[0].description,
          id: id,
        });
      } else {
        console.log(response);
        res.render('step3');
      }
    });
  });

  app.listen(8080, () =>console.log('Listening to 8000'));

