const express = require('express');
const bodyParser = require('body-parser'); //used to extract the informations of http request and make them usable
const mongoose = require('mongoose'); //used to connect with the database
const path = require('path'); //used to upload our images
const xss = require('xss-clean'); //security plugin used to prevent users from inserting scripts or HTML on inputs
const helmet = require('helmet'); //global security plugin 

const authRoute = require('./routes/auth');
const saucesRoute = require('./routes/sauces');

mongoose.connect('mongodb+srv://Line:VPjPWFF3ycGvfTQk@cluster0.7otcv.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(xss());
app.use(helmet());

app.use((req, res, next) => { //we declare the headers to allow
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', authRoute);
app.use('/api/sauces', saucesRoute);

module.exports = app;