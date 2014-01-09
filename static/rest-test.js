function UserListCtrl($scope, $http){
	$http.get("/users").success(function(result){
		console.log(result);
		$scope.users = result;
	});
}

function GroupListCtrl($scope, $http){
	$http.get("/groups").success(function(result){
		console.log(result);
		$scope.groups = result;
	});

}
function AIListCtrl($scope, $http){
	$http.get("/activity_items").success(function(result){
		console.log(result);
		$scope.ais = result;
	});
}

function AlbumListCtrl($scope, $http){
	$http.get("/albums").success(function(result){
		console.log(result);
		$scope.albums = result;
	});
}

function SongListCtrl($scope, $http){
	$http.get("/songs").success(function(result){
		console.log(result);
		$scope.songs = result;
	});
}