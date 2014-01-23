var mongoose = require('mongoose');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.on('addSong', function(user_id, song){
	var ActivityItem = mongoose.model('ActivityItem');
	console.log("Add song event");
	var fields = {user: user_id, song: song._id, group: song.group_id};
	console.log(fields);
	var newAI = new ActivityItem(fields);
	newAI.save(function(err, AI){
		if(err){
			console.log("error creating new song activity item");
		}
		console.log("new AI", AI);
	});

	var Group = mongoose.model('Group');
	Group.findById(song.group_id, function(err, doc){
		if(err){
			console.error("error finding group to ad AI to");
		}
		doc.addActivityItem(newAI._id);
		doc.save(function(err, AI){
			if(err){
				console.error("saving new AI to group");
			}
		});
	});
});

exports.addGroup = function(session, body){
	console.log("SESS: ", session);
	console.log("BODY: ", body);
	var User = mongoose.model('User');
	var Group = mongoose.model('Group');

	//Add the new group to the db;
  var fields = {
		title: body.title,
		members: [mongoose.Types.ObjectId(session.passport.user)]
  };

  var newGroup = new Group(fields);
  newGroup.save(function(err, Resource) {
    if (err) {
      //response.send(500, {error: err});
      console.log("error creating new group in addGroup");
    }
    //response.send(Resource);
  });

  //Add new group to user
  var currentUser = User.findById(mongoose.Types.ObjectId(session.passport.user), function(err, foundUser){
		if(err){
			console.log("Error finding user in addGroup");
		}
		foundUser.addGroup(newGroup._id);
  });
};

exports.getGroupSet = function(query, response){
	console.log(query);
	var Group = mongoose.model('Group');
	Group.find({'_id' : {$in: query.data}}, function(err, docs){
		if(err){
			console.log("error getting groups in getGroupSet");
		}
		else{
			console.log(docs);
			response.send(docs);
		}
	});
};

exports.addSong = function(request, response){
	var Song = mongoose.model('Song');
    var fields = request.body;

    var newSong = new Song(fields);
    newSong.save(function(err, Song) {
        if (err) {
            response.send(500, {error: err});
        }
        response.send(Song);
    });
  emitter.emit('addSong', request.session.passport.user, newSong);
};

exports.getGroupActivity = function(request, response){
	var Group = mongoose.model('Group');
	var query = request.query;
	console.log("GGA QUERY: ", request.query);
	Group.findById(request.query.data, function(err, foundGroup){
		if(err){
			response.send(500, {error: err});
		}
		console.log("FOUND GROUP:", foundGroup);
		foundGroup.getAIText(function(ais){
			console.log("GOT THESE AIs ", ais);
			response.send(ais);
		});
	});
};

exports.nukeTheDb = function(request, response){
	var User = mongoose.model('User'),
	Group = mongoose.model('Group'),
	Album = mongoose.model('Album'),
	Song = mongoose.model('Song'),
	ActivityItem = mongoose.model('ActivityItem');

	User.remove({}, function(err){
		if(err){
			console.error("error nuking the db - user");
		}
	});
	Group.remove({}, function(err){
		if(err){
			console.error("error nuking the db - group");
		}
	});
	Album.remove({}, function(err){
		if(err){
			console.error("error nuking the db - album");
		}
	});
	Song.remove({}, function(err){
		if(err){
			console.error("error nuking the db - song");
		}
	});
	ActivityItem.remove({}, function(err){
		if(err){
			console.error("error nuking the db - activity item");
		}
	});

	console.log("DB BEEN NUKED!!!");

	response.send({data: true});
};
