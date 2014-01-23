var WayoApp = {
	WayoApp: function(){
		//this.Controller.UserProfilePanelController.init();
	}
};

WayoApp.Models = {};

WayoApp.Models.User = {
	User: function(){

	},
	get: function(callback){
		$.get("/api/user", function(response){
			console.log(response);
			callback(response);
		});
	},

	update: function(){

	},

	create: function(){

	},

	del: function(){

	}
};
WayoApp.Models.Song = {
	get: function(id, callback){
		$.get("/api/songs/" + id, function(response){
			console.log(response);
			callback(response);
		});
	},

	update: function(){

	},

	create: function(song, callback){
		$.post('/api/songs/add', song, function(resp){
			callback(resp);
			var titleTarget = $('#title-input').val("");
			var artistTarget = $('#artist-input').val("");
			var albumTarget = $('#album-input').val("");
			var ytTarget = $('#yt-input').val("");

			$('#addNewSongForm').hide();
		});
	},

	del: function(){

	}
};
WayoApp.Models.Album = {
	get: function(id, callback){
		$.get("/api/albums/" + id, function(response){
			console.log(response);
			callback(response);
		});
	},

	update: function(){

	},

	create: function(){

	},

	del: function(){

	}
};
WayoApp.Models.Group = {
	get: function(id, callback){
		$.get("/api/groups/" + id, function(response){
			console.log(response);
			callback(response);
		});
	},
	getBundle: function(groups, callback){
		$.get('/api/group/set', {data: groups}, function(response){
			callback(response);
		});
	},

	getAIBundle: function(id, callback){
		$.get('/api/groupActivity', {data: id}, function(response){
			callback(response);
		});
	},

	update: function(){

	},

	create: function(fields, callback){
		$.post('/api/group/add', fields, function(response){
			console.log(response);
			callback(response);
		});
	},

	del: function(){

	}
};
WayoApp.Models.ActivityItem = {
	get: function(id, callback){
		$.get("/api/activity_items/" + id, function(response){
			console.log(response);
			callback(response);
		});
	},

	update: function(){

	},

	create: function(){

	},

	del: function(){

	}
};

WayoApp.Controllers = {};

WayoApp.Controllers.UserProfilePanelController = {
	init: function(callback){
		WayoApp.Models.User.get(function(user){
			WayoApp.Views.UserProfilePanelView(user);
			
			$('#new-group-button').on('click', function(){
				$('#newGroupForm').show();
				$(this).addClass('disabled');
			});

			$('#submit-new-group').on('click', function(){
				var newGroupName = $('#group-name-input').val();
				console.log("submitting new group: ", newGroupName);

				WayoApp.Models.Group.create({title: newGroupName}, function(resp){
					console.log(resp);
					$('#newGroupForm').hide();
					$(this).removeClass('disabled');
				});
			});
		callback(user);
		});
	}
};

WayoApp.Controllers.GroupPanelController = {
	init: function(bundle){
		WayoApp.Models.Group.getBundle(bundle, function(groups){
			WayoApp.Views.GroupPanelView(groups);

			$('.groups-column').on('click', '#saveNewSongButton', function(event){
				var songTitle = $("#title-input").val();
				var songArtist = $("#artist-input").val();
				var songAlbum = $("#album-input").val();
				var songYtLink = $("#yt-input").val();
				console.log(songTitle);
				console.log(songArtist);
				console.log(songAlbum);
				console.log(songYtLink);

				if((songTitle !== null || songTitle !== '') && (songArtist !== null || songArtist !== '')){
					console.log("Posting song: ", {title: songTitle, artist: songArtist, album: songAlbum, youTubeLink: songYtLink, group_id: $(this).closest('.panel').data('id')});
					WayoApp.Models.Song.create({title: songTitle, artist: songArtist, album: songAlbum, youTubeLink: songYtLink, group_id: $(this).closest('.panel').data('id')}, function(resp){
						console.log(resp);
					});
				}
				else{
					console.log("Handle empty string");
				}
			});
		});
	}
};

WayoApp.Views = {};

WayoApp.Views.UserProfilePanelView = function(userData){
	console.log("Generate Profile for user: ", userData);
	var source = $('#user-profile-panel-template').html();
	var template = Handlebars.compile(source);
	var html = template(userData);
	$('.user-profile-panel').append(html);
};

WayoApp.Views.GroupPanelView = function(groups){
	console.log("Generate templates for groups: ", groups);
	var source = $('#group-panel-template').html();
	var template = Handlebars.compile(source);
	var context = {groups: groups};
	var html = template(context);
	$('.groups-column').append(html);
};

$(function(){
	//var app = new WayoApp();
	//TODO: Initialize controllers for profile page
	console.log("App loaded :" , WayoApp);
	WayoApp.Controllers.UserProfilePanelController.init(function(user){
		WayoApp.Controllers.GroupPanelController.init(user.groups);
	});

	WayoApp.Models.Group.getAIBundle('52df93dbaadf4afb07000001', function(resp){
		console.log(resp);
	});
});
