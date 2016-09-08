/**
 * Module dependencies. asdasfds
 */

var express = require('express')
  //, bodyParser = require('body-parser')
  , routes = require('./routes')
  , http = require('http')
  , mongoose = require('mongoose')
  , cors = require('cors')
  , tokenValidation = require('./models/tokenValidation')
  , users = require('./routes/users')
  , carousel = require('./routes/carousel')
  , domains = require('./routes/emailDomains')
  , folders = require('./routes/folders')
  , tokens = require('./routes/tokens')
  //, events = require('./routes/events')
  , ideas = require('./routes/ideas')
  , fileUpload = require('express-fileupload');

// MongoDB Connection 
mongoose.connect('mongodb://localhost/innovalab');
var app = express();
//app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());
app.options('*', cors());

app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  //app.use(express.logger('dev'));
  //app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*router.use(function (req, res, next) {
  console.log('Url: ' + req.path);
  next();
});*/

app.get('/', tokenValidation.isAuth, routes.index);

app.post('/upload', function(req, res) {
    var sampleFile;
 
    if (!req.files) {
        res.status(500).send('No files were uploaded.');
        console.log("No files were uploaded.");
        return;
    }
 
    sampleFile = req.files.sampleFile;
    var uploadPath = __dirname + '/public/' + sampleFile.name;
    sampleFile.mv(uploadPath, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
});

users.configure(app);
carousel.configure(app);
domains.configure(app);
folders.configure(app);
tokens.configure(app);
//events.configure(app);
ideas.configure(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port %s in %s mode.",  app.get('port'), app.settings.env);
});
