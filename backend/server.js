const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors') // cross reference
const Data = require('./data.js'); //import our data schema for the database
const app = express();
const spawn = require("child_process").spawn;


app.use(cors({credentials: true, origin: true}))
app.use(bodyParser.urlencoded({ extended: true })); 

const url = 'mongodb://localhost:27017/database_testing'; // this is a correct url to our pre existing database

mongoose.connect(url,{useNewUrlParser: true});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(){
    console.log('Connected to Database')
    // We are able to retrieve our data using 
    // mongodb Client functions inside our mongoose function
    /*
    mongoose.connection.db.collection('movies', function(err, collection){
        collection.find({}).toArray(function(err, data){
            console.log(data);
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
  
app.post('/getTitle',(req,res)=>{
  //let movie_title = req.body.movieTitle

  let movie_title = req.query.title;
  
  // create a child process in the same directory and run python file
  // command line inputs will come after separated by commas
  let process = spawn('python',["scraper.py", movie_title]);
  
  // logging data sent back from scraper.py
  process.stdout.on('data',(data) => {
    let dataOut = Buffer.from (data,'hex').toString('utf8');
    console.log(dataOut)
  })
  
  // logging errors sent back from scraper.py
  process.stderr.on('data',(data) =>{
    let dataOut = Buffer.from(data,'hex').toString('utf8');
    console.log(dataOut);
  })
});

app.listen(3001, () => console.log('Listening on port 3001')); //listen on port 3000
//mongoose.connection.close()
