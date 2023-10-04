var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const cors = require('cors')

var app = new express();
var apiRoutes = require('./routes/routes.js');
var mongodb = require('./config/mongoconfig.js');

app.use(cors())
app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json())
app.use(express.json());

const mongo = mongoose.connect(mongodb.url);
mongo.then(() =>{
    console.log('Mongo_DB Connected Successfully')
}, error =>{
    console.log(error,'Error, While connecting to Mongo_DB somthing went wrong');
});

var port = process.env.PORT || 6000;
app.listen(port,() => {console.log("Server running on port "+port)});

// app.use(cors());
app.get('/',(req,res) =>  res.send('Welcome to Signin Page'));

app.use('/api/insurance',apiRoutes);

module.exports = app;
