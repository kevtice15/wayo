$(document).ready(function(){
	$.get('/api/user', function(response){
		fillUserPanel(response);
		fillGroupsPanel(response);
	});

	$('#new-group-button').on('click', function(){
		$('#newGroupForm').show();
		$(this).addClass('disabled');
	});

	$('#submit-new-group').on('click', function(){
		var newGroupName = $('#group-name-input').val();
		console.log("submitting new group: ", newGroupName);

		$.post('/api/group/add', {title: newGroupName}, function(resp){
			console.log(resp);
			$('#newGroupForm').hide();
			$(this).removeClass('disabled');
		});
	});

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
			addNewSong({title: songTitle, artist: songArtist, album: songAlbum, youTubeLink: songYtLink, group_id: $(this).closest('.panel').data('id')});
		}
		else{
			console.log("Handle empty string");
		}
	});
});

function fillUserPanel(user){
	$('.profile-image').attr('src', user.imageUrl);
	$('.users-name').html(user.username);
}

function fillGroupsPanel(user){
	function spacesToUnderscores(string){
		return string.replace(' ', '_');
	}

	function getGroupActivity(id){
		$.get('/api/groupActivity', {data: id}, function(resp){
			console.log(resp);
		});
	}

	$.get('/api/group/set', {data: user.groups}, function(resp){
		for(var group in resp){
			$('.template.group-panel-template')
			.children()//Get the html in the template
			.clone()//Make a copy
			.find('.panel-title a')//Find the panel title anchor
			.html(resp[group].title)//Make it say the group name
			.attr("href", '#' + resp[group]._id)//Throw the group id on it for collapsing
			.end()//Go back to top level of template html
			.attr("data-id", resp[group]._id) //TODO: this wouldn't work with .data() WHY?
			.find('.panel-collapse')
			.attr("id", resp[group]._id)
			.end()
			.find('.panel-body button')
			.attr("data-target", "#addNewSongForm-" + resp[group]._id)
			.end()
			.find('#addNewSongForm')
			.attr("id", "addNewSongForm-" + resp[group]._id)
			.end()
			.appendTo('.groups-column');

			getGroupActivity(resp[group]._id);
			// $.get('/api/groupActivity', {data: resp[group]._id}, function(resp){
			// 	console.log(resp);
			// });
		}


	});
}

function addNewSong(song){
	//TODO add group id to song before its posted
	$.post('/api/songs/add', song, function(resp){
		console.log(resp);
		var titleTarget = $('#title-input').val("");
		var artistTarget = $('#artist-input').val("");
		var albumTarget = $('#album-input').val("");
		var ytTarget = $('#yt-input').val("");

		$('#addNewSongForm').hide();
	});
}


function UserPanelCtrl($scope, $http){
	$http.get("/api/users/8").success(function(result){
		console.log(result);
		$scope.user = result.data;
	});
}

function RecentSongsCtrl($scope, $http){
	$http.get("/api/activity", {
		params: {user_id: 8}}).success(function(result){
		console.log(result);
		$scope.songs = result.data;
	});
}

function UserGroupsCtrl($scope, $http, $window, $document){
	$http.get("/api/groups/8").success(function(result){
		$scope.groups = result.data;
		console.log("user group controller: ", $scope.groups);
	});


	$scope.handleNewSong = function($event, song, group){
		//POST new song to server and make button have success and be disabled
		console.log(group);
		var data = {song: song, group: group};
		if(song !== undefined){
			$http.post("/api/song", data).success(function(result){
				console.log(result);
				// if(result.success === true){
				// 	$event.target.className = "btn btn-success disabled";
				// 	$event.target.innerHTML = "Added Song!";
				// }
				//handleCloseModal();
			});
			// $http.get("/songs/" + group.id).success(function(result){
			// 	console.log(result);
			// 	$scope.groupSongs = result.data;
			// });
		}
	};

	var handleCloseModal = function(){
		//Change button back to blue and clickable
		//Clear input fields
		// var buttonTarget = $document[0].querySelectorAll('#addNewSongButton')[0];
		// buttonTarget.className = "btn btn-primary";
		// buttonTarget.innerHTML = "Save Changes";

		var titleTarget = $document[0].querySelectorAll('#title-input')[0];
		var artistTarget = $document[0].querySelectorAll('#artist-input')[0];
		var albumTarget = $document[0].querySelectorAll('#album-input')[0];

		titleTarget.value = "";
		artistTarget.value = "";
		albumTarget.value = "";
	};
}