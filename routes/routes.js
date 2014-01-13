var users = require('../controllers/users');
var groups = require('../controllers/groups');
var albums = require('../controllers/albums');
var songs = require('../controllers/songs');
var activity_items = require('../controllers/activity_items');

module.exports = function(app, wayo){
	//Static routes
	app.get("/static/:filename", function(request, response){
		console.log("request.session: ", request.passport);
		response.sendfile("static/" + request.params.filename);
	});

	app.get("/static/bootstrap/css/:filename", function(request, response){
		response.sendfile("static/bootstrap/css/" + request.params.filename);
	});

	app.get("/static/bootstrap/js/:filename", function(request, response){
		response.sendfile("static/bootstrap/js/" + request.params.filename);
	});

	app.get("/static/lib/:filename", function(request, response){
		response.sendfile("static/lib/" + request.params.filename);
	});

	app.get("/static/bootstrap/fonts/:filename", function(request, response){
		response.sendfile("static/bootstrap/fonts/" + request.params.filename);
	});

	//User routes
	app.post("/api/users", function(request, response){
		users.create(request, response);
	});

	app.get("/api/users", function(request, response){
		users.retrieve(request, response);
	});

	app.get("/api/user", function(request, response){
		users.retrieveCurrent(request, response);
	});

	app.put("/api/users/:id", function(request, response){
		users.update(request, response);
	});

	app.delete("/api/users/:id", function(request, response){
		users.delete(request, response);
	});

	//Group routes
	app.post("/api/groups", function(request, response){
		groups.create(request, response);
	});

	app.get("/api/groups", function(request, response){
		groups.retrieve(request, response);
	});

	app.get("/api/groups/:id", function(request, response){
		groups.retrieve(request, response);
	});

	app.put("/api/groups/:id", function(request, response){
		groups.update(request, response);
	});

	app.delete("/api/groups/:id", function(request, response){
		groups.delete(request, response);
	});

	//Album routes
	app.post("/api/albums", function(request, response){
		albums.create(request, response);
	});

	app.get("/api/albums", function(request, response){
		albums.retrieve(request, response);
	});

	app.get("/api/albums/:id", function(request, response){
		albums.retrieve(request, response);
	});

	app.put("/api/albums/:id", function(request, response){
		albums.update(request, response);
	});

	app.delete("/api/albums/:id", function(request, response){
		albums.delete(request, response);
	});

	//Song routes
	app.post("/api/songs", function(request, response){
		songs.create(request, response);
	});

	app.get("/api/songs", function(request, response){
		songs.retrieve(request, response);
	});

	app.get("/api/songs/:id", function(request, response){
		songs.retrieve(request, response);
	});

	app.put("/api/songs/:id", function(request, response){
		songs.update(request, response);
	});

	app.delete("/api/songs/:id", function(request, response){
		songs.delete(request, response);
	});

	//Activity item routes
	app.post("/api/activity_items", function(request, response){
		activity_items.create(request, response);
	});

	app.get("/api/activity_items", function(request, response){
		activity_items.retrieve(request, response);
	});

	app.get("/api/activity_items/:id", function(request, response){
		activity_items.retrieve(request, response);
	});

	app.put("/api/activity_items/:id", function(request, response){
		activity_items.update(request, response);
	});

	app.delete("/api/activity_items/:id", function(request, response){
		activity_items.delete(request, response);
	});






	app.get("/api/users/:id", function(request, response){
		users.retrieve(request, response);
	});

	app.post("/api/group/add", function(request, response){
		wayo.addGroup(request.session, request.body);
	});

	app.get("/api/group/set", function(request, response){
		wayo.getGroupSet(request.query, response);
	});

	app.post("/api/songs/add", function(request, response){
		wayo.addSong(request, response);
	});

	app.get("/api/groupActivity", function(request, response){
		wayo.getGroupActivity(request, response);
	});

};