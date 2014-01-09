var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
	title: String,
	acivity_items: [mongoose.Schema.ObjectId],
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

mongoose.model("Group", GroupSchema);