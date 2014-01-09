var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({
	title: String,
	artist: String,
	album: String,
	youTubeLink: String,
	group_id: mongoose.Schema.ObjectId
});

mongoose.model("Song", SongSchema);