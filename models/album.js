var mongoose = require('mongoose');

var AlbumSchema = new mongoose.Schema({
	title: String,
	artist: String,
	highlights: [mongoose.Schema.ObjectId]
});

AlbumSchema.methods.addHighlight = function(song_id){
	this.highlights.push(mongoose.Types.ObjectId(song_id));
	this.save(function(err){
		if(err){
			console.log("error adding highlight to album");
		}
	});
};

mongoose.model("Album", AlbumSchema);