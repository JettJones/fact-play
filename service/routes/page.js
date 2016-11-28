
var express = require('express');
var router = express.Router();
const util = require('util');

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('pagelist')
    collection.find({},{},function(err, docs){
	res.json(docs);
    });
});

router.put('/:id/subject', function(req, res) {
    var db = req.db;
    var collection = db.get('pagelist')
    var id = req.params.id;
    update = {$set: {subject: req.body.subject}}
    collection.findOneAndUpdate({_id:id}, update, function(err, result){
	if (err === null) {
	    res.send({msg: ''});
	} else {
	    res.send({msg: err});
	}
    });
});


module.exports = router;
