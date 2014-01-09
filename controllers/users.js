var mongoose = require('mongoose');

exports.create = function(request, response) {
    var Resource = mongoose.model('User');
    var fields = request.body;

    var r = new Resource(fields);
    r.save(function(err, Resource) {
        if (err) {
            response.send(500, {error: err});
        }
        response.send(Resource);
    });
};

exports.retrieve = function(request, response) {
    var Resource = mongoose.model('User');
    if (request.data === undefined){
      Resource.find({}, function(err, coll) {
        response.send(coll);
      });
    }
    else {
      Resource.findById(request.data.id, function(err, Resource) {
        if (err) {
          response.send(500, {error: err});
        }
        else if (Resource) {
          response.send(Resource);
        }
        else {
          response.send(404);
        }
      });
    }
};

exports.retrieveCurrent = function(request, response) {
  var idToFind = mongoose.Types.ObjectId(request.session.passport.user);
  var Resource = mongoose.model('User');
    
  Resource.findById(idToFind, function(err, Resource) {
    if (err) {
      response.send(500, {error: err});
    }
    else if (Resource) {
      console.log("CURRENT USER FOUND");
      response.send(Resource);
    }
    else {
      response.send(404);
    }
  });
};

exports.update = function(request, response) {
    var Resource = mongoose.model('User');
    var fields = request.body;

    Resource.findByIdAndUpdate(request.data.id, {$set: fields}, function(err, Resource) {
        if (err) {
            response.send(500, {error: err});
        }
        else if (Resource) {
            response.send(Resource);
        }
        else {
            response.send(404);
        }
    });
};

exports.del = function(request, response) {
    var Resource = mongoose.model('User');

    Resource.findByIdAndRemove(request.params.id, function(err, Resource) {
        if (err) {
            response.send(500, {error: err});
        }
        else if (Resource) {
            response.send(200);
        }
        else {
            response.send(404);
        }
    });
};