var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	twitter_id: String,
	username: String,
	name: String,
	displayName: String,
	email: String,
	imageUrl: String,
	groups: [mongoose.Schema.ObjectId],
	activity_items: [mongoose.Schema.ObjectId]
});

UserSchema.methods.addGroup = function(group_id){
	this.groups.push(mongoose.Types.ObjectId(group_id));
	this.save(function(err){
		if(err){
			console.log("error adding group to user");
		}
	});
};

UserSchema.methods.addActivityItem = function(act_item_id){
	this.activity_items.push(mongoose.Types.ObjectId(act_item_id));
	this.save(function(err){
		if(err){
			console.log("error adding act item to user");
		}
	});
};

mongoose.model("User", UserSchema);