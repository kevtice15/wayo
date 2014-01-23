var mongoose = require('mongoose');

var ActivityItemSchema = new mongoose.Schema({
	timestamp: {type: Date, default: Date.now},
	user: mongoose.Schema.ObjectId,
	song: mongoose.Schema.ObjectId,
	group: mongoose.Schema.ObjectId
});

ActivityItemSchema.statics.findByUser = function(user_id){
	return this.find({user: user_id});
};

ActivityItemSchema.statics.findByGroup = function(group_id){
	return this.find({group: group_id});
};

ActivityItemSchema.methods.getGroupTextVersion = function(){
	var User = mongoose.model("User");
	var Song = mongoose.model("Song");

	var self = this;
	var userName = "";
	var songName = "";

	console.log("LOOKING FOR USER: ", self.user);
	User.findById(self.user, function(err, foundUser){
		if(err){
			console.error("Error finding user from AI");
		}
		console.log("LOOKING FOR SONG: ", self.song);
		Song.findById(self.song, function(err, foundSong){
			if(err){
				console.error("Error finding song from AI");
			}
			console.log("AI FOUND USER:", foundUser);
			userName = foundUser.username;
			console.log("USERNAME IS:", foundUser.username);
			console.log("AI FOUND SONG:", userName);
			songName = foundSong.title;
			songAlbum = foundSong.album;
			console.log("SONGNAME IS:", songName);
			console.log("GENERATED STRING: ", userName + " added " + songName + ', ' + songAlbum);
			var string = userName + " added " + songName + ', ' + songAlbum;
			return string;
		});
	});
};

ActivityItemSchema.methods.getSongTextVersion = function(){
	var Group = mongoose.model("Group");
	var Song = mongoose.model("Song");

	var groupName = "";
	var songName = "";

	Group.findById(this.group, function(foundGroup){
		console.log("AI FOUND GROUP:", foundGroup);
		groupName = foundGroup.title;
	});

	Song.findById(this.song, function(foundSong){
		console.log("AI FOUND SONG:", foundSong);
		songName = foundSong.title;
	});

	return "Added " + songName + " to " + groupName;
};
mongoose.model("ActivityItem", ActivityItemSchema);