var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
	title: String,
	activity_items: [mongoose.Schema.ObjectId],
	members: [mongoose.Schema.ObjectId]
});

GroupSchema.methods.addActivityItem = function(act_item_id){
	this.activity_items.push(act_item_id);
	this.save(function(err){
		if(err){
			console.log("error adding act item to group");
		}
	});
};

GroupSchema.methods.addMember = function(user_id){
	this.members.push(user_id);
	this.save(function(err){
		if(err){
			console.log("error adding member to group");
		}
	});
};

GroupSchema.methods.getActivityItems = function(callback){
	var AI = mongoose.model('ActivityItem');
	AI.find({'_id': {$in: this.activity_items}}, function(err, docs){
		if(err){
			console.log("error querying for AIs for a group");
		}
		callback(docs);
	});
};

GroupSchema.methods.getAIText = function(callback){
	var User = mongoose.model("User");
	var Song = mongoose.model("Song");
	var AI = mongoose.model('ActivityItem');

	var userName = "";
	var songName = "";

	AI.find({'_id': {$in: this.activity_items}}, function(err, docs){
		if(err){
			console.log("error querying for AIs for a group");
		}
		else{
			console.log("FOUND THESE AIs FOR TEXT: ", docs);
			var resp = {};
			for(var doc in docs){
				console.log("FOUND AI TEXT: ", docs[doc].getGroupTextVersion());
				console.log("AI TEXT TYPE: ", typeof docs[doc]);
				resp[docs[doc]._id] = docs[doc].getGroupTextVersion();
			}
			callback(resp);
		}
	});
};

mongoose.model("Group", GroupSchema);