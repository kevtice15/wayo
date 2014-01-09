$(document).ready(function(){

	$.get('/api/user', function(response){
		console.log("RESP: ", response);
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

	$('#addNewSongForm').submit(function(event){
		var songTitle = $("#title-input").val();
		var songArtist = $("#artist-input").val();
		var songAlbum = $("#album-input").val();
		if((songTitle !== null || songTitle !== '') && (songArtist !== null || songArtist !== '')){
			console.log("Add new song clicked: ", event);
			handleNewSong({title: songTitle, artist: songArtist, album: songAlbum});
		}
		else{
			console.log("Handle empty string");
		}
	});

	//handleNewSong({title: "Yo Mama", artist: "Yo daddy", album: "Lettuce"});

});

function fillUserPanel(user){
	$('.profile-image').attr('src', user.imageUrl);
	$('.users-name').html(user.username);
}

function fillGroupsPanel(user){
	$.get('/api/group/set', {data: user.groups}, function(resp){
		console.log("RESP YO: ", resp);
		for(var group in resp){
			console.log(resp[group]);
			$('.template.group-panel-template').children().clone().find('.panel-title').html(resp[group].title).end().appendTo('.groups-column');
		}
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