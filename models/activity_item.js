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

mongoose.model("ActivityItem", ActivityItemSchema);