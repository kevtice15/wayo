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
	console.log("QUERY: ", request.query);
	Group.findById(request.query.data, function(err, foundGroup){
		if(err){
			response.send(500, {error: err});
		}
		console.log("FOUND GROUP:", foundGroup);
		foundGroup.getActivityItems(function(ais){
			console.log("GOT THESE AIs ", ais);
			response.send(ais);
		});
	});
};
/*
var g = {
	songIdCounter: 1,
	groupIdCounter: 4,
	activityItemIdCounter: 1,
	userIdCounter: 1,
	albumIdCounter: 1
};


var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();


function Song(title, artist, album, group_id){
	this.id = g.songIdCounter;
	g.songIdCounter++;
	this.title = title;
	this.artist = artist;
	this.album = album;
	this.group_id = group_id;
}

Song.prototype.getTitle = function(){
	return this.title;
};

Song.prototype.getArtist = function(){
	return this.artist;
};

Song.prototype.getAlbum = function(){
	return this.album;
};

Song.prototype.getGroupId = function(){
	return this.group_id;
};



function Group(title){
	this.id = g.groupIdCounter;
	g.groupIdCounter++;
	this.title = title;
}

Group.prototype.getTitle = function(){
	return this.title;
};


function ActivityItem(user_id, song_id, group_id){
	this.id = g.activityItemIdCounter;
	g.activityItemIdCounter++;
	this.timestamp = new Date();
	this.user_id = user_id;
	this.song_id = song_id;
	this.group_id = group_id;
}

ActivityItem.prototype.getTimestamp = function(){
	return this.timestamp;
};
ActivityItem.prototype.getUserId = function(){
	return this.user_id;
};
ActivityItem.prototype.getSongId = function(){
	return this.song_id;
};
ActivityItem.prototype.getGroupId= function(){
	return this.group_id;
};


function User(first_name, last_name){
	this.id = g.userIdCounter;
	g.userIdCounter++;
	this.first_name = first_name;
	this.last_name = last_name;
}

User.prototype.getFirstName = function(){
	return this.first_name;
};

User.prototype.getLastName = function(){
	return this.last_name;
};

function Album(title){
	this.id = g.albumIdCounter;
	g.albumIdCounter++;
	this.title = title;
}


var users = [
	{id: 1,
	first_name: "User",
	last_name: "One"},
	{id: 2,
	first_name: "User",
	last_name: "Two"},
	{id: 3,
	first_name: "User",
	last_name: "Three"},
	{id: 4,
	first_name: "User",
	last_name: "Four"},
	{id: 5,
	first_name: "User",
	last_name: "Five"},
	{id: 6,
	first_name: "User",
	last_name: "Six"},
	{id: 7,
	first_name: "User",
	last_name: "Seven"},
	{id: 8,
	first_name: "User",
	last_name: "Eight"},
	{id: 9,
	first_name: "User",
	last_name: "Nine"},
	{id: 10,
	first_name: "User",
	last_name: "Ten"}
];

var groups = [
	{id: 1,
	title: "Super Friends"},
	{id: 2,
	title: "The Pride"},
	{id: 3,
	title: "The Homies"}
];
var group_members = [
	{group_id: 1,
	user_id: 2},
	{group_id: 1,
	user_id: 3},
	{group_id: 1,
	user_id: 6},
	{group_id: 1,
	user_id: 8},
	{group_id: 2,
	user_id: 10},
	{group_id: 2,
	user_id: 3},
	{group_id: 2,
	user_id: 5},
	{group_id: 2,
	user_id: 7},
	{group_id: 2,
	user_id: 2},
	{group_id: 2,
	user_id: 8},
	{group_id: 2,
	user_id: 9},
	{group_id: 3,
	user_id: 1},
	{group_id: 3,
	user_id: 4},
	{group_id: 3,
	user_id: 7},
	{group_id: 3,
	user_id: 10},
	{group_id: 3,
	user_id: 9}
];
var songs = [];

var albums = [];

var group_songs = [];

var activity_items = [];

var group_albums = [];

var user_groups = [];

emitter.on('addSong', function(user_id, song, group_id){
	console.log("Add song event");
	//create new activity item
	var newAI = new ActivityItem(user_id, song.id, group_id);
	activity_items.push(newAI);
	console.log("Activity items: ", activity_items);
	//add to group_songs
	group_songs.push({group_id: group_id, song_id: song.id});
});

emitter.on('addGroup', function(group, user_id){
	console.log("Add group event");
	//create new activity item
	var newAI = new ActivityItem(user_id, undefined, group.id);
	activity_items.push(newAI);
	console.log("Activity items: ", activity_items);
	//add to user_groups
	user_groups.push({group_id: group.id, user_id: user_id});
});

emitter.on('addAlbum', function(user_id, album, group_id){
	console.log("Add album event");
	//create new activity item
	var newAI = new ActivityItem(user_id, album.id, group_id);
	activity_items.push(newAI);
	console.log("Activity items: ", activity_items);
	//add to group_albums
	group_albums.push({group_id: group_id, album_id: album.id});
});


function getSong(id){
	var songsLength = songs.length;
	var target = {};
	for(var i = 0; i < songsLength; i++){
		if(songs[i].id === id){
			target = songs[i];
		}
	}
	return target;
}

function getGroup(id){
	var groupsLength = groups.length;
	var target = {};
	for(var i = 0; i < groupsLength; i++){
		if(groups[i].id === id){
			target = groups[i];
		}
	}
	return target;
}

function getUser(id){
	var usersLength = users.length;
	var target = {};
	for(var i = 0; i < usersLength; i++){
		if(users[i].id === id){
			target = users[i];
		}
	}
	return target;
}

function getActivityItem(id){
	var activityItemsLength = activity_items.length;
	var target = {};
	for(var i = 0; i < activityItemsLength; i++){
		if(activity_items[i].id === id){
			target = {user: getUser(activity_items[i].user_id),
								group: activity_items[i].group_id,
								song: getSong(activity_items[i].song_id)
							};
		}
	}
	return target;
}

function getGroupActivityForFP(group_id){
	var activityItemsLength = activity_items.length;
	var targets = [];
	for(var i = 0; i < activityItemsLength; i++){
		console.log("Comparing: ", activity_items[i].group_id + ' and ' + group_id);
		if(Number(activity_items[i].group_id) === Number(group_id)){
			targets.push(getActivityItem(activity_items[i].id));
		}
	}
	return targets;
}

exports.getUserActivity = function(user_id){
	var activityItemsLength = activity_items.length;
	var targets = [];
	for(var i = 0; i < activityItemsLength; i++){
		console.log("Comparing: ", activity_items[i].user_id + 'and' + user_id);
		if(Number(activity_items[i].user_id) === Number(user_id)){
			targets.push(getActivityItem(activity_items[i].id));
			targets[i].group = getGroup(targets[i].group);
		}
	}
	return targets;
};

exports.getGroupActivity = function(group_id){
	var activityItemsLength = activity_items.length;
	var targets = [];
	for(var i = 0; i < activityItemsLength; i++){
		if(Number(activity_items[i].group_id) === Number(group_id)){
			targets.push(getActivityItem(activity_items[i].id));
		}
	}
	return targets;
};

exports.getUserGroups = function(user_id){
	var userGroupsLength = group_members.length;
	var targets = [];
	for(var i = 0; i < userGroupsLength; i++){
		if(group_members[i].user_id === user_id){
			targets.push(getGroup(group_members[i].group_id));
		}
	}

	for(var j = 0; j < targets.length; j++){
		targets[j].activity = getGroupActivityForFP(targets[j].id);
	}
	return targets;
};

exports.getGroupUsers = function(group_id){
	var groupUsersLength = group_members.length;
	var targets = [];
	for(var i = 0; i < groupUsersLength; i++){
		if(group_members[i].group_id === group_id){
			targets.push(getUser(group_members[i].user_id));
		}
	}
	return targets;
};

exports.addGroup = function(user_id, group){
	var newGroup = new Group(group.title);
	groups.push(newGroup);
	emitter.emit('addGroup', newGroup, user_id);
};

exports.addSong = function(user_id, group_id, song){
	var newSong = new Song(song.title, song.artist, song.album, group_id);
	songs.push(newSong);
	console.log("NEW SONG: ", songs);
	emitter.emit('addSong', user_id, newSong, group_id);
};

exports.addAlbum = function(user_id, group_id, album){
	var newAlbum = new Album(album.title);
	albums.push(newAlbum);
	emitter.emit('addAlbum', user_id, newAlbum, group_id);
};

exports.assembleActivity = function(group_id){
	var activityItemsLength = activity_items.length;
	var targets = [];
	for(var i = 0; i < activityItemsLength; i++){
		if(activity_items[i].group_id === group_id){
			targets.push(activity_items[i]);
		}
	}
	return targets;
};

exports.lastFiveSongs = function(user_id){
	var activityItemsLength = activity_items.length;
	var targets = [];
	for(var i = 0; i < activityItemsLength; i++){
		if(activity_items[i].user_id === user_id){
			targets.push(activity_items[i]);
		}
	}
	return targets;
};




// exports.addSong = function(song, group){
// 	//should add a song to song array / db
// 	song.id = song_id_iterator;
// 	song_id_iterator++;
// 	songs.push(song);
// 	console.log("SONGS: ", songs);
// 	user_songs.push({user_id: 8, song_id: song.id});
// 	console.log("USER SONGS: ", user_songs);
// 	group_songs.push({user_id: 8, song_id: song.id, group_id: group.id});
// 	console.log("GROUP SONGS: ", group_songs);
// };

// exports.getUserGroups = function(user_id){
// 	//should return array of groups user is a part of

// 	//go through group_members
// 		//check for groups that match user_id
// 		//store those group ids in an array
// 	var groupMemberListLength = group_members.length;
// 	var thisUsersGroups = [];
// 	var groupLength = groups.length;

// 	function hasUserId(element){
// 		return element.user_id === user_id;
// 	}

// 	var targetIds = group_members.filter(hasUserId);
// 	// console.log("Target Groups = ", targetIds);

// 	var targetLength = targetIds.length;

// 	for(var j = 0; j < groupLength; j++){
// 		for(var k = 0; k < targetLength; k++){
// 			if(groups[j].id === targetIds[k].group_id){
// 				thisUsersGroups.push(groups[j]);
// 			}
// 		}
// 	}
// 	return thisUsersGroups;
// };

// exports.getGroupMembers = function(group_id){
// 	var groupMemberListLength = group_members.length;
// 	var thisGroupsMembers = [];
// 	var userLength = users.length;

// 	function hasGroupId(element){
// 		return element.group_id === group_id;
// 	}

// 	var targetIds = group_members.filter(hasGroupId);
// 	// console.log("Target Groups = ", targetIds);

// 	for(var j = 0; j < userLength; j++){
// 		for(var k = 0; k < targetIds.length; k++){
// 			if(users[j].id === targetIds[k].user_id){
// 				thisGroupsMembers.push(users[j]);
// 			}
// 		}
// 	}
// 	return thisGroupsMembers;
// };

exports.getUser = function(user_id){
	function hasUserId(element){
		//Have to typecast to Number to get this to work for some reason :/
		return Number(element.id) === Number(user_id);
	}
	var targetUser = users.filter(hasUserId);
	if(targetUser.length >= 1){
		console.log("Found User: ", targetUser[0]);
		return targetUser[0];
	}
	else{
		//TODO handle no user found
		return false;
	}
};

// exports.getGroupSongs = function(group_id){
// 	var groupSongLength = group_songs.length;
// 	var groupLength = groups.length;
// 	var songsLength = songs.length;

// 	var thisGroupsSongs = [];
// 	function hasGroupId(element){
// 		//console.log(Number(element.id) + " vs" + Number(group_id) + ": ", Number(element.id) === Number(group_id));
// 		return Number(element.group_id) === Number(group_id);
// 	}

// 	var targetSongs = group_songs.filter(hasGroupId);

// 	for(var j = 0; j < songsLength; j++){
// 		for(var k = 0; k < targetSongs.length; k++){
// 			if(songs[j].id === targetSongs[k].song_id){
// 				thisGroupsSongs.push(songs[j]);
// 			}
// 		}
// 	}
// 	console.log("group's songs: ", thisGroupsSongs);
// 	return thisGroupsSongs;
// };

*/