const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors') // cross reference some shit
const Data = require('./data.js'); //import our data schema for the database
const app = express();
app.use(cors({credentials: true, origin: true}))

const url = 'mongodb://localhost:27017/database_testing'; // this is a correct url to our pre existing database

mongoose.connect(url,{useNewUrlParser: true});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(){
    console.log('Connected to Database')

    // We are able to retrieve our data the like the old way using 
    // mongodb Client functions inside our mongoose function
    /*
    mongoose.connection.db.collection('movies', function(err, collection){
        collection.find({}).toArray(function(err, data){
            //console.log(data);
        })
    });
    */
});


// How ever accessing them using the schema is proving to be a problem
app.get('/getData', (req, res) => {
    Data.find((err, data) =>{
        if(err)
            return res.json({success: false, error: err});
        else
            return res.json({success: true, data: data})
    });
});

mongoose.connection.close()

app.listen(3001, () => console.log('Listening on port 3001')); //listen on port 3000
