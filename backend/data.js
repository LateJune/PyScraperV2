const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
        id: Number,
        starring_actors: String,
        director: String,
        rating: String,
        title: String,
        genre: String,
        release_date: String,
        runtime: String,
        img_url: String,
        summary: String, 
    },
    {timestamps: true},
);

// Had to define the pre existing collection 'movies' under the model.
// originally {collections: 'movies'} in the schema under timestamps.
// Did not work for some reason? Despite them filling the same role?
// Maybe some synchronous/async timing issue
module.exports = mongoose.model('Data', DataSchema, 'movies'); 