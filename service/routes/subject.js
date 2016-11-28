
var express = require('express');
var router = express.Router();
const util = require('util');

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('subjects')
    console.log(util.inspect(req.query))
    var query = {}
    var title = req.query.title
    if (title) {
	query = {title: { $regex: title, $options: 'i'}}
    }
    collection.find(query,{},function(err, docs){
	if (err) {
	    res.json({msg: err});
	} else {
	    res.json(docs);
	}
    });
});

router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('subjects')
    collection.insert(req.body, function(err, result){
	res.send(
	    (err === null) ? { msg: ''} : { msg: err }
	);
    });
});

router.get('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('subjects');
    var id = req.params.id;
    collection.findOne({_id:id},{},function(err, docs){
        res.send((err === null) ? docs : { msg: err });
    });
});

router.post('/:id/citations', function(req, res) {
    var db = req.db;
    var collection = db.get('subjects')
    console.log('update citations')
    var id = req.params.id;
    collection.findOne({_id:id},{},function(err, docs){
        if (err !== null) {
	    res.send({ msg: err });
	} else {
	    console.log(docs);

	    update = {$set: {citations: [req.body.url]}}
	    if (docs.citations) {
		update = {$addToSet: {citations: req.body.url}}
	    }
	    console.log('calling update one');
	    console.log(update);
	    collection.findOneAndUpdate({_id:id}, update, function(err, result){
		console.log('citations callback')
		
		if (err === null) {
		    res.send({msg: ''});
		} else {
		    res.send({msg: err});
		}
	    });
	}
    });
});

router.delete('/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    var collection = db.findOne('subjects');
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
